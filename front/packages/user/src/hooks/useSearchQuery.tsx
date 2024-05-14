import {SearchCategoryType, searchConditionState} from "@/recoils/SearchState";
import {useRecoilValue} from "recoil";
import {DefaultError, useQuery} from '@tanstack/react-query'
import { searchGraphqlFetcher } from "@/api/queryClient";
import {ADDRESS_SEARCH, BMKPT_SEARCH, POI_SEARCH, TRIPT_SEARCH, UNSPT_SEARCH} from "@/graphql/search/Query";
import { Query } from "@mnd/shared/src/types/search-gen-type";

export const useSearchQuery = (type:SearchCategoryType) => {
	const { Keyword, Categories } = useRecoilValue(searchConditionState);
  const category = Categories.find((item) => item.value === type);
	const checked = category?.checked;

	const mainQuerykey = getQueryKey(type);
	const DOCUMENT = getDocument(type);

  const { data, isFetching, error } = useQuery<Query, DefaultError>({
		queryKey: [mainQuerykey, Keyword],
		queryFn: () => searchGraphqlFetcher(DOCUMENT, {
			filter: {
				keyword: Keyword,
			},
		}),
		enabled: category && checked,
	});

  return {data, isFetching, error, checked};
};

const getQueryKey = (type:SearchCategoryType) => {
	switch (type) {
		case SearchCategoryType.Address:
			return 'addressSearch';
		case SearchCategoryType.Unsp:
			return 'unsptSearch';
		case SearchCategoryType.Tript:
			return 'triptSearch';
		case SearchCategoryType.Bmkpt:
			return 'bmkptSearch';
	}
}

const getDocument = (type:SearchCategoryType) => {
	switch (type) {
		case SearchCategoryType.Place:
			return POI_SEARCH;
		case SearchCategoryType.Address:
			return ADDRESS_SEARCH;
		case SearchCategoryType.Unsp:
			return UNSPT_SEARCH;
		case SearchCategoryType.Tript:
			return TRIPT_SEARCH;
		case SearchCategoryType.Bmkpt:
			return BMKPT_SEARCH;
	}
}