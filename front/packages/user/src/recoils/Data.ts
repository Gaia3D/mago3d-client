import {atom, selector, useRecoilValueLoadable, useResetRecoilState} from "recoil";
import {DataItemSize, DataSearchQueryOption, DataSearchTarget} from "@/types/assets/Data.ts";
import {
    AssetType,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus,
    AssetFilterInput,
    AssetPageableInput,
    AssetSort, T3DFormatType
} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {IUserInfo} from "@mnd/shared";
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

export const dataSearchSelector = selector<DatasetAssetListQueryVariables>({
  key: 'dataSearchSelector',
  get: ({get}) => {
      const filter = {} as AssetFilterInput;
      const pageable = {} as AssetPageableInput;

      const page = get(dataCurrentPageState);
      const itemsSize = get(dataItemSizeState);
      const searchQueryOption = get(dataSearchQueryOptionState);
      const searchText = get(dataSearchTextState);
      const processState = get(dataProcessStatusState);
      const profile = get(currentUserProfileSelector);

      filter.name = {};
      filter.name[searchQueryOption] = searchText;

      filter.status = {};
      if (processState) {
        filter.status.eq = processState;
      }
      filter.createdBy = {};
      if (profile) {
          filter.createdBy.eq = profile.id;
      }

      pageable.page = page;
      pageable.size = itemsSize;
      pageable.sort = [AssetSort.CreatedAtDesc];

      return {
        filter,
        pageable
      }
  }
})


export const useDataRecoilInit = () => {
  const reset1 = useResetRecoilState(dataCurrentPageState);
  const reset2 = useResetRecoilState(dataItemSizeState);
  const reset3 = useResetRecoilState(dataSearchQueryOptionState);
  const reset4 = useResetRecoilState(dataSearchTextState);
  const reset5 = useResetRecoilState(dataProcessStatusState);
  const reset6 = useResetRecoilState(dataAssetTypeState);
  return () => {
    reset1();
    reset2();
    reset3();
    reset4();
    reset5();
    reset6();
  }
}