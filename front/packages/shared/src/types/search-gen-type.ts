import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: any;
  JSON: any;
  Long: any;
  Time: any;
  UUID: any;
};

export type AddressSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type AddressSearchItem = {
  __typename?: 'AddressSearchItem';
  bldMnnm?: Maybe<Scalars['String']>;
  bldSlno?: Maybe<Scalars['String']>;
  emdName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  roadAddr: Scalars['String'];
  roadName?: Maybe<Scalars['String']>;
  sggName?: Maybe<Scalars['String']>;
  sidoName?: Maybe<Scalars['String']>;
};

export type AddressSearchResponse = {
  __typename?: 'AddressSearchResponse';
  items: Array<AddressSearchItem>;
  pageInfo: PaginationInfo;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type BmkptSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type BmkptSearchItem = {
  __typename?: 'BmkptSearchItem';
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type BmkptSearchResponse = {
  __typename?: 'BmkptSearchResponse';
  items: Array<BmkptSearchItem>;
  pageInfo: PaginationInfo;
};

export type BooleanCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  eq?: InputMaybe<Scalars['Boolean']>;
  ge?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['Boolean']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Boolean']>;
  lt?: InputMaybe<Scalars['Boolean']>;
  max?: InputMaybe<BooleanCriteria>;
  min?: InputMaybe<BooleanCriteria>;
  ne?: InputMaybe<Scalars['Boolean']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>;
};

export type BoundarySearchItem = {
  __typename?: 'BoundarySearchItem';
  centerLat?: Maybe<Scalars['Float']>;
  centerLon?: Maybe<Scalars['Float']>;
  code: Scalars['String'];
  id: Scalars['ID'];
  maxLat?: Maybe<Scalars['Float']>;
  maxLon?: Maybe<Scalars['Float']>;
  minLat?: Maybe<Scalars['Float']>;
  minLon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type BoundarySearchResponse = {
  __typename?: 'BoundarySearchResponse';
  data: Array<BoundarySearchItem>;
  total: Scalars['Int'];
};

export type CommonCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  max?: InputMaybe<CommonCriteria>;
  min?: InputMaybe<CommonCriteria>;
  ne?: InputMaybe<Scalars['ID']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

export type DateCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  eq?: InputMaybe<Scalars['Date']>;
  ge?: InputMaybe<Scalars['Date']>;
  gt?: InputMaybe<Scalars['Date']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Date']>;
  lt?: InputMaybe<Scalars['Date']>;
  max?: InputMaybe<DateCriteria>;
  min?: InputMaybe<DateCriteria>;
  ne?: InputMaybe<Scalars['Date']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
};

export type DateTimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  eq?: InputMaybe<Scalars['DateTime']>;
  ge?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['DateTime']>;
  lt?: InputMaybe<Scalars['DateTime']>;
  max?: InputMaybe<DateTimeCriteria>;
  min?: InputMaybe<DateTimeCriteria>;
  ne?: InputMaybe<Scalars['DateTime']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>;
};

export type DistrictSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type DistrictSearchResponse = {
  __typename?: 'DistrictSearchResponse';
  items: Array<BoundarySearchItem>;
  pageInfo: PaginationInfo;
};

export type FloatCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  max?: InputMaybe<FloatCriteria>;
  min?: InputMaybe<FloatCriteria>;
  ne?: InputMaybe<Scalars['Float']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

export type IntCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  max?: InputMaybe<IntCriteria>;
  min?: InputMaybe<IntCriteria>;
  ne?: InputMaybe<Scalars['Int']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export type JsonPatchInput = {
  from?: InputMaybe<Scalars['String']>;
  op: JsonPatchOp;
  path: Scalars['String'];
  value?: InputMaybe<Scalars['JSON']>;
};

/**
 * #################################################################
 * # JsonPatch
 * #################################################################
 */
export enum JsonPatchOp {
  Add = 'add',
  Copy = 'copy',
  Move = 'move',
  Remove = 'remove',
  Replace = 'replace',
  Test = 'test'
}

export type JsonPropertyInput = {
  /**  Using RFC6902 JSON Patch */
  merge?: InputMaybe<Scalars['JSON']>;
  patch?: InputMaybe<Array<InputMaybe<JsonPropertyPatchInput>>>;
};

export type JsonPropertyPatchInput = {
  from?: InputMaybe<Scalars['String']>;
  op: JsonPropertyPatchOperation;
  path: Scalars['String'];
  value?: InputMaybe<Scalars['JSON']>;
};

/**
 * #################################################################
 * # JsonProperty
 * #################################################################
 */
export enum JsonPropertyPatchOperation {
  Add = 'add',
  Copy = 'copy',
  Move = 'move',
  Remove = 'remove',
  Replace = 'replace',
  Test = 'test'
}

export type LongCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  eq?: InputMaybe<Scalars['Long']>;
  ge?: InputMaybe<Scalars['Long']>;
  gt?: InputMaybe<Scalars['Long']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Long']>;
  lt?: InputMaybe<Scalars['Long']>;
  max?: InputMaybe<LongCriteria>;
  min?: InputMaybe<LongCriteria>;
  ne?: InputMaybe<Scalars['Long']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>;
};

export type OwnerCriteria = {
  eq?: InputMaybe<Scalars['UUID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['UUID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['UUID']>>>;
};

/**
 * #################################################################
 * # Pagination
 * #################################################################
 */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['ID'];
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor: Scalars['ID'];
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  /**  Number of items per page */
  hasNextPage: Scalars['Boolean'];
  /**  if there is a next page */
  hasPreviousPage: Scalars['Boolean'];
  /**  the total amount of elements */
  page: Scalars['Int'];
  /**  Current page number */
  size: Scalars['Int'];
  /**  the number of total pages */
  totalItems: Scalars['Int'];
  totalPages: Scalars['Int'];
};

export type PoiSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type PoiSearchItem = {
  __typename?: 'PoiSearchItem';
  addressParcel?: Maybe<Scalars['String']>;
  addressRoad?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type PoiSearchResponse = {
  __typename?: 'PoiSearchResponse';
  items: Array<PoiSearchItem>;
  pageInfo: PaginationInfo;
};

export type Query = {
  __typename?: 'Query';
  addressSearch: AddressSearchResponse;
  /**  검색 */
  bmkptSearch: BmkptSearchResponse;
  /**  행정구역 지도 검색 */
  boundarySearch: BoundarySearchResponse;
  districtSearch: DistrictSearchResponse;
  poiSearch: PoiSearchResponse;
  triptSearch: TriptSearchResponse;
  unsptSearch: UnsptSearchResponse;
};


export type QueryAddressSearchArgs = {
  filter?: InputMaybe<AddressSearchFilter>;
};


export type QueryBmkptSearchArgs = {
  filter?: InputMaybe<BmkptSearchFilter>;
};


export type QueryBoundarySearchArgs = {
  code?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};


export type QueryDistrictSearchArgs = {
  filter?: InputMaybe<DistrictSearchFilter>;
};


export type QueryPoiSearchArgs = {
  filter?: InputMaybe<PoiSearchFilter>;
};


export type QueryTriptSearchArgs = {
  filter?: InputMaybe<TriptSearchFilter>;
};


export type QueryUnsptSearchArgs = {
  filter?: InputMaybe<UnsptSearchFilter>;
};

/**
 * #################################################################
 * # Default Filter Operators
 * #################################################################
 */
export type SimpleCriteria = {
  eq?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
};

/**
 * #################################################################
 * # SimpleTag
 * #################################################################
 */
export type SimpleTagCommandInput = {
  create?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  delete?: InputMaybe<Array<InputMaybe<SimpleTagDeleteInput>>>;
  update?: InputMaybe<Array<InputMaybe<SimpleTagUpdateInput>>>;
};

export type SimpleTagCreateInput = {
  name: Scalars['String'];
  value: Scalars['String'];
};

export type SimpleTagDeleteInput = {
  id: Scalars['ID'];
};

export type SimpleTagUpdateInput = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type SimpleTagValue = {
  __typename?: 'SimpleTagValue';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type StringCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  containsIgnoreCase?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  endsWithIgnoreCase?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  eqIgnoreCase?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  isEmpty?: InputMaybe<Scalars['Boolean']>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  matches?: InputMaybe<Scalars['String']>;
  max?: InputMaybe<StringCriteria>;
  min?: InputMaybe<StringCriteria>;
  ne?: InputMaybe<Scalars['String']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  startsWith?: InputMaybe<Scalars['String']>;
  startsWithIgnoreCase?: InputMaybe<Scalars['String']>;
};

export type TimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  eq?: InputMaybe<Scalars['Time']>;
  ge?: InputMaybe<Scalars['Time']>;
  gt?: InputMaybe<Scalars['Time']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  le?: InputMaybe<Scalars['Time']>;
  lt?: InputMaybe<Scalars['Time']>;
  max?: InputMaybe<TimeCriteria>;
  min?: InputMaybe<TimeCriteria>;
  ne?: InputMaybe<Scalars['Time']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
};

export type TriptSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type TriptSearchItem = {
  __typename?: 'TriptSearchItem';
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type TriptSearchResponse = {
  __typename?: 'TriptSearchResponse';
  items: Array<TriptSearchItem>;
  pageInfo: PaginationInfo;
};

export type UnsptSearchFilter = {
  keyword: Scalars['String'];
  size?: InputMaybe<Scalars['Int']>;
};

export type UnsptSearchItem = {
  __typename?: 'UnsptSearchItem';
  id: Scalars['ID'];
  lat?: Maybe<Scalars['Float']>;
  lon?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
};

export type UnsptSearchResponse = {
  __typename?: 'UnsptSearchResponse';
  items: Array<UnsptSearchItem>;
  pageInfo: PaginationInfo;
};

export type WithAuditable = {
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type WithJsonProperty = {
  properties?: Maybe<Scalars['JSON']>;
};

export type WithSimpleTags = {
  tags: Array<Maybe<SimpleTagValue>>;
};



export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {

  };
}
export type Sdk = ReturnType<typeof getSdk>;