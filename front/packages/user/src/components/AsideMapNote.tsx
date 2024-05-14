import {useMapNote, useMapNoteEntityDraw, useRefetchMapNote} from "@/hooks/useMapNote";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { popupState } from "./MapPopup";
import { CoordinateFromReadCoordinateState, MapNoteCurrentPageState } from "@/recoils/Mapnote";
import { MapNoteSymbolDefineViewPortal } from "./mapnote/MapNoteSymbolDefineView";
import { MapNoteCreateView } from "./mapnote/MapNoteCreateView";
import { MapNoteListView } from "./mapnote/MapNoteListView";
import Pagination from "./Pagination";
import {MapNoteUploadView} from "@/components/mapnote/MapNoteUploadView.tsx";
import {useMutation} from "@tanstack/react-query";
import {bbsGraphqlFetcher} from "@/api/queryClient.ts";
import {DELETE_ALL_MAP_NOTES} from "@/graphql/bbs/Mutation.ts";
import keycloak from "@/api/keycloak.ts";
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";

const MapNoteCreateLi = () => {
    const liRef = useRef<HTMLLIElement>(null);
    const setPopup = useSetRecoilState(popupState);
    const coordinateFromReadCoordinate = useRecoilValue(CoordinateFromReadCoordinateState);
    const OpenCreateView = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        setPopup((prev) => {
        const popup = <MapNoteCreateView />;

        if (prev == popup) {
            return null;
        }
        return popup;
        });
    };

    useEffect(() => {
      if (!coordinateFromReadCoordinate) return;
      liRef.current?.click();
    }, [coordinateFromReadCoordinate]);

    return (
        <li style={{cursor:"pointer"}} ref={liRef} onClick={OpenCreateView}>
            <a>지점등록</a>
        </li>
    )
}

export const AsideMapNote = () => {

  const refetch = useRefetchMapNote();
  const { notePaged } = useMapNote();
  useMapNoteEntityDraw();
  const setPopup = useSetRecoilState(popupState);
  const setCoordinateFromReadCoordinate = useSetRecoilState(CoordinateFromReadCoordinateState);
  const setPage = useSetRecoilState<number>(MapNoteCurrentPageState);

  const {mutateAsync: deleteAllMapNoteAsync} = useMutation({
    mutationFn: () => {
      return bbsGraphqlFetcher(DELETE_ALL_MAP_NOTES);
    }
  });

  useLayoutEffect(() => {
    return () => {
      setPopup(null);
      setCoordinateFromReadCoordinate(null);
    };
  }, []);

  const OpenCreateView = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    setPopup((prev) => {
      const popup = <MapNoteUploadView />;

      if (prev == popup) {
        return null;
      }
      return popup;
    });
  };

  const deleteAll = () => {
    if (!confirm('삭제하시겠습니까?')) return;

    deleteAllMapNoteAsync()
      .then((result) => {
        console.info(result);
        alert('삭제되었습니다.');
        refetch();
      }).catch((error) => {
        alert('삭제에 실패했습니다.');
      });

  }

  const downloadExcel = () => {

    const {token} = keycloak;
    if (!token) return;

    const config: AxiosRequestConfig = {
      method: 'get',
      url: import.meta.env.VITE_API_URL + '/app/api/bbs/mapnote/download/excel',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*', // 여기에 Accept 헤더를 추가합니다.
      },
      responseType: 'blob',
    }

    axios(config)
      .then((response: AxiosResponse) => {
        const data = response.data;
        const blob = new Blob([data], { type: response.headers['content-type'] || 'application/octet-stream' }); // 서버에서 제공하는 MIME type에 따라 Blob을 생성합니다.

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'mapnote.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      });

  }

  const { items, pageInfo } = notePaged;
  return (
    <>
      <MapNoteSymbolDefineViewPortal />
      <aside className="gray-bg">
        {/* <div className="aside-search width-88 marginTop-20">
          <form id="" method="post" action="">
            <input type="text" className="aside-searh-type boxShadow-basic" placeholder="검색어를 입력하세요." />
          </form>
        </div> */}
        <div className="aside-content marginTop-20">
          <ul className="register width-88">
            <MapNoteCreateLi />
            <li style={{cursor: "pointer"}} onClick={OpenCreateView}>
              <a>일괄등록</a>
            </li>
            <li style={{cursor: "pointer"}} onClick={deleteAll}>
              <a>일괄삭제</a>
            </li>
            <li style={{cursor: "pointer"}} onClick={downloadExcel}>
              <a>다운로드</a>
            </li>
          </ul>
          <div className="result-total marginTop-16">
            <div className="total-left">
            <span className="fontColorOrange">{pageInfo.totalItems}</span>
                    <span className="fontColorGray">건</span>
                </div>
                <div className="total-right">
                    <span className="title">{pageInfo.page + 1}</span>
                    <span className="dash">/</span>
                    <span className="value">{pageInfo.totalPages}</span>
                </div>
            </div>
          <div className="height-95 yScroll">
            {items.map((note) => (
              note && <MapNoteListView key={note.id} mapnote={note} />
            ))}
          </div>
          {
                pageInfo.totalItems > 0 && <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} 
                pagePerCount={pageInfo.size} handler={setPage} 
                styleProps={{
                    marginLeft:'50px',
                }}/>
          }
        </div>
      </aside>
    </>
  );
};