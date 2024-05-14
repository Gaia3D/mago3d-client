import React, {useState} from "react";
import {useSymbolGroups} from "@src/api/Symbol";
import {produce} from "immer";
import GroupForm from "./GroupForm";
import {SymbolGroup, SymbolGroupsDocument} from "@src/generated/gql/bbs/graphql";

function GroupList() {
  const [selectedGroup, setSelectedGroup] = useState<SymbolGroup>(
    {} as SymbolGroup
  );

  const {data: {symbolGroups}, refetch} = useSymbolGroups();

  const handleListClick = (item) => {
    setSelectedGroup(
      produce((draft) => {
        Object.assign(draft, item);
      })
    );
  };

  const clearForm = () => {
    refetch();

    setSelectedGroup(
      produce((draft) => {
        draft.id = undefined;
        draft.name = undefined;
        draft.enabled = undefined;
      })
    );
  };

  return (
    <div className="contents">
      <h2> 심볼 그룹 관리 </h2>
      <div className="symbol-group-list">
        <ul>
          {symbolGroups && symbolGroups.length > 0 ? (
            symbolGroups.map((group, index) => {
              return (
                <li key={index} onClick={() => handleListClick(group)}>
                  <div className="name">{group.name}</div>
                  <div className="number">{group.count}</div>
                </li>
              );
            })
          ) : (
            <li>
              <div> 데이터가 없습니다.</div>
            </li>
          )}
        </ul>
      </div>
      <GroupForm
        id={selectedGroup.id}
        name={selectedGroup.name}
        enabled={selectedGroup.enabled}
        onClickNew={clearForm}
      />
    </div>
  );
}

export default GroupList;
