import React from 'react';
import LegendPreview from "@src/layer-style/components/raster/preview-panel/LegendPreview";

const PreviewPanel = () => {
  return (
    <>
      <div className="section-header">
        <div>레이어 미리보기</div>
      </div>
      <div className="preview-container">
        <div className="preview-top-button-container">
            <button className="active">
              범례
            </button>
        </div>
        <div className="preview-legend-wrapper">
          <LegendPreview />
        </div>
      </div>
    </>
  );
};

export default PreviewPanel;