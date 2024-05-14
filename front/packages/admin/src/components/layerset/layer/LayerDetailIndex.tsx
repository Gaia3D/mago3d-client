import {Suspense, useEffect} from "react";
import {classifyAssetTypeClassNameByLayerAssetType, getPublishStatusName} from "@src/api/Data";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import LayerPreviewCog from "./LayerPreviewCog";
import LayerPreviewVector from "./LayerPreviewVector";
import LayerPreview3dTile from "./LayerPreview3dTile";
import {
  LayerAsset,
  LayerAssetType,
  LayersetAssetBasicFragmentDoc,
  LayersetAssetDocument,
  LayersetDeleteAssetDocument,
  LayersetGroupListWithAssetDocument, LayersetUpdateAssetDocument,
  PublishContextValue,
  UpdateAssetInput
} from "@src/generated/gql/layerset/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useFragment} from "@src/generated/gql/layerset";
import {dataFormatter} from "@mnd/shared";
import {alertToast} from "@mnd/shared/src/utils/toast";
import LayerPreviewRaster from "./LayerPreviewRaster";
import LayerPreviewHybrid from "@src/components/layerset/layer/LayerPreviewHybrid";

const getContext = (asset: LayerAsset): PublishContextValue => {
  const {type, id} = asset;
  if (type === LayerAssetType.Cog) {
    return {
      cog: {
        dataAssetId: id
      }
    }
  } else if (type === LayerAssetType.Layergroup) {
    return {
      cog: {
        dataAssetId: id
      }
    }
  } else if (type === LayerAssetType.Raster) {
    return {
      coverage: {
        dataAssetId: id
      }
    }
  } else if (type === LayerAssetType.Vector) {
    return {
      feature: {
        dataAssetId: id
      }
    }
  } else if (type === LayerAssetType.Tiles3D) {
    return {
      t3d: {
        dataAssetId: id
      }
    }
  }

  return {
    cog: {
      dataAssetId: id
    }
  }
}

const getPreviewComponent = (asset: LayerAsset) => {
  const {type} = asset;

  if (type === LayerAssetType.Cog) {
    return <LayerPreviewCog asset={asset}/>
  } else if (type === LayerAssetType.Layergroup) {
    return <LayerPreviewHybrid asset={asset}/>
  } else if (type === LayerAssetType.Raster) {
    return <LayerPreviewRaster asset={asset}/>
  } else if (type === LayerAssetType.Vector) {
    return <LayerPreviewVector asset={asset}/>
  } else if (type === LayerAssetType.Tiles3D) {
    return <LayerPreview3dTile asset={asset}/>
  }

  return <LayerPreviewVector asset={asset}/>
}

const LayerDetailIndex = ({id}: { id: string }) => {
  const {register, handleSubmit, formState: {errors}, setValue} = useForm<UpdateAssetInput>();
  const navigate = useNavigate();
  const toBack = () => {
    navigate(-1);
  }

  const [ updateMutation ] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetAssetDocument],
    onCompleted(data) {
      alert('성공적으로 수정되었습니다.');
    },
    onError(e) {
      console.error(e);
      alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
    }
  });

  const [deleteAssetMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const { data } = useSuspenseQuery(LayersetAssetDocument, {variables: {id}});

  const asset = useFragment(LayersetAssetBasicFragmentDoc, data.asset);
  const { logs, groups } = data.asset;

  useEffect(() => {
    setValue('name', asset.name);
  }, [asset]);

  const onSubmit: SubmitHandler<UpdateAssetInput> = (data) => {
    if (!confirm('수정하시겠습니까?')) return;
    const {id} = asset;
    const input = {} as UpdateAssetInput;
    Object.assign(input, data);
    updateMutation({variables: {id, input}});
  }

  const toDelete = () => {
    if (!confirm(`레이어 ${asset.name}을 삭제하시겠습니까?`)) return;
    deleteAssetMutation({variables: {ids: id}}).then(() => {
      alertToast('삭제되었습니다.');
      navigate(-1);
    });
  }

  return (
    <Suspense>
      <div className="contents">
        <h2>
          {asset.name}
          <span className={classifyAssetTypeClassNameByLayerAssetType(asset.type)}>{asset.type}</span>
        </h2>
        <article>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="layer-detail-groups">레이어 그룹</label>
            {
              groups ? <select disabled>
                  {
                    groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)
                  }
                </select>
                : null
            }
            <label htmlFor="layer-detail-name">레이어명</label>
            <input type="text"
                   id="layer-detail-name"
                   defaultValue={asset.name}
                   {...register("name", {
                     required: {
                       value: true,
                       message: "레이어명을 입력해주시기 바랍니다."
                     },
                   })}
            />
            {errors?.name?.message && <span className="error">{errors.name.message}</span>}
            <label>상태</label>
            <span>{getPublishStatusName(asset.status)}</span>
            <label>사용여부</label>
            <label className="switch mt8">
              <input type="checkbox"
                     defaultChecked={asset.enabled}
                     id="layer-detail-enabled"
                     {...register("enabled")}
              />
              <span className="slider"></span>
            </label>
            <label>켜기</label>
            <label className="switch mt8">
              <input type="checkbox"
                     defaultChecked={asset.visible}
                     id="layer-detail-visible"
                     {...register("visible")}
              />
              <span className="slider"></span>
            </label>
            <div className="alg-right">
              <button type="submit" className="btn-l-save">수정</button>
              <button type="button" className="btn-l-delete" onClick={toDelete}>삭제</button>
              <button type="button" className="btn-l-cancel" onClick={toBack}>취소</button>
            </div>
          </form>
            <label>레이어 미리보기</label>
            <div style={{width:"100%", display:"inline-block"}}>
              {getPreviewComponent(asset)}
            </div>
            <label>발행 이력</label>
            <div className="cboth list03-sort title-inner">
              <table>
                <caption>이력</caption>
                <thead>
                <tr>
                  <th>내용</th>
                  <th>타입 <a className="sort" href="#"></a></th>
                  <th>등록일 <a className="sort" href="#"></a></th>
                </tr>
                </thead>
              </table>
            </div>
            <div className="list03-sort s-inner" style={{height:"300px"}}>
              <table>
                <tbody>
                {
                  logs.map((history, index) => {
                    return (
                      <tr key={index}>
                        <td>{history.content}</td>
                        <td className="tleft">{history.type}</td>
                        <td>{dataFormatter(history.createdAt ?? new Date().toISOString(), 'YYYY-MM-DD HH:mm:ss')}</td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
            </div>
        </article>
      </div>
    </Suspense>
  )
}

export default LayerDetailIndex;
