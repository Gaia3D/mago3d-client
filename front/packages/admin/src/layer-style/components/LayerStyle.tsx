import React, { useEffect } from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import { useRemoteAsset } from "../hooks/useRemoteAsset";
import {editableStylesState, selectedAssetState} from "@src/layer-style/recoils/layerStyle";
import {LayerAssetType} from "@mnd/shared/src/types/layerset/gql/graphql";
import LayerPreviewCog from "@src/components/layerset/layer/preview/LayerPreviewCog";
import LayerPreviewHybrid from "@src/components/layerset/layer/preview/LayerPreviewHybrid";
import LayerPreview3dTile from "@src/components/layerset/layer/preview/LayerPreview3dTile";
import LayerVectorStyle from "@src/layer-style/components/LayerVectorStyle";
import {mapToEditableStyle} from "@src/layer-style/mappers/mapToEditableStyle";
import LayerRasterStyle from "@src/layer-style/components/LayerRasterStyle";

const LayerStyle = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [editableStyles, setEditableStyles] = useRecoilState(editableStylesState);
  const { href } = asset.properties.layer.resource;

  // 원본 Asset 데이터 요청 & remoteAssetDataState 전역 상태에 저장
  useRemoteAsset(href);

  // 스타일 매핑
  useEffect(() => {
    setEditableStyles(asset.styles.map(style => {
      return mapToEditableStyle(style);
    }));
    return () => {
      setEditableStyles([]);
    }
  }, [asset]);

  const renderPreview = () => {
    switch (asset?.type) {
      case LayerAssetType.Vector:
        return <LayerVectorStyle />;
      case LayerAssetType.Raster:
        return <LayerRasterStyle />
      case LayerAssetType.Cog:
        return <LayerPreviewCog asset={asset} />;
      case LayerAssetType.Layergroup:
        return <LayerPreviewHybrid asset={asset} />;
      case LayerAssetType.Tiles3D:
        return <LayerPreview3dTile asset={asset} />;
      default:
        return null;
    }
  };

  return <>{renderPreview()}</>;
};

export default LayerStyle;
