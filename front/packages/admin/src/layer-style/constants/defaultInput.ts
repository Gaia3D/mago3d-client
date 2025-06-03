import {
  ColorMapType,
  CreateStyleInput, RasterStyleInput
} from "@mnd/shared/src/types/layerset/gql/graphql";

export const DefaultCreateVectorStyleInput: CreateStyleInput = {
  context: {
    point: {
      fillColor: "#000000",
      fillOpacity: 0.5,
      minScale: 0,
      size: 10,
      strokeColor: "#000000",
      strokeOpacity: 1,
      strokeWidth: 2,
    }
  },
  name: "New Style"
}

export const DefaultRasterContext: RasterStyleInput = {
  entries: [
    {
      color: "#000000",
      entryOpacity: 1,
      bandValue: 0,
      textLabel: "Min"
    },
    {
      color: "#ffffff",
      entryOpacity: 1,
      bandValue: 10,
      textLabel: "Max"
    }
  ],
  type: ColorMapType.Ramp,
  opacity: 1.0,
  minScale: 0,
  maxScale: undefined,
  gamma: 1.0,
}

export const DefaultCreateRasterStyleInput: CreateStyleInput = {
  context: {
    raster: DefaultRasterContext
  },
  name: "Raster Style Test",
}