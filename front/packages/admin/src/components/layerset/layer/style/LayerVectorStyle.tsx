import React, { useEffect, useState } from "react";
import { LayerAsset, LayerStyle } from "@mnd/shared/src/types/layerset/gql/graphql";
import StyleRow from "@src/components/layerset/layer/style/StyleRow";
import CesiumPreviewer from "@src/components/layerset/layer/style/CesiumPreviewer";
import {backgroundMaps, BackgroundMapType} from "@src/constants/backgroundMap";
import BackgroundMapSelector from "@src/components/layerset/layer/style/BackgroundMapSelector";

interface LayerVectorStyleProps {
  asset: LayerAsset;
}

const LayerVectorStyle = ({ asset }: LayerVectorStyleProps) => {
  const [layerStyles, setLayerStyles] = useState<LayerStyle[]>(asset.styles);
  const [selectedStyle, setSelectedStyle] = useState<LayerStyle>(asset.styles[0]);
  const [backgroundMap, setBackgroundMap] = useState<BackgroundMapType>(backgroundMaps[0]);

  const styleToggle = (styleId: string) => {
    const selected = layerStyles.find(style => style.id === styleId);
    if (selected) setSelectedStyle(selected);
  };

  const styleUpdate = (styleId: string) => {
    console.log("update", styleId);
  };

  const styleDelete = (styleId: string) => {
    console.log("delete", styleId);
  };

  return (
    <div className="style-container">
      <div className="left-section">
        <div className="section-header">
          <div>스타일 목록</div>
          <div><button>추가</button></div>
        </div>
        <div className="section-body">
          {layerStyles.map(style => (
            <StyleRow
              key={style.id}
              style={style}
              onToggle={styleToggle}
              onUpdate={styleUpdate}
              onDelete={styleDelete}
            />
          ))}
        </div>
      </div>

      <div className="right-section">
        <div className="section-header">
          <div>레이어 미리보기</div>
          <div>성능상의 이유로 하나의 객체만 미리보기 됩니다.</div>
        </div>

        <div className="preview-container">
          <div className="preview-top-button-container">
            <div>
              <button onClick={() => console.log("보기모드: 전체")}>전체</button>
              <button onClick={() => console.log("보기모드: 단일")}>단일</button>
              <button onClick={() => console.log("보기모드: 범례")}>범례</button>
            </div>
          </div>
          <CesiumPreviewer
            layerStyles={layerStyles}
            backgroundMap={backgroundMap}
          />
          <BackgroundMapSelector
            currentMap={backgroundMap}
            onChange={(map) => setBackgroundMap(map)}
          />
        </div>

        <div className="section-footer">
          <button>저장</button>
          <button>삭제</button>
          <button>초기화</button>
        </div>
      </div>
    </div>
  );
};

export default LayerVectorStyle;
