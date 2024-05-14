import {classifyAssetTypeClassName} from "@src/api/Data";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {dataSearchSelector} from "@src/recoils/Data";
import {DatasetAssetForLayerQuery, DatasetAssetListQueryVariables} from "@src/generated/gql/dataset/graphql";
import {
  CreateAssetInput,
  LayerAccess,
  LayerAssetType,
  LayersetCreateAssetDocument,
  LayersetGroupListQuery
} from "@src/generated/gql/layerset/graphql";
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";

const LayerPublish3dTile = ({dataAsset, groupsQuery}: {
  dataAsset: DatasetAssetForLayerQuery,
  groupsQuery: LayersetGroupListQuery
}) => {
  const {register, handleSubmit, formState: {errors}, setValue} = useForm<CreateAssetInput>();
  const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
  const navigate = useNavigate();
  const toBack = () => {
    navigate(-1);
  }

  const [createMutation] = useMutation(LayersetCreateAssetDocument);

  const onSubmit: SubmitHandler<CreateAssetInput> = (data) => {
    if (!confirm('등록하시겠습니까?')) return;

    //data.access = data.access ? LayerAccess.Private : LayerAccess.Public;
    data.access = LayerAccess.Public;
    data.type = LayerAssetType.Tiles3D;
    data.context = {
      t3d: {
        dataAssetId: dataAsset.asset.id
      }
    }

    createMutation({variables: {input: data}})
      .then(() => {
        toast('성공적으로 등록되었습니다.');
        navigate('/layerset/layer');
        // getQueryClient().invalidateQueries({queryKey: ['assets', searchProps]})
        // navigate(-1);
      })
      .catch(e => {
        console.error(e);
        toast('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
      });

  }

  const {groups} = groupsQuery;

  return (
    <div className="contents">
      <h2>
        {dataAsset.asset.name}
        <span className={classifyAssetTypeClassName(dataAsset.asset.assetType)}>{dataAsset.asset.assetType}</span>
      </h2>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="layer-publish-3d-groups">레이어 그룹</label>
          <select
            id="layer-publish-3d-groups"
            {...register("groupIds", {
              required: {
                value: true,
                message: '그룹을 선택해주시기 바랍니다.'
              },
            })}
          >
            {
              groups.map((group, idx) => {
                return (
                    <option key={idx} value={group.id}>{group.name}</option>
                )
              })
            }
          </select>
          <label htmlFor="layer-publish-3d-name">레이어명</label>
          <input type="text"
                 id="layer-publish-3d-name"
                 {...register("name", {
                   required: {
                     value: true,
                     message: "레이어명을 입력해주시기 바랍니다."
                   },
                 })}
          />
          {errors?.name?.message && <span className="error">{errors.name.message}</span>}
          {/*
          <label>권한</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={false}
                   id="layer-publish-3d-access"
                   {...register("access")}
            />
            <span className="slider"></span>
          </label>
          */}
          <label>사용여부</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={true}
                   id="layer-publish-3d-enabled"
                   {...register("enabled")}
            />
            <span className="slider"></span>
          </label>
          <label>켜기</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={true}
                   id="layer-publish-3d-visible"
                   {...register("visible")}
            />
            <span className="slider"></span>
          </label>
          <div className="alg-right">
            <button type="submit" className="btn-l-save">발행</button>
            <button type="button" className="btn-l-cancel" onClick={toBack}>취소</button>
          </div>
        </form>
      </article>
    </div>
  )
}

export default LayerPublish3dTile;