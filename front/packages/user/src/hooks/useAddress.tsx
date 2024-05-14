import { searchGraphqlFetcher } from "@/api/queryClient";
import { BOUNDARY_SEARH, BOUNDARY_SEARH_SIDO } from "@/graphql/search/Query";
import { selectedSggState, selectedSidoState } from "@/recoils/Boundary";
import { BoundarySearchItem, Query } from "@mnd/shared/src/types/search-gen-type";
import { DefaultError, useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";

export const useSidoAddress = () => {
  const { data, isLoading, error } = useQuery<Query, DefaultError, BoundarySearchItem[]>({
		queryKey: ['boundarySearchSido'],
		queryFn: () => searchGraphqlFetcher(BOUNDARY_SEARH_SIDO),
    select: (data) => data.boundarySearch.data
	});

  return { data, isLoading, error };
};

export const useSggAddress = () => {
  const selectedSido = useRecoilValue<BoundarySearchItem | undefined>(selectedSidoState);
  const { data, isLoading, error } = useQuery<Query, DefaultError, BoundarySearchItem[]>({
		queryKey: ['boundarySearch', selectedSido?.code],
		queryFn: () => searchGraphqlFetcher(BOUNDARY_SEARH, { code: selectedSido?.code }),
    select: (data) => data.boundarySearch.data,
    enabled: !!selectedSido
	});
  
  return { data, isLoading, error };
};

export const useUmdAddress = () => {
  const selectedSgg = useRecoilValue<BoundarySearchItem | undefined>(selectedSggState);
  const { data, isLoading, error } = useQuery<Query, DefaultError, BoundarySearchItem[]>({
		queryKey: ['boundarySearch', selectedSgg?.code],
		queryFn: () => searchGraphqlFetcher(BOUNDARY_SEARH, { code: selectedSgg?.code }),
    select: (data) => data.boundarySearch.data,
    enabled: !!selectedSgg
	});
  
  return { data, isLoading, error };
};