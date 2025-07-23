import React, {useState} from "react";
import {useSymbolGroups} from "@src/api/Symbol";
import {produce} from "immer";
import GroupForm from "./GroupForm";
import {SymbolGroup} from "@src/generated/gql/bbs/graphql";

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
    <div className="contents symbol-group-page">
      <h2>심볼 그룹 관리</h2>

      <div className="symbol-group-container">
        <div className="symbol-group-list">
          <ul>
            {symbolGroups && symbolGroups.length > 0 ? (
              symbolGroups.map((group, index) => (
                <li key={index} onClick={() => handleListClick(group)}>
                  <div className="group-name">{group.name}</div>
                  <div className="group-count">{group.count}</div>
                </li>
              ))
            ) : (
              <li className="empty">
                <div>데이터가 없습니다.</div>
              </li>
            )}
          </ul>
        </div>

        <div className="symbol-group-form-wrapper">
          <GroupForm
            id={selectedGroup.id}
            name={selectedGroup.name}
            enabled={selectedGroup.enabled}
            onClickNew={clearForm}
          />
        </div>
      </div>
    </div>

  );
}

export default GroupList;
