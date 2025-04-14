import {Suspense} from "react";
import {classifyAssetTypeClassNameByLayerAssetType} from "@src/api/Data";
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
  UpdateAssetInput
} from "@src/generated/gql/layerset/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useFragment} from "@src/generated/gql/layerset";
import {alertToast} from "@mnd/shared/src/utils/toast";
import LayerPreviewRaster from "./LayerPreviewRaster";
import LayerPreviewHybrid from "@src/components/layerset/layer/LayerPreviewHybrid";
import {useTranslation} from "react-i18next";
import LayerLogTable from "@src/components/layerset/layer/LayerLogTable";
import LayerForm from "@src/components/layerset/layer/LayerForm";

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

const LayerDetailIndex = ({ id }: { id: string }) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const form = useForm<UpdateAssetInput>();
  const { data } = useSuspenseQuery(LayersetAssetDocument, { variables: { id } });
  const asset = useFragment(LayersetAssetBasicFragmentDoc, data.asset);
  const { logs, groups } = data.asset;

  const [ updateMutation ] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetAssetDocument],
    onCompleted: () => alert(t("success.edit")),
    onError: (e) => {
      console.error(e);
      alert(t("error.admin"));
    }
  });

  const [deleteAssetMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const onSubmit: SubmitHandler<UpdateAssetInput> = (formData) => {
    if (!confirm(t("question.edit"))) return;
    updateMutation({ variables: { id: asset.id, input: { ...formData } } });
  };

  const toDelete = () => {
    if (!confirm(`${t("layer")} ${asset.name} ${t("question.blank-delete")}`)) return;
    deleteAssetMutation({ variables: { ids: id } }).then(() => {
      alertToast(t("success.delete"));
      navigate(-1);
    });
  }

  const safeGroups = groups.map(group => ({
    id: group.id,
    name: group.name ?? ""
  }));

  return (
    <Suspense>
      <div className="contents">
        <h2>
          {asset.name}
          <span className={classifyAssetTypeClassNameByLayerAssetType(asset.type)}>{asset.type}</span>
        </h2>
        <article>
          <LayerForm
            asset={asset}
            groups={safeGroups}
            form={form}
            onSubmit={onSubmit}
            onDelete={toDelete}
            onCancel={() => navigate(-1)}
          />
          <label>{t("layer-preview")}</label>
          <div style={{ width: "100%", display: "inline-block" }}>
            {getPreviewComponent(asset)}
          </div>

          <LayerLogTable logs={logs} />
        </article>
      </div>
    </Suspense>
  );
};

export default LayerDetailIndex;
