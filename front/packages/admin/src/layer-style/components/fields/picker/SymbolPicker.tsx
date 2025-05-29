import React, {Suspense, useState} from 'react';
import {useSymbolGroups} from "@src/api/Symbol";
import GroupSelectBox from "@src/layer-style/components/fields/picker/GroupSelectBox";
import SymbolGrid from "@src/layer-style/components/fields/picker/SymbolGrid";

interface SymbolPickerProps {
  onSelect: (id: string, src: string) => void;
  onClose: () => void;
}

const SymbolPicker = ({ onSelect, onClose }: SymbolPickerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { data: { symbolGroups = [] } = {} } = useSymbolGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(symbolGroups[0].id);

  const handleChangeGroup = (id: string) => {
    setSelectedGroupId(id);
    setCurrentPage(0);
  };

  return (
    <div className="symbol-picker-wrapper">
      <div className="symbol-picker-backdrop" onClick={onClose}/>
      <div className="symbol-picker-container">
        <GroupSelectBox
          symbolGroupsProp={symbolGroups}
          onChangeGroup={handleChangeGroup}
          selectedGroupId={selectedGroupId}
        />
        {selectedGroupId && (
          <Suspense fallback={<></>}>
            <SymbolGrid
              groupId={selectedGroupId}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onSelect={onSelect}
              onClose={onClose}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default SymbolPicker;