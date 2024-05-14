import {useMemo} from "react";
import {Outlet, useParams} from "react-router-dom";
import {NavLinkListProps} from "@src/types/Common";
import {useNotFindId} from "@src/hooks/common";
import {NavLinkList} from "@src/layout";
import {useSuspenseQuery} from "@apollo/client";
import {UpdateGroupOutletContext} from "@src/components/dataset/group/GroupOutletContext";
import {DatasetGroupListForUpdateDocument} from "@src/generated/gql/dataset/graphql";

export function UpdateGroupIndex() {
  useNotFindId('/datagroup/list');

  const {id} = useParams();

  const {data} = useSuspenseQuery(DatasetGroupListForUpdateDocument, {
    variables: {
      id
    }
  });

  const list = useMemo(() => {
    return [
      {path: `/dataset/group/update/basic/${id}`, text: '설정'},
      {path: `/dataset/group/update/data/${id}`, text: '데이터'},
    ] as NavLinkListProps[];
  }, [id]);

  return (
    <div className="contents">
      <h2>데이터 그룹 수정</h2>
      <div className="tabmenu">
        <ul>
          {
            list.map((item) => <NavLinkList key={item.path} {...item}/>)
          }
        </ul>
      </div>
      <Outlet context={{id, data} as UpdateGroupOutletContext}/>
    </div>
  )
}