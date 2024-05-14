import {atom, DefaultValue, selector,} from "recoil";
import {
  UserQueryWithAdditionalPageInfo,
  UserSearchCondition,
  UserSearchConditionDivision,
  UserSearchConditionTarget
} from "../types/User";
import {produce} from "immer";
import {UserFilter, UserPageable, UsersetUserListQueryVariables, UserSort} from "@src/generated/gql/userset/graphql";

export const userCurrentPageState = atom<number>({
  key: 'userCurrentPageState',
  default: 0,
});

export const userItemSizeState = atom<number>({
  key: 'userItemSizeState',
  default: 10
});

export type UserSearch = {
  keyword?: string;
  target?: UserSearchConditionTarget;
  division?: UserSearchConditionDivision
  enabled?: boolean;
  exact: boolean;
  pageNum: number;
  pageSize: number;
  pageSort: UserSort[];
}

export const userSearchState = atom<UserSearch>({
  key: 'userSearchState',
  default: {
    keyword: '',
    division: 'army',
    exact: true,
    pageNum: 0,
    pageSize: 10,
    pageSort: [UserSort.CreatedAtDesc]
  }
});


export const userSearchSelector = selector<UsersetUserListQueryVariables>({
  key: 'userSearchSelector',
  get: ({get}) => {
    const state = get(userSearchState);

    const pageable = {
      page: state.pageNum,
      size: state.pageSize,
      sort: state.pageSort
    } as UserPageable;

    const filter = {} as UserFilter;
    console.info(state.enabled);
    if (state.enabled !== undefined) {
      filter.enabled = state.enabled ? {eq: true} : {eq: false};
    }
    //filter.enabled = state.enabled ? {eq: true} : {eq: false};

    if (state.target) {
      if (state.target === 'username' && state.keyword) {
        filter.username = state.exact ? {eq: state.keyword} : {containsIgnoreCase: state.keyword};
      }

      if (state.target === 'name' && state.keyword) {
        filter.firstName = state.exact ? {eq: state.keyword} : {containsIgnoreCase: state.keyword};
      }

      if (state.target === 'unit') {
        filter.division = state.division ? {eq: state.division} : undefined;
        filter.unit = state.keyword ? {eq: state.keyword} : undefined;
      }
    }

    console.log('userSearchState', state);
    console.log('userSearchSelector', filter, pageable);

    return {
      filter,
      pageable
    }
  },
  // set: ({set}, newValue) => {
  //     set(userSearchConditionState, produce((draft:UserSearchCondition) => {
  //         draft.max = newValue.pageable.size;
  //         // if(!(newValue instanceof DefaultValue)) draft.currentPage = newValue.currentPage;
  //     }))
  // },
});

export const userSearchConditionState = atom<UserSearchCondition>({
  key: 'userSearchConditionState',
  default: {
    currentPage: 1,
    representationCount: 10,
    first: 0,
    max: 10,
    enabled: true,
  } as UserSearchCondition
});

export const userQueryGenerator = selector<UserQueryWithAdditionalPageInfo>({
  key: 'userQueryGenerator',
  set: ({set}, newValue) => {
    set(userSearchConditionState, produce((draft: UserSearchCondition) => {
      if (!(newValue instanceof DefaultValue)) draft.currentPage = newValue.currentPage;
    }))
  },
  get: ({get}) => {
    const {currentPage, representationCount, enabled, exact, target, keyword, division} = get(userSearchConditionState);
    // console.log('userQueryGenerator', currentPage, representationCount, enabled, exact, target, keyword, division);
    const first = currentPage * representationCount - representationCount;
    const max = representationCount;
    const QEnabled = enabled ? enabled : false;
    const QExact = exact ? exact : false;

    const defaultQuery = {
      first,
      max,
      enabled: QEnabled,
      exact: QExact,
      currentPage,
      representationCount
    } as UserQueryWithAdditionalPageInfo;

    if (target) {
      switch (target) {
        case 'username':
          defaultQuery.username = keyword;
          break;
        case 'name':
          defaultQuery.firstName = keyword;
          break;
        case 'unit': {
          let q = `division:${division}`;
          if (keyword) q += ` unit:${keyword}`;
          defaultQuery.q = q;
          break;
        }
      }
    }

    return defaultQuery;
  }
});