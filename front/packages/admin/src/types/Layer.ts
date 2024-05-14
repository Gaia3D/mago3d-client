/* 
import { AssetFilterInput, LayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql";
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from "@tanstack/react-query";

export type UpdateDataGroupProps = {
    id: string;
    group: Group;
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<Group, unknown>>
}

export type LayerSearchTarget = "group" | "data";
export type LayerSearchQueryOption = "eq" | "contains";
export type LayerItemSize = 10 | 50 | 100;

export type LayerSearchProps = {
    filter: AssetFilterInput;
    pageable: LayerPageableInput;
}

export type DataGroupsProps = {
    dataGroups: LayerGroup[];
    dataGroupsRefetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<Group[], unknown>>
}

export type DataGroupPropsWithId = DataGroupsProps & {
    id: string
} */