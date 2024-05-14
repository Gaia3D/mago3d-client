import {atom, selector, useResetRecoilState} from "recoil";
import {DataItemSize, DataSearchQueryOption, DataSearchTarget} from "../types/Data";
import dayjs from "dayjs";
import {
  AssetFilterInput, AssetPageableInput, AssetSort,
  AssetType,
  DatasetAssetListQueryVariables,
  ProcessTaskStatus
} from "@src/generated/gql/dataset/graphql";

export const dataCurrentPageState = atom<number>({
  key: 'dataCurrentPageState',
  default: 0,
});

export const dataItemSizeState = atom<DataItemSize>({
  key: 'dataItemSizeState',
  default: 10
});

export const dataCreateDateFromState = atom<string | undefined>({
  key: 'dataCreateDateFromState',
  default: undefined
});

export const dataCreateDateToState = atom<string | undefined>({
  key: 'dataCreateDateToState',
  default: undefined
});

export const dataSearchTargetState = atom<DataSearchTarget>({
  key: 'dataSearchTargetState',
  default: 'data'
});

export const dataSearchQueryOptionState = atom<DataSearchQueryOption>({
  key: 'dataSearchQueryOptionState',
  default: 'eq'
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
      const pageable = {} as AssetPageableInput

      const page = get(dataCurrentPageState);
      const itemsSize = get(dataItemSizeState);

      const dateFrom = get(dataCreateDateFromState);
      const dateFromRFC3339 = dateFrom ? dayjs(dateFrom).startOf('day').toISOString() : undefined;
      const dateTo = get(dataCreateDateToState);
      const dateToRFC3339 = dateTo ? dayjs(dateTo).endOf('day').toISOString() : undefined;
      const searchTarget = get(dataSearchTargetState);
      const searchQueryOption = get(dataSearchQueryOptionState);
      const searchText = get(dataSearchTextState);
      const processState = get(dataProcessStatusState);
      const assetType = get(dataAssetTypeState);

      if (searchTarget === 'data') {
        filter.name = {};
        filter.name[searchQueryOption] = searchText;
      } else if (searchTarget === 'group') {
        filter.groupName = {};
        filter.groupName[searchQueryOption] = searchText;
      }

      filter.createdAt = {};
      if (dateFromRFC3339 && dateToRFC3339) {
        filter.createdAt.between = [dateFromRFC3339, dateToRFC3339];
      } else if (dateFromRFC3339 && !dateToRFC3339) {
        filter.createdAt.gt = dateFromRFC3339;
      } else if (!dateFromRFC3339 && dateToRFC3339) {
        filter.createdAt.lt = dateToRFC3339;
      }

      filter.status = {};
      if (processState) {
        filter.status.eq = processState;
      }

      filter.assetType = {};
      if (assetType) {
        filter.assetType.eq = assetType;
      }

      pageable.size = itemsSize;
      pageable.page = page;
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
  const reset3 = useResetRecoilState(dataCreateDateFromState);
  const reset4 = useResetRecoilState(dataCreateDateToState);
  const reset5 = useResetRecoilState(dataSearchTargetState);
  const reset6 = useResetRecoilState(dataSearchQueryOptionState);
  const reset7 = useResetRecoilState(dataSearchTextState);
  const reset8 = useResetRecoilState(dataProcessStatusState);
  const reset9 = useResetRecoilState(dataAssetTypeState);
  return () => {
    reset1();
    reset2();
    reset3();
    reset4();
    reset5();
    reset6();
    reset7();
    reset8();
    reset9();
  }
}