import { EditableStyleModel } from "@src/layer-style/models/EditableStyleModel";
import { Maybe, Scalars } from "@mnd/shared/src/types/layerset/gql/graphql";
import { mapToEditableContext } from "@src/layer-style/mappers/mapToEditableContext";

export const mapToEditableStyle = (
  style: Maybe<Scalars["JSON"]["output"]>
): EditableStyleModel => {
  const context = mapToEditableContext(style ?? {});

  return {
    context,
    name: context?.name ?? undefined,
    backgroundId: context?.backgroundId ?? undefined,

    id: style.id,
    access: style?.access ?? undefined,
    defaultStatus: style?.defaultStatus ?? undefined,
    description: style?.description ?? undefined,
    enabled: style?.enabled ?? undefined,
    format: style?.format ?? undefined,
    properties: style?.properties ?? undefined,
  };
};
