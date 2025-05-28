import {CreateStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";

export const DefaultCreateStyleInput: CreateStyleInput = {
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