import {useMutation, useSuspenseQuery} from "@tanstack/react-query";
import {layersetClient} from "./QueryClient";
import {
  DeleteLayerAssetDocument,
  DeleteLayerGroupDocument,
  LayerAssetDocument,
  LayerAssetQueryVariables,
  LayerGroupsDocument,
  LayerGroupsQueryVariables,
  LocateLayerAssetDocument,
  LocateLayerGroupDocument,
  UpdateLayerAssetDocument,
  UpdateLayerGroupDocument
} from "@src/generated/gql/layerset/graphql";
import {VariablesOf} from "@graphql-typed-document-node/core";

export namespace LayerApi {
  export const useAssetQuery = (variables: LayerAssetQueryVariables) => {
    return useSuspenseQuery({
      queryKey: ['assets', variables],
      queryFn: () => layersetClient.request(LayerAssetDocument, variables)
    });
  }

  /**
   * 레이어 그룹 목록 조회
   * @param variables
   */
  export const useGroupsQuery = (variables?: LayerGroupsQueryVariables) => {
    return useSuspenseQuery({
      queryKey: ['layerGroups', variables],
      queryFn: () => layersetClient.request(LayerGroupsDocument, variables)
    });
  }

  export const useUpdateAssetMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof UpdateLayerAssetDocument>) => layersetClient.request(UpdateLayerAssetDocument, val),
    });
  }

  export const useDeleteAssetMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof DeleteLayerAssetDocument>) => layersetClient.request(DeleteLayerAssetDocument, val),
    });
  }

  export const useLocateAssetMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof LocateLayerAssetDocument>) => layersetClient.request(LocateLayerAssetDocument, val),
    });
  }

  export const useUpdateGroupMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof UpdateLayerGroupDocument>) => layersetClient.request(UpdateLayerGroupDocument, val),
    });
  }

  export const useDeleteGroupMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof DeleteLayerGroupDocument>) => layersetClient.request(DeleteLayerGroupDocument, val),
    });
  }

  export const useLocateGroupMutation = () => {
    return useMutation({
      mutationFn: (val: VariablesOf<typeof LocateLayerGroupDocument>) => layersetClient.request(LocateLayerGroupDocument, val),
    });
  }
}