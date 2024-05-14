import {getThumbnailFullPath} from "@/api/Mapnote";
import {bbsGraphqlFetcher} from "@/api/queryClient";
import {GET_SYMBOLGROUPS, GET_SYMBOLS} from "@/graphql/bbs/Query";
import {CurrentSymbolId, CurrentSymbolThumbnailState, IsSymbolDefineState, SymbolPageState} from "@/recoils/Mapnote";
import {PaginationInfo, Query, SymbolGroup, SymbolPaged} from "@mnd/shared/src/types/bbs-gen-type";
import {DefaultError, useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState} from "recoil";
import Pagination from "@/components/Pagination.tsx";

export const MapNoteSymbolDefineViewPortal = () => {
  const isSymbolDefine = useRecoilValue(IsSymbolDefineState);
  const el = document.querySelector("#map");
  return el && isSymbolDefine ? ReactDOM.createPortal(<MapNoteSymbolDefineView/> , el) : null;
};

export const MapNoteSymbolDefineView = () => {

  const pageState = useRecoilState<number>(SymbolPageState);
  const [page, setPage] = pageState;
  const resetPage = useResetRecoilState(SymbolPageState);
  const setCurrentSymbolThumbnail = useSetRecoilState<string>(CurrentSymbolThumbnailState);
  const setCurrentSymbolId = useSetRecoilState<number>(CurrentSymbolId);
  const [selectedSymbolGroupId, setSelectedSymbolGroupId] = useState<number>(0);
  const [selectedSymbolThumbnailId, setSelectedSymbolThumbnailId] = useState<number>(0);
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>(0);
  const setIsSymbolDefine = useSetRecoilState(IsSymbolDefineState);
  const { data: symbolGroups } = useQuery<Query, DefaultError, SymbolGroup[]>({
      queryKey: ['symbolGroups'],
      queryFn: () => bbsGraphqlFetcher(GET_SYMBOLGROUPS),
      select: (data) => data.symbolGroups,
  });
  
  useEffect(() => {
      if(symbolGroups && symbolGroups.length > 0 && !selectedSymbolGroupId) {
          setSelectedSymbolGroupId(Number(symbolGroups[0].id));
      }
  }, [symbolGroups]);

  const { data: symbols} = useQuery<Query, DefaultError, SymbolPaged>({
      queryKey: ['symbols', selectedSymbolGroupId, page],
      queryFn: () => bbsGraphqlFetcher(GET_SYMBOLS, {id: selectedSymbolGroupId, pageable: {page: page, size: 15, sort: "CREATED_AT_DESC"}}),
      enabled: !!selectedSymbolGroupId,
      select: (data) => data.symbols,
  });

  const { items, pageInfo } = symbols ?? {items: [], pageInfo: {} as PaginationInfo};

  useEffect(() => {
      if(items && items.length > 0 && !selectedSymbolThumbnailId && !selectedSymbolId) {
          setSelectedSymbolThumbnailId(Number(items[0].files[0]?.id));
          setSelectedSymbolId(Number(items[0].id));
      }
  }, [items]);

  return (
      <div className="dialog-symbol darkMode">
          <div className="dialog-title">
              <h3>심볼정의</h3>
              <button className="close floatRight" onClick={()=> {
                setCurrentSymbolId(0);
                setIsSymbolDefine(false)
              }}></button>
          </div>
        <div className="dialog-content">
          <img className="symbol-image" alt="" src={getThumbnailFullPath(selectedSymbolThumbnailId)}/>
          <select
            className="symbol-category marginTop-16"
            onChange={(event) => {
              setSelectedSymbolGroupId(Number(event.target.value));
              resetPage();
            }}
            value={selectedSymbolGroupId}
          >
            {
              symbolGroups?.map((symbolGroup) => (
                <option key={symbolGroup.id} value={symbolGroup.id}>{symbolGroup.name}</option>
              ))
            }
          </select>
          <div className="result-total-darkMode marginTop-16">
            <div className="total-left">
              <span className="value02">{pageInfo.totalItems}</span>
              <span className="unit">건</span>
            </div>
            <div className="total-right">
              <span className="title">{pageInfo.page + 1}</span>
              <span className="dash">/</span>
              <span className="value">{pageInfo.totalPages}</span>
            </div>
          </div>
          <div>
            <ul className="symbol-list marginTop-16">
              {
                items?.map((symbol) => {
                  const thumbnailId = symbol.files[0]?.id ?? 0;
                  return (
                    <li key={thumbnailId} onClick={() => {
                      setSelectedSymbolId(Number(symbol.id));
                      setSelectedSymbolThumbnailId(Number(thumbnailId))
                    }}>
                      <img alt="" src={getThumbnailFullPath(thumbnailId)}/>
                    </li>
                  )
                })
              }
            </ul>
            {
              pageInfo.totalItems > 0 && <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} pagePerCount={pageInfo.size} handler={setPage} className={"paging-darkMode"}/>
            }
          </div>
        </div>
        <div className="darkMode-btn">
          <button type="button" className="register"
                  onClick={() => {
                    setCurrentSymbolThumbnail(getThumbnailFullPath(selectedSymbolThumbnailId));
                    setCurrentSymbolId(selectedSymbolId);
                    setIsSymbolDefine(false);
                  }}
          >적용
          </button>
        </div>
      </div>
  )
}