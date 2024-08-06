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
import {useTranslation} from "react-i18next";

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
  const {t} = useTranslation();
  const {register, handleSubmit, formState: {errors}, setValue} = useForm<UpdateAssetInput>();
  const navigate = useNavigate();
  const toBack = () => {
    navigate(-1);
  }

  const [ updateMutation ] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetAssetDocument],
    onCompleted(data) {
      alert(t("success.edit"));
    },
    onError(e) {
      console.error(e);
      alert(t("error.admin"));
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
    if (!confirm(t("question.edit"))) return;
    const {id} = asset;
    const input = {} as UpdateAssetInput;
    Object.assign(input, data);
    updateMutation({variables: {id, input}});
  }

  const toDelete = () => {
    if (!confirm(t("layer") + asset.name + t("question.blank-delete"))) return;
    deleteAssetMutation({variables: {ids: id}}).then(() => {
      alertToast(t("success.delete"));
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
            <label htmlFor="layer-detail-groups">{t("layer-group")}</label>
            {
              groups ? <select disabled>
                  {
                    groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)
                  }
                </select>
                : null
            }
            <label htmlFor="layer-detail-name">{t("layer-name")}</label>
            <input type="text"
                   id="layer-detail-name"
                   defaultValue={asset.name}
                   {...register("name", {
                     required: {
                       value: true,
                       message: t("required.layer-name")
                     },
                   })}
            />
            {errors?.name?.message && <span className="error">{errors.name.message}</span>}
            <label>{t("state")}</label>
            <span>{getPublishStatusName(asset.status, t)}</span>
            <label>{t("use-status")}</label>
            <label className="switch mt8">
              <input type="checkbox"
                     defaultChecked={asset.enabled}
                     id="layer-detail-enabled"
                     {...register("enabled")}
              />
              <span className="slider"></span>
            </label>
            <label>{t("turn-on")}</label>
            <label className="switch mt8">
              <input type="checkbox"
                     defaultChecked={asset.visible}
                     id="layer-detail-visible"
                     {...register("visible")}
              />
              <span className="slider"></span>
            </label>
            <div className="alg-right">
              <button type="submit" className="btn-l-save">{t("edit")}</button>
              <button type="button" className="btn-l-delete" onClick={toDelete}>{t("delete")}</button>
              <button type="button" className="btn-l-cancel" onClick={toBack}>{t("cancel")}</button>
            </div>
          </form>
            <label>{t("layer-preview")}</label>
            <div style={{width:"100%", display:"inline-block"}}>
              {getPreviewComponent(asset)}
            </div>
            <label>{t("publish-record")}</label>
            <div className="cboth list03-sort title-inner">
              <table>
                <caption>{t("record")}</caption>
                <thead>
                <tr>
                  <th>{t("content")}</th>
                  <th>{t("type")} <a className="sort" href="#"></a></th>
                  <th>{t("created-at")} <a className="sort" href="#"></a></th>
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
