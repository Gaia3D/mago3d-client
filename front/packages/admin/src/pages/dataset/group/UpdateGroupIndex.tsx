import {useMemo} from "react";
import {Outlet, useParams} from "react-router-dom";
import {NavLinkListProps} from "@src/types/Common";
import {useNotFindId} from "@src/hooks/common";
import {NavLinkList} from "@src/layout";
import {useSuspenseQuery} from "@apollo/client";
import {UpdateGroupOutletContext} from "@src/components/dataset/group/GroupOutletContext";
import {DatasetGroupListForUpdateDocument} from "@src/generated/gql/dataset/graphql";
import {useTranslation} from "react-i18next";

export function UpdateGroupIndex() {
  const {t} = useTranslation();
  useNotFindId('/datagroup/list');

  const {id} = useParams();

  const {data} = useSuspenseQuery(DatasetGroupListForUpdateDocument, {
    variables: {
      id
    }
  });

  const list = useMemo(() => {
    return [
      {path: `/dataset/group/update/basic/${id}`, text: 'basic-info'},
      {path: `/dataset/group/update/data/${id}`, text: 'data'},
    ] as NavLinkListProps[];
  }, [id]);

  return (
    <div className="contents">
      <h2>{t('edit-data-group')}</h2>
      <div className="tabmenu">
        <ul>
          {
            list.map((item) =>
              <NavLinkList key={item.path} {...item}/>
            )
          }
        </ul>
      </div>
      <Outlet context={{id, data} as UpdateGroupOutletContext}/>
    </div>
  )
}