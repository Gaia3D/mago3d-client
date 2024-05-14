import {useOutletContext} from "react-router-dom";
import {useToPath} from "@src/hooks/common";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {classifyAssetTypeClassName} from "@src/api/Data";
import {dataFormatter} from "@mnd/shared";
import {UpdateGroupOutletContext} from "./GroupOutletContext";
import {useMutation} from "@apollo/client";
import {DatasetDeleteAssetDocument, DatasetGroupListForUpdateDocument} from "@src/generated/gql/dataset/graphql";

const UpdateData = () => {
  const back = useToPath('/dataset/group');
  const {data} = useOutletContext<UpdateGroupOutletContext>();

  const [deleteMutation] = useMutation(DatasetDeleteAssetDocument, {
    refetchQueries: [DatasetGroupListForUpdateDocument]
  })

  const deleteDataAsset = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    deleteMutation({
      variables: {
        id
      }
    }).then(() => {
      alertToast('삭제되었습니다.');
    });
  }

  const {assets} = data.group;
  return (
    <>
      <div className="list04-sort title-inner">
        <table>
          <caption>데이터 그룹 수정</caption>
          <thead>
          <tr>
            <th>데이터 <a className="sort" href="#"></a></th>
            <th>타입 <a className="sort" href="#"></a></th>
            <th>삭제</th>
            <th>등록일 <a className="sort" href="#"></a></th>
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
                  <tr key={id}>
                    <td>{name}</td>
                    <td><span className={classifyAssetTypeClassName(assetType)}>{assetType}</span></td>
                    <td>
                      <button type="button" className="btn-s-edit" onClick={() => deleteDataAsset(id)}>삭제</button>
                    </td>
                    <td>{dataFormatter(createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
                  </tr>
                )
              })
              :
              <tr>
                <td colSpan={4}>데이터가 없습니다.</td>
              </tr>
          }
          </tbody>
        </table>
      </div>
      <div className="alg-right">
        <button type="button" className="btn-l-cancel" onClick={back}>뒤로</button>
      </div>
    </>
  )
}

export default UpdateData;