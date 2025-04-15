import React from 'react';
import {LayerAsset, LayerAssetType} from "@src/generated/gql/layerset/graphql";
import LayerPreviewCog from "@src/components/layerset/layer/LayerPreviewCog";
import LayerPreviewHybrid from "@src/components/layerset/layer/LayerPreviewHybrid";
import LayerPreviewRaster from "@src/components/layerset/layer/LayerPreviewRaster";
import LayerPreviewVector from "@src/components/layerset/layer/LayerPreviewVector";
import LayerPreview3dTile from "@src/components/layerset/layer/LayerPreview3dTile";
import {useTranslation} from "react-i18next";

interface LayerPreviewProps {
  asset: LayerAsset;
}

const LayerPreview = ({asset}: LayerPreviewProps) => {
  const {t} = useTranslation();

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

  return (
    <>
      <label>{t("layer-preview")}</label>
      <div style={{width: "100%", display: "inline-block"}}>
        {getPreviewComponent(asset)}
      </div>
    </>
)
  ;
};

export default LayerPreview;