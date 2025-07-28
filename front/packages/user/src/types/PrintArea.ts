export interface SearchCondition {
  key: string | undefined;
  isString: boolean;
  keyword: string;
  criteria: "eq" | "contains";
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
}
