import React, {useEffect} from 'react';
import { useTranslation } from "react-i18next";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {globalStyleContextState, selectedAssetState, selectedLayerStyleState} from "@src/recoils/LayerStyle";
import { LayerAsset, LayerAssetType } from "@src/generated/gql/layerset/graphql";
import LayerPreviewCog from "@src/components/layerset/layer/preview/LayerPreviewCog";
import LayerPreviewHybrid from "@src/components/layerset/layer/preview/LayerPreviewHybrid";
import LayerPreviewRaster from "@src/components/layerset/layer/preview/LayerPreviewRaster";
import LayerPreview3dTile from "@src/components/layerset/layer/preview/LayerPreview3dTile";
import LayerVectorStyle from "@src/components/layer-style/LayerVectorStyle";
import {mapStyleToContext} from "@src/utils/layer/mapStyleType";

const getPreviewComponent = (type: LayerAssetType) => {
  switch (type) {
    case LayerAssetType.Vector:
      return () => <LayerVectorStyle />;
    case LayerAssetType.Raster:
      return (asset: LayerAsset) => <LayerPreviewRaster asset={asset} />;
    case LayerAssetType.Cog:
      return (asset: LayerAsset) => <LayerPreviewCog asset={asset} />;
    case LayerAssetType.Layergroup:
      return (asset: LayerAsset) => <LayerPreviewHybrid asset={asset} />;
    case LayerAssetType.Tiles3D:
      return (asset: LayerAsset) => <LayerPreview3dTile asset={asset} />;
    default:
      return undefined;
  }
};

const LayerStyle = () => {
  const { t } = useTranslation();
  const asset = useRecoilValue(selectedAssetState);
  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);
  const setGlobalStyleContext = useSetRecoilState(globalStyleContextState);

  useEffect(() => {
    if (!selectedLayerStyle?.type) return;
    setGlobalStyleContext(mapStyleToContext(selectedLayerStyle));
  }, [selectedLayerStyle?.type]);

  if (!asset?.type) return <div>{t("레이어 유형이 없습니다.")}</div>;

  const render = getPreviewComponent(asset.type);
  if (!render) return <div>{t("지원하지 않는 유형입니다.")}</div>;

  return <>{render(asset)}</>;
};

export default LayerStyle;
