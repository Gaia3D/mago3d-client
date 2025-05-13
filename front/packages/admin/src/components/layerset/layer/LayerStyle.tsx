import React from 'react';
import { LayerAsset, LayerAssetType } from "@src/generated/gql/layerset/graphql";
import { useTranslation } from "react-i18next";
import LayerPreviewCog from "@src/components/layerset/layer/preview/LayerPreviewCog";
import LayerPreviewHybrid from "@src/components/layerset/layer/preview/LayerPreviewHybrid";
import LayerPreviewRaster from "@src/components/layerset/layer/preview/LayerPreviewRaster";
import LayerPreviewVector from "@src/components/layerset/layer/preview/LayerPreviewVector";
import LayerPreview3dTile from "@src/components/layerset/layer/preview/LayerPreview3dTile";
import LayerVectorStyle from "@src/components/layerset/layer/style/LayerVectorStyle";
import {useRecoilValue} from "recoil";
import {selectedAssetState} from "@src/recoils/Asset";


const previewComponentMap: Partial<Record<LayerAssetType, (asset: LayerAsset) => JSX.Element>> = {
  [LayerAssetType.Cog]: (asset) => <LayerPreviewCog asset={asset} />,
  [LayerAssetType.Layergroup]: (asset) => <LayerPreviewHybrid asset={asset} />,
  [LayerAssetType.Raster]: (asset) => <LayerPreviewRaster asset={asset} />,
  // [LayerAssetType.Vector]: (asset) => <LayerPreviewVector asset={asset} />,
  [LayerAssetType.Vector]: (asset) => <LayerVectorStyle asset={asset} />,
  [LayerAssetType.Tiles3D]: (asset) => <LayerPreview3dTile asset={asset} />,
};

const LayerStyle = () => {
  const { t } = useTranslation();
  const asset = useRecoilValue(selectedAssetState);
  const renderPreview = previewComponentMap[asset.type] || ((asset) => <LayerPreviewVector asset={asset} />);

  return (
    <>
      {renderPreview(asset)}
    </>
  );
};

export default LayerStyle;
