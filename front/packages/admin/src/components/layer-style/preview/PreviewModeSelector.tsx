import React from 'react';
import {PreviewMode} from "@src/types/Layer";

interface PreviewModeSelectorProps {
  previewMode: PreviewMode;
  onClick: (mode: PreviewMode) => void;
}

const PreviewModeSelector = ({ previewMode, onClick }: PreviewModeSelectorProps) => {
  const MODES = [
    { label: "단일", value: PreviewMode.Single },
    { label: "전체", value: PreviewMode.All },
    { label: "범례", value: PreviewMode.Legend },
  ];

  return (
    <div className="preview-top-button-container">
      {MODES.map(({ label, value }) => (
        <button
          key={value}
          className={previewMode === value ? "active" : ""}
          onClick={() => onClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default PreviewModeSelector;
