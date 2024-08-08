import {useOutletContext} from "react-router-dom";
import {useToPath} from "@src/hooks/common";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {classifyAssetTypeClassName} from "@src/api/Data";
import {dataFormatter} from "@mnd/shared";
import {UpdateGroupOutletContext} from "./GroupOutletContext";
import {useMutation} from "@apollo/client";
import {DatasetDeleteAssetDocument, DatasetGroupListForUpdateDocument} from "@src/generated/gql/dataset/graphql";
import {useTranslation} from "react-i18next";

const UpdateData = () => {
  const {t} = useTranslation();
  const back = useToPath('/dataset/group');
  const {data} = useOutletContext<UpdateGroupOutletContext>();

  const [deleteMutation] = useMutation(DatasetDeleteAssetDocument, {
    refetchQueries: [DatasetGroupListForUpdateDocument]
  })

  const deleteDataAsset = (id: string) => {
    if (!confirm(t('question.delete'))) return;
    deleteMutation({
      variables: {
        id
      }
    }).then(() => {
      alertToast(t('success.delete'));
    });
  }

  const {assets} = data.group;

  return (
    <>
      <div className="list04-sort title-inner">
        <table>
          <caption>{t('edit-data-group')}</caption>
          <thead>
          <tr>
            <th>{t('data')} <a className="sort" href="#"></a></th>
            <th>{t('type')} <a className="sort" href="#"></a></th>
            <th>{t('delete')}</th>
            <th>{t('created-at')} <a className="sort" href="#"></a></th>
          </tr>
          </thead>
        </table>
      </div>
      <div className="list04-sort inner">
        <table>
          <tbody>
          {
            assets.length > 0 ?
              assets.map(({id, name, assetType, createdAt}) => {
                return (
                  <tr key={id} style={{cursor:"default"}}>
                    <td>{name}</td>
                    <td><span className={classifyAssetTypeClassName(assetType)}>{assetType}</span></td>
                    <td>
                      <button type="button" className="btn-s-edit" onClick={() => deleteDataAsset(id)}>
                        {t('delete')}
                      </button>
                    </td>
                    <td>{dataFormatter(createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
                  </tr>
                )
              })
              :
              <tr>
                <td colSpan={4}>{t('not-found.data')}</td>
              </tr>
          }
          </tbody>
        </table>
      </div>
      <div className="alg-right">
        <button type="button" className="btn-l-cancel" onClick={back}>{t('cancel')}</button>
      </div>
    </>
  )
}

export default UpdateData;