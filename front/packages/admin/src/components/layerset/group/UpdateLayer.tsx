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

const UpdateLayer = () => {
  const back = useToPath('/layerset/group');
  const {data} = useOutletContext<UpdateLayerGroupOutletContext>();
  const assets = useFragment(LayerAssetBasicFragmentDoc, data.group.assets);

  const [deleteMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayerGroupDocument]
  })

  const deleteAsset = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return;
    deleteMutation({
      variables: {
        ids: id
      }
    }).then(() => {
      alertToast('삭제되었습니다.');
    });
  }

  return (
    <>
      <div className="list04-sort title-inner">
        <table>
          <caption>그룹 하위 레이어 목록</caption>
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
                      <button type="button" className="btn-s-edit" onClick={() => deleteAsset(id)}>삭제</button>
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

export default UpdateLayer;