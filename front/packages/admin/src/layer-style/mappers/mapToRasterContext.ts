import { EditableContextModel } from "../models/EditableContextModel";
import { ColorMapType } from "@mnd/shared/src/types/layerset/gql/graphql";

export const mapToRasterContext = (editable: EditableContextModel) => {
  const baseRaster = {
    channels: editable.raster.channels,
    gamma: editable.raster.gamma,
    maxScale: editable.raster.maxScale,
    minScale: editable.raster.minScale,
    mode: editable.raster.mode,
    opacity: editable.raster.opacity,
    type: editable.raster.type,
  };

  if (editable.raster.type === ColorMapType.Intervals) {
    const original = editable.raster.entries;
    const patched = [];

    for (let i = 0; i < original.length; i++) {
      const curr = original[i];
      const next = original[i + 1];

      patched.push({ ...curr });

      if (next && typeof next.bandValue === "number") {
        patched.push({
          bandValue: next.bandValue,
          color: curr.color,
          entryOpacity: curr.entryOpacity,
          textLabel: curr.textLabel ?? "",
        });
      }

      if (!next && typeof curr.bandValue === "number") {
        patched.push({
          bandValue: curr.bandValue + 1,
          color: curr.color,
          entryOpacity: curr.entryOpacity,
          textLabel: curr.textLabel ?? "",
        });
      }
    }

    return {
      raster: {
        ...baseRaster,
        entries: patched,
      },
    };
  }

  if (editable.raster.type === ColorMapType.Ramp) {
    const firstEntry = editable.raster.entries[0];
    const newEntries = [
      {
        bandValue: firstEntry.bandValue,
        color: firstEntry.color,
        entryOpacity: 0,
        textLabel: "",
      },
      ...editable.raster.entries.map(e => ({ ...e })),
    ];

    return {
      raster: {
        ...baseRaster,
        entries: newEntries,
      },
    };
  }

  return {
    raster: {
      ...baseRaster,
      entries: editable.raster.entries.map(e => ({ ...e })),
    },
  };
};
