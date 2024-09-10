import { DefaultValue, atom, selector } from "recoil";

export enum SearchCategoryType {
    Place = "poi",
    Address = "address",
    Unsp = "unspt",
    Tript = "tript",
    Bmkpt = "bmkpt",
}

export interface SearchCategory {
  label: string;
  value: SearchCategoryType;
  checked: boolean;
}

export type SearchState = {
  Categories: SearchCategory[];
  Keyword?: string;
};

export const searchState = atom<SearchState>({
  key: "SearchState",
  default: {
    Categories: [
      { label: "장소", value: SearchCategoryType.Place, checked: true },
      { label: "새주소", value: SearchCategoryType.Address, checked: true },
      { label: "통합기준점", value: SearchCategoryType.Unsp, checked: true },
      { label: "삼각점", value: SearchCategoryType.Tript, checked: true },
      { label: "수준점", value: SearchCategoryType.Bmkpt, checked: true },
    ],
  },
});

export const debounceKeywordState = atom<string>({
    key: "DebounceKeywordState",
    default: "",
  });

/**
 * 검색 키워드 상태
 */
export const searchKeywordState = selector({
  key: "SearchState.Keyword",
  get: ({ get }) => get(searchState).Keyword,
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(searchState);
    } else {
      set(searchState, (prev) => {
        return { ...prev, Keyword: newValue };
      });
    }
  },
});

/**
 * 검색 항목 상태
 */
export const searchCategoryState = selector({
  key: "SearchState.Categories",
  get: ({ get }) => get(searchState).Categories,
  set: ({ set, reset }, newValue) => {
    if (newValue instanceof DefaultValue) {
      reset(searchState);
    } else {
      set(searchState, (prev) => {
        return { ...prev, Categories: newValue };
      });
    }
  },
});

export const searchConditionState = selector<SearchState>({
    key: "SearchState.Condition",
    get: ({ get }) => {
        const Keyword = get(debounceKeywordState);
        const Categories = get(searchCategoryState);
        return {
            Keyword,
            Categories,
        };
    }
})

/**
 * 선택된 검색 항목
 */
export const searchSelectedCategoryState = selector({
  key: "SearchState.Categories.Checked",
  get: ({ get }) => get(searchState).Categories.filter((item) => item.checked),
});
