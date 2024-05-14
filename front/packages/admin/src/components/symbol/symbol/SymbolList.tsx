import {useDeleteSymbolMutation, useSymbolGroups, useSymbolsQuery} from "@src/api/Symbol";
import {Key, useState} from "react";
import {Symbol} from "@mnd/shared/src/types/bbs-gen-type";
import {produce} from "immer";
import GroupSelectBox from "./GroupSelectBox";
import {useNavigate, useParams} from "react-router-dom";
import {Pagination} from "@mnd/shared";
import {useRecoilState} from "recoil";
import {symbolPageState} from "@src/recoils/Symbol";
import {SymbolFilterInput,} from "@src/generated/gql/bbs/graphql";

function SymbolList() {
  const {id} = useParams();
  const {data: {symbolGroups}} = useSymbolGroups();

  const [currentPage, setCurrentPage] = useRecoilState(symbolPageState);

  const [selectedGroupId, setSelectedGroupId] = useState<string>(id);
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const navigate = useNavigate();

  const deleteMutation = useDeleteSymbolMutation();

  const filter: SymbolFilterInput = {
    groupId: {
      eq: selectedGroupId,
    },
  };
  const pageable = {
    page: currentPage,
    size: 15,
  };

  const {data: {symbols: {items, pageInfo}}} = useSymbolsQuery({
    filter,
    pageable,
  });

  const handleUpdateButton = (id: Key) => {
    navigate(`/symbol/register/${id}`);
  };

  const handleDeleteButton = (id: string) => {
    deleteMutation.mutateAsync({
      id,
    }).then(() => {
      alert("삭제 완료");
    }).catch((e) => {
      console.error(e);
      alert("삭제 실패");
    });
  };

  const handleChangeGroup = (id: string) => {
    setSelectedGroupId(produce((draft) => (draft = id)));
    setCurrentPage(0);
  };

  return (
    <div className="contents">
      <h2>심볼 목록</h2>
      <GroupSelectBox
        symbolGroupsProp={symbolGroups}
        onChangeGroup={handleChangeGroup}
        selectedGroupId={selectedGroupId}
      />
      <ul className="symbol-list">
        {items && items.length > 0 ? (
          items.map((symbol: Symbol, index: Key) => {
            return (
              <li key={index} onClick={() => setSelectedSymbol(symbol.id)}>
                <div className="symbol-btn">
                  <img src={symbol.files[symbol.files.length-1]?.download} />
                  {selectedSymbol === symbol.id && (
                    <div>
                      <button
                        type="button"
                        className="btn-s"
                        onClick={() => handleUpdateButton(symbol.id)}
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="btn-s"
                        onClick={() => handleDeleteButton(symbol.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <div> 심볼이 없습니다.</div>
        )}
      </ul>
      {pageInfo.totalPages > 0 ? (
        <Pagination
          page={pageInfo.page}
          totalPages={pageInfo.totalPages}
          handler={setCurrentPage}
        />
      ) : null}
    </div>
  );
}

export default SymbolList;
