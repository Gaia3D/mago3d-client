import {atom, selector, useResetRecoilState} from "recoil";
import {DataItemSize, DataSearchQueryOption, DataSearchTarget} from "@/types/assets/Data.ts";
import {
    AssetFilterInput, AssetPageableInput, AssetSort,
    AssetType,
    DatasetAssetListQueryVariables,
    ProcessTaskStatus
} from "@/generated/gql/dataset/graphql.ts";

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
  default: 'contains'
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

      filter.name = {};
      filter.name[searchQueryOption] = searchText;

      filter.createdAt = {};

      filter.status = {};
      if (processState) {
        filter.status.eq = processState;
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