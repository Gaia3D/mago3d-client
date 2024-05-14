import { ChangeEvent, Key, useEffect, useState } from "react";
import { produce } from "immer";
import {
  SymbolAccess,
  SymbolGroup,
} from "@src/generated/gql/bbs/graphql";

type SymbolGroups = {
  id: string;
  name: string;
  order: number;
  count: number;
  enabled: boolean;
  collapsed: boolean;
  access: SymbolAccess;
};

function GroupSelectBox({
  symbolGroupsProp,
  onChangeGroup,
  selectedGroupId,
}: {
  symbolGroupsProp: SymbolGroups[];
  onChangeGroup: (id: string) => void;
  selectedGroupId: Key;
}) {
  const [selectedGroup, setSelectedGroup] = useState<SymbolGroup>(
    {} as SymbolGroup
  );
  const handleGroupChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selected = symbolGroupsProp.find((group) => group.id === selectedId);

    setSelectedGroup(
      produce((draft) => {
        Object.assign(draft, selected);
      })
    );
  };

  useEffect(() => {
    if (selectedGroup && selectedGroup.id) {
      onChangeGroup(selectedGroup.id);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroupId) {
      const selected = symbolGroupsProp.find(
        (group) => group.id === selectedGroupId
      );
      setSelectedGroup(
        produce((draft) => {
          Object.assign(draft, selected);
        })
      );
    } else if (symbolGroupsProp && symbolGroupsProp.length > 0) {
      setSelectedGroup(
        produce((draft) => Object.assign(draft, symbolGroupsProp[0]))
      );
    }
  }, []);

  return (
    <>
      <div className="alg-left mar-b10">
        <select
          value={selectedGroup ? selectedGroup.id : ""}
          onChange={handleGroupChange}
        >
          {symbolGroupsProp && symbolGroupsProp.length > 0 ? (
            symbolGroupsProp.map((group: SymbolGroup, index: Key) => {
              return (
                <option key={index} value={group.id}>
                  {group.name}
                </option>
              );
            })
          ) : (
            <option> 그룹을 선택해주세요. </option>
          )}
        </select>
        <span className="result-list mar-l10">
          전체 : 총{" "}
          <span className="skyblue">
            {" "}
            {selectedGroup ? selectedGroup.count : 0}
          </span>{" "}
          건
        </span>
      </div>
    </>
  );
}

export default GroupSelectBox;
