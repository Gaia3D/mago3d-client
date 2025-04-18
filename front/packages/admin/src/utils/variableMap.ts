import {
  CreateAttributesMutationVariables,
  UpdateAttributesMutationVariables
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {attributeCategoryType} from "@src/components/layerset/layer/LayerAttribute";

export const mapToCreateInput = (
  assetId: string,
  categoryArr: attributeCategoryType[]
): CreateAttributesMutationVariables => {
  return {
    assetId: assetId,
    input: categoryArr.map((cat) => ({
      categoryName: cat.categoryName,
      properties: cat.properties.map((prop) => ({
        field: prop.field,
        label: prop.label || null,
        value: prop.value || null,
        weight: prop.weight || null,
      })),
    })),
  };
};

export const mapToUpdateInput = (
  asstId: string,
  categoryArr: attributeCategoryType[]
): UpdateAttributesMutationVariables => {
  return {
    assetId: asstId,
    input: categoryArr.map((cat) => ({
      id: cat.id,
      categoryName: cat.categoryName,
      properties: cat.properties.map((prop) => ({
        field: prop.field,
        label: prop.label || null,
        value: prop.value || null,
        weight: prop.weight || null,
      })),
    })),
  };
}