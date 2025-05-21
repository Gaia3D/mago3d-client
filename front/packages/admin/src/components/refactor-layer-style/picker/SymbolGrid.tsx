import React from 'react';
import {SymbolFilterInput, SymbolPageable} from "@src/generated/gql/bbs/graphql";
import {useSymbolsQuery} from "@src/api/Symbol";
import {Pagination} from "@mnd/shared";

interface SymbolGridProps {
  groupId: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onSelect: (id: string, src: string) => void;
  onClose: () => void;
}

const SymbolGrid = ({ groupId, currentPage, setCurrentPage, onSelect, onClose }: SymbolGridProps) => {
  const filter: SymbolFilterInput = { groupId: { eq: groupId } };
  const pageable: SymbolPageable = { page: currentPage, size: 15 };

  const {
    data: {
      symbols: {
        items = [],
        pageInfo = { page: 0, totalPages: 0 }
      } = {}
    } = {}
  } = useSymbolsQuery({ filter, pageable});

  if (!items.length) return <div>심볼이 없습니다.</div>;

  return (
    <>
      <ul className="symbol-picker-grid">
        {items.map((symbol) => {
          const symbolData = symbol.files[symbol.files.length - 1];
          if (!symbolData) return;
          const symbolSrc = symbolData?.download;
          const symbolId = symbolData?.id;
          return (
            <li key={symbol.id}>
              <div
                className="symbol-picker-item"
                onClick={() => {
                  if (symbolId) {
                    onSelect(symbolId, symbolSrc);
                    onClose();
                  }
                }}
              >
                <img src={symbolSrc} alt="symbol" />
              </div>
            </li>
          );
        })}
      </ul>
      {pageInfo.totalPages > 1 && (
        <Pagination
          page={pageInfo.page}
          totalPages={pageInfo.totalPages}
          handler={setCurrentPage}
        />
      )}
    </>
  );
};

export default SymbolGrid;