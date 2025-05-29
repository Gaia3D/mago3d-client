import {
  UpdateStyleInput,
  StyleContextValue,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {mapToRequestContext} from "@src/layer-style/mappers/mapToRequestContext";
import {EditableStyleModel} from "@src/layer-style/models/EditableStyleModel";

export const mapToRequestStyle = (
  style: EditableStyleModel
): UpdateStyleInput => {
  const context: StyleContextValue = mapToRequestContext(style.context);

  return {
    context,
    name: style.context.name,
    backgroundId: style.context.backgroundId,

    access: style.access,
    defaultStatus: style.defaultStatus,
    description: style.description,
    enabled: style.enabled,
    format: style.format,
    properties: style.properties,
  };
};
