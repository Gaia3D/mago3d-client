import {useMemo} from "react";
import {Outlet, useParams} from "react-router-dom";
import {NavLinkListProps} from "@src/types/Common";
import {useNotFindId} from "@src/hooks/common";
import {NavLinkList} from "@src/layout";
import {useSuspenseQuery} from "@apollo/client";
import {LayerGroupDocument} from "@src/generated/gql/layerset/graphql";
import {UpdateLayerGroupOutletContext} from "@src/components/layerset/group/GroupOutletContext";

export function UpdateLayerGroupIndex() {
  useNotFindId('/layerset/group');

  const {id} = useParams();
  const {data} = useSuspenseQuery(LayerGroupDocument, {
    variables: {
      id
    }
  });

  const list = useMemo(() => {
    return [
      {path: `/layerset/group/update/basic/${id}`, text: '설정'},
      {path: `/layerset/group/update/data/${id}`, text: '레이어'},
    ] as NavLinkListProps[];
  }, [id]);

  return (
    <div className="contents">
      <h2>레이어 그룹 수정</h2>
      <div className="tabmenu">
        <ul>
          {
            list.map((item) => <NavLinkList key={item.path} {...item}/>)
          }
        </ul>
      </div>
      <Outlet context={{id, data} as UpdateLayerGroupOutletContext}/>
    </div>
  )
}