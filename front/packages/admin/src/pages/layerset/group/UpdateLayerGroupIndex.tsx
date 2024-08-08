import {useMemo} from "react";
import {Outlet, useParams} from "react-router-dom";
import {NavLinkListProps} from "@src/types/Common";
import {useNotFindId} from "@src/hooks/common";
import {NavLinkList} from "@src/layout";
import {useSuspenseQuery} from "@apollo/client";
import {LayerGroupDocument} from "@src/generated/gql/layerset/graphql";
import {UpdateLayerGroupOutletContext} from "@src/components/layerset/group/GroupOutletContext";
import {useTranslation} from "react-i18next";

export function UpdateLayerGroupIndex() {
  useNotFindId('/layerset/group');
  const { t } = useTranslation();
  const {id} = useParams();
  const {data} = useSuspenseQuery(LayerGroupDocument, {
    variables: {
      id
    }
  });

  const list = useMemo(() => {
    return [
      {path: `/layerset/group/update/basic/${id}`, text: t("settings")},
      {path: `/layerset/group/update/data/${id}`, text: t("layer")},
    ] as NavLinkListProps[];
  }, [id]);

  return (
    <div className="contents">
      <h2>{t("layer-group-edit")}</h2>
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