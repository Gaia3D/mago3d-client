import React from 'react';
import {ColorMapEntry} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

const RasterLegend = (
  assetName: string,
  rasterType: string,
  entries: ColorMapEntry[],
  styleId: string
) => {
  return (
    <div key={`raster-${styleId}`} className="legend-block">
      <div className="legend-title">{assetName}</div>
      <div className="legend-title">컬러맵 타입: {rasterType}</div>
      <div className="legend-table">
        {entries.map((entry, entryIdx) => (
          <div key={entryIdx} className="legend-row">
            <div className="legend-color"
                 style={{backgroundColor: entry.color ?? "#ccc", opacity: entry.entryOpacity ?? 1}}/>
            <div className="legend-alias">{entry.textLabel ?? "-"}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RasterLegend;