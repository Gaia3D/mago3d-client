import {atom, selector, useRecoilValueLoadable, useResetRecoilState} from "recoil";
import {DataItemSize, DataSearchQueryOption, DataSearchTarget} from "@/types/assets/Data.ts";
import {
    AssetType,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus,
    AssetFilterInput,
    AssetPageableInput,
    AssetSort, T3DFormatType, PropFilterInput, PropPageableInput, PropsPagedQueryVariables, PropsSort
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {currentUserProfileSelector} from "@/recoils/Auth.ts";

export const dataCurrentPageState = atom<number>({
  key: 'dataCurrentPageState',
  default: 0,
});

export const dataItemSizeState = atom<DataItemSize>({
  key: 'dataItemSizeState',
  default: 20
});

export const dataSearchQueryOptionState = atom<DataSearchQueryOption>({
  key: 'dataSearchQueryOptionState',
  default: 'containsIgnoreCase'
});

export const dataSearchTextState = atom<string | undefined>({
  key: 'dataSearchTextState',
  default: undefined
});

export const dataProcessStatusState = atom<ProcessTaskStatus | undefined>({
  key: 'dataProcessStatusState',
  default: undefined
});

export const dataAssetTypeState = atom<AssetType | undefined>({
  key: 'dataAssetTypeState',
  default: undefined
});

export const propCurrentPageState = atom<number>({
    key: 'propCurrentPageState',
    default: 0,
});

export const propItemSizeState = atom<DataItemSize>({
    key: 'propItemSizeState',
    default: 20
});

export const propSearchQueryOptionState = atom<DataSearchQueryOption>({
    key: 'propSearchQueryOptionState',
    default: 'containsIgnoreCase'
});

export const propSearchTextState = atom<string | undefined>({
    key: 'propSearchTextState',
    default: undefined
});

const createFilter = (nameQueryOption: DataSearchQueryOption, searchText: string | undefined, processState?: ProcessTaskStatus, profileId?: string) => {
    const filter = {} as AssetFilterInput;

    filter.name = {};
    filter.name[nameQueryOption] = searchText;

    if (processState) {
        filter.status = { eq: processState };
    }
    if (profileId) {
        filter.createdBy = { eq: profileId };
    }

    return filter;
};

const createPageable = (page: number, size: DataItemSize, sort: AssetSort[] | PropsSort[]) => {
    return {
        page,
        size,
        sort
    };
};

export const dataSearchSelector = selector<DatasetAssetListQueryVariables>({
    key: 'dataSearchSelector',
    get: ({get}) => {
        const page = get(dataCurrentPageState);
        const itemsSize = get(dataItemSizeState);
        const searchQueryOption = get(dataSearchQueryOptionState);
        const searchText = get(dataSearchTextState);
        const processState = get(dataProcessStatusState);
        const profile = get(currentUserProfileSelector);

        const filter = createFilter(searchQueryOption, searchText, processState, profile?.id) as AssetFilterInput;
        const pageable = createPageable(page, itemsSize, [AssetSort.CreatedAtDesc]) as AssetPageableInput;

        return {
            filter,
            pageable
        };
    }
});

// Prop Search Selector
export const propSearchSelector = selector<PropsPagedQueryVariables>({
    key: "propSearchSelector",
    get: ({get}) => {
        const page = get(propCurrentPageState);
        const itemsSize = get(propItemSizeState);
        const searchQueryOption = get(propSearchQueryOptionState);
        const searchText = get(propSearchTextState);

        const filter = createFilter(searchQueryOption, searchText) as PropFilterInput;
        const pageable = createPageable(page, itemsSize, [PropsSort.CreatedAtDesc]) as PropPageableInput;

        return { filter, pageable };
    }
});


export const formatTypeT3D = (type: string): T3DFormatType => {
    const formatMap: Record<string, T3DFormatType> = {
        kml: T3DFormatType.Kml,
        obj: T3DFormatType.Obj,
        fbx: T3DFormatType.Fbx,
        gltf: T3DFormatType.Gltf,
        glb: T3DFormatType.Glb,
        las: T3DFormatType.Las,
        laz: T3DFormatType.Laz,
        ifc: T3DFormatType.Ifc,
        geojson: T3DFormatType.Geojson,
    };
    return formatMap[type] || T3DFormatType.Kml;
};
