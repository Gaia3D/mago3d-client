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
  name: "Default Vector Style",
}
export const DefaultCreateRasterStyleInput = (min=0, max=10): CreateStyleInput => {
  return {
    context: {
      raster: DefaultRasterContext(min, max)
    },
    name: "Default Raster Style",
  }
}

export const DefaultRasterContext = (min=0, max=10): RasterStyleInput => {
  return {
    entries: [
      {
        color: "#000000",
        entryOpacity: 1,
        bandValue: min,
        textLabel: "Min"
      },
      {
        color: "#ffffff",
        entryOpacity: 1,
        bandValue: max,
        textLabel: "Max"
      }
    ],
    type: ColorMapType.Ramp,
    opacity: 1.0,
    minScale: 0,
    maxScale: undefined,
    gamma: 1.0,
  }
}