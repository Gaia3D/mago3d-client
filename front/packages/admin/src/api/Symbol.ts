import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { bbsGraphqlClient } from "./QueryClient";
import { axiosInstance } from "./http";
import {
  CreateSymbolDocument,
  CreateSymbolGroupDocument,
  CreateSymbolGroupMutationVariables,
  CreateSymbolMutationVariables,
  DeleteSymbolDocument, DeleteSymbolFileDocument, DeleteSymbolFileMutationVariables,
  DeleteSymbolGroupDocument,
  DeleteSymbolGroupMutationVariables,
  DeleteSymbolMutationVariables,
  SymbolDocument,
  SymbolGroupDocument,
  SymbolGroupQueryVariables,
  SymbolGroupsDocument,
  SymbolGroupsQueryVariables,
  SymbolQueryVariables,
  SymbolsDocument,
  SymbolsQueryVariables,
  UpdateSymbolDocument,
  UpdateSymbolGroupDocument,
  UpdateSymbolGroupMutationVariables,
  UpdateSymbolMutationVariables,
} from "@src/generated/gql/bbs/graphql";

export const useSymbol = (val: SymbolQueryVariables) => {
  return useSuspenseQuery({
    queryKey: ["symbol", val],
    queryFn: () => bbsGraphqlClient.request(SymbolDocument, val),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useSymbolsQuery = (val: SymbolsQueryVariables) => {
  return useSuspenseQuery({
    queryKey: ["symbols", val],
    queryFn: () => bbsGraphqlClient.request(SymbolsDocument, val),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useSymbolGroup = (val: SymbolGroupQueryVariables) => {
  return useSuspenseQuery({
    queryKey: ["symbolGroup", val],
    queryFn: () => bbsGraphqlClient.request(SymbolGroupDocument, val),
  });
};
export const useSymbolGroups = (val?: SymbolGroupsQueryVariables) => {
  return useSuspenseQuery({
    queryKey: ["symbolGroups", val],
    queryFn: () => bbsGraphqlClient.request(SymbolGroupsDocument, val),
  });
};

export const useCreateSymbolMutation = () => {
  return useMutation({
    mutationFn: (val: CreateSymbolMutationVariables) =>
      bbsGraphqlClient.request(CreateSymbolDocument, val),
  });
};

export const useUpdateSymbolMutation = () => {
  return useMutation({
    mutationFn: (val: UpdateSymbolMutationVariables) =>
      bbsGraphqlClient.request(UpdateSymbolDocument, val),
  });
};

export const useDeleteSymbolMutation = () => {
  return useMutation({
    mutationFn: (val: DeleteSymbolMutationVariables) =>
      bbsGraphqlClient.request(DeleteSymbolDocument, val),
  });
};

export const useDeleteSymbolFileMutation = () => {
  return useMutation({
    mutationFn: (val: DeleteSymbolFileMutationVariables) =>
      bbsGraphqlClient.request(DeleteSymbolFileDocument, val),
  })
}

export const useCreateSymbolGroupMutation = () => {
  return useMutation({
    mutationFn: (val: CreateSymbolGroupMutationVariables) =>
      bbsGraphqlClient.request(CreateSymbolGroupDocument, val),
  });
};

export const useUpdateSymbolGroupMutation = () => {
  return useMutation({
    mutationFn: (val: UpdateSymbolGroupMutationVariables) =>
      bbsGraphqlClient.request(UpdateSymbolGroupDocument, val),
  });
};

export const useDeleteSymbolGroupMutation = () => {
  return useMutation({
    mutationFn: (val: DeleteSymbolGroupMutationVariables) =>
      bbsGraphqlClient.request(DeleteSymbolGroupDocument, val),
  });
};

export const symbolFileUpload = ({ data }: { data: FormData }) =>
  axiosInstance.postForm(`${import.meta.env.VITE_API_BBS}/symbol/upload`, data);