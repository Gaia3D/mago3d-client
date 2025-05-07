import React, {useState} from "react";
import { LayerAsset, LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import StylePanel from "@src/components/layerset/layer/style/StylePanel";
import PreviewPanel from "@src/components/layerset/layer/style/PreviewPanel";

interface LayerVectorStyleProps {
  asset: LayerAsset;
}

const LayerVectorStyle = ({ asset }: LayerVectorStyleProps) => {
  const [layerStyles, setLayerStyles] = useState<LayerStyle[]>(asset.styles);

  const save = () => {
    console.log("저장", layerStyles);
  }

  const reset = () => {
    setLayerStyles(asset.styles);
  }

  return (
    <div className="style-container">
      <div className="left-section">
        <StylePanel
          layerStyles={layerStyles}
          setLayerStyles={setLayerStyles}
        />
      </div>
      <div className="right-section">
        <PreviewPanel
          asset={asset}
          styles={layerStyles}
        />
        <div className="section-footer">
          <button onClick={save}>저장</button>
          <button onClick={reset}>초기화</button>
        </div>
      </div>
    </div>
  );
};

export default LayerVectorStyle;
