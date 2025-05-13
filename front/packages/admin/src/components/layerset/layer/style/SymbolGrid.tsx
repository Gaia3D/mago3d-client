import React from 'react';
import { useSymbolsQuery } from '@src/api/Symbol';
import { SymbolFilterInput, SymbolPageable } from '@src/generated/gql/bbs/graphql';
import { Pagination } from '@mnd/shared';

interface SymbolGridProps {
  groupId: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onSelect: (src: string) => void;
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
          const src = symbol.files[symbol.files.length - 1]?.download;
          return (
            <li key={symbol.id}>
              <div
                className="symbol-picker-item"
                onClick={() => {
                  if (src) {
                    onSelect(src);
                    onClose();
                  }
                }}
              >
                <img src={src} alt="symbol" />
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
