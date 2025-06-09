import {EditableContextModel, LayerType} from "@src/layer-style/models/EditableContextModel";
import {JsonPropertyInput, LayerAccess, LayerStyleFormat} from "@mnd/shared/src/types/layerset/gql/graphql";

export type EditableStyleModel = {
  context: EditableContextModel;

  id: string;
  access?: LayerAccess;
  backgroundId?: string;
  defaultStatus?: boolean;
  description?: string;
  enabled?: boolean;
  format?: LayerStyleFormat;
  name?: string;
  properties?: JsonPropertyInput;
  type: LayerType;
}