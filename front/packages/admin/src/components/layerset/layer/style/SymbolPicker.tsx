import React, { useState } from 'react';
import { useSymbolGroups, useSymbolsQuery } from '@src/api/Symbol';
import { SymbolFilterInput } from '@src/generated/gql/bbs/graphql';
import { useRecoilState } from 'recoil';
import { symbolPageState } from '@src/recoils/Symbol';
import GroupSelectBox from '@src/components/symbol/symbol/GroupSelectBox';
import { Pagination } from '@mnd/shared';

interface SymbolPickerProps {
  onSelect: (src: string) => void;
  onClose: () => void;
}

const SymbolPicker = ({ onSelect, onClose }: SymbolPickerProps) => {
  const { data: { symbolGroups = [] } = {} } = useSymbolGroups();
  const [currentPage, setCurrentPage] = useRecoilState(symbolPageState);
  const [selectedGroupId, setSelectedGroupId] = useState<string>();

  const filter: SymbolFilterInput = {
    groupId: { eq: selectedGroupId },
  };

  const pageable = { page: currentPage, size: 10 };

  const {
    data: {
      symbols: {
        items = [],
        pageInfo = { page: 0, totalPages: 0 }
      } = {}
    } = {},
    isLoading,
  } = useSymbolsQuery({ filter, pageable });

  const handleChangeGroup = (id: string) => {
    setSelectedGroupId(id);
    setCurrentPage(0);
  };

  console.log("items", items);

  return (
    <div className="symbol-picker-wrapper">
      <div className="symbol-picker-backdrop" onClick={onClose}/>
      <div className="symbol-picker-container">
        <GroupSelectBox
          symbolGroupsProp={symbolGroups}
          onChangeGroup={handleChangeGroup}
          selectedGroupId={selectedGroupId}
        />

        {isLoading ? (
          <div className="symbol-picker-loading">로딩 중...</div>
        ) : items.length > 0 ? (
          <ul className="symbol-picker-grid">
            {items.map((symbol) => {
              const src = symbol.files[symbol.files.length - 1]?.download;
              return (
                <li key={symbol.id}>
                  <div
                    className="symbol-picker-item"
                    onClick={() => {
                      if (src) onSelect(src);
                      onClose();
                    }}
                  >
                    <img src={src} alt="symbol"/>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div>심볼이 없습니다.</div>
        )}

        {pageInfo.totalPages > 1 && (
          <Pagination
            page={pageInfo.page}
            totalPages={pageInfo.totalPages}
            handler={setCurrentPage}
          />
        )}
      </div>
    </div>

  );
};

export default SymbolPicker;
