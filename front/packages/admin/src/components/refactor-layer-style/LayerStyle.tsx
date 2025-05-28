import React, { useEffect } from 'react';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {
  completeStylesState,
  editingStyleState,
  selectedAssetState,
} from '@src/recoils/LayerStyle';
import { mapStyleToCompleteStyleType } from '@src/components/refactor-layer-style/mapStyleToCompleteStyleType';
import { LayerAssetType } from '@mnd/shared/src/types/layerset/gql/graphql';

import LayerPreviewRaster from '@src/components/layerset/layer/preview/LayerPreviewRaster';
import LayerPreviewCog from '@src/components/layerset/layer/preview/LayerPreviewCog';
import LayerPreviewHybrid from '@src/components/layerset/layer/preview/LayerPreviewHybrid';
import LayerPreview3dTile from '@src/components/layerset/layer/preview/LayerPreview3dTile';
import LayerVectorStyle from "@src/components/refactor-layer-style/style/LayerVectorStyle";

const LayerStyle = () => {
  const asset = useRecoilValue(selectedAssetState);
  const [completeStyles, setCompleteStyles] = useRecoilState(completeStylesState);
  const setEditingStyle = useSetRecoilState(editingStyleState);

  useEffect(() => {
    if (!asset?.styles?.length) {
      setCompleteStyles([]);
      return;
    }
    const mapped = asset.styles.map(mapStyleToCompleteStyleType);
    setCompleteStyles(mapped);
  }, [asset, setCompleteStyles]);

  useEffect(() => {
    console.log('completeStyles', completeStyles);
  }, [completeStyles]);

  useEffect(() => {
    return () => {
      setCompleteStyles([]);
      setEditingStyle(undefined);
    }
  }, []);

  const renderPreview = () => {
    switch (asset?.type) {
      case LayerAssetType.Vector:
        return <LayerVectorStyle />;
      case LayerAssetType.Raster:
        return <LayerPreviewRaster asset={asset} />;
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
