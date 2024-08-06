import {useOutletContext} from "react-router-dom";
import {useToPath} from "@src/hooks/common";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {dataFormatter} from "@mnd/shared";
import {UpdateLayerGroupOutletContext} from "./GroupOutletContext";
import {useMutation} from "@apollo/client";
import {
  LayerAssetBasicFragmentDoc, LayerAssetType,
  LayerGroupDocument,
  LayersetDeleteAssetDocument
} from "@src/generated/gql/layerset/graphql";
import {useFragment} from "@src/generated/gql/layerset";
import {classifyAssetTypeClassNameByLayerAssetType} from "@src/api/Data";
import {useTranslation} from "react-i18next";

const UpdateLayer = () => {
  const { t } = useTranslation();
  const back = useToPath('/layerset/group');
  const {data} = useOutletContext<UpdateLayerGroupOutletContext>();
  const assets = useFragment(LayerAssetBasicFragmentDoc, data.group.assets);

  const [deleteMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayerGroupDocument]
  })

  const deleteAsset = (id: string) => {
    if (!confirm(t("question.delete"))) return;
    deleteMutation({
      variables: {
        ids: id
      }
    }).then(() => {
      alertToast(t("success.deleted"));
    });
  }

  return (
    <>
      <div className="list04-sort title-inner">
        <table>
          <caption>{t("group-sub-layer-list")}</caption>
          <thead>
          <tr>
            <th>{t("data")} <a className="sort" href="#"></a></th>
            <th>{t("type")} <a className="sort" href="#"></a></th>
            <th>{t("delete")}</th>
            <th>{t("created-at")} <a className="sort" href="#"></a></th>
          </tr>
          </thead>
        </table>
      </div>
      <div className="list04-sort inner">
        <table>
          <tbody>
          {
            assets.length > 0 ? assets.map(({id, name, type, createdAt}) => {
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>
                      <button type="button" className={classifyAssetTypeClassNameByLayerAssetType(type) + " mar-r20"}>
                        {type === LayerAssetType.Layergroup ? 'HYBRID' : type}
                      </button>
                    </td>
                    <td>
                      <button type="button" className="btn-s-edit" onClick={() => deleteAsset(id)}>{t("delete")}</button>
                    </td>
                    <td>{dataFormatter(createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
                  </tr>
                )
              })
              :
              <tr>
                <td colSpan={4}>{t("not-found.data")}</td>
              </tr>
          }
          </tbody>
        </table>
      </div>
      <div className="alg-right">
        <button type="button" className="btn-l-cancel" onClick={back}>{t("cancel")}</button>
      </div>
    </>
  )
}

export default UpdateLayer;