import {EditableContextModel, LayerType} from "@src/layer-style/models/EditableContextModel";
import {JsonPropertyInput, LayerAccess, LayerStyleFormat} from "@mnd/shared/src/types/layerset/gql/graphql";

export type EditableStyleModel = {
  context: EditableContextModel;

  id: string;
  name?: string;
  backgroundId?: string;
  backgroundAllActive?: boolean;

  access?: LayerAccess;
  defaultStatus?: boolean;
  description?: string;
  enabled?: boolean;
  format?: LayerStyleFormat;
  properties?: JsonPropertyInput;
  type: LayerType;
}