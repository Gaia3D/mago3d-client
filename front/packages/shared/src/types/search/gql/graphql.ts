/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: any; output: any; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: any; output: any; }
  /** A JSON scalar */
  JSON: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
  /** An RFC-3339 compliant Full Time Scalar */
  Time: { input: any; output: any; }
  /** A universally unique identifier compliant UUID Scalar */
  UUID: { input: any; output: any; }
};

export type AddressSearchFilter = {
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type AddressSearchItem = {
  __typename?: 'AddressSearchItem';
  bldMnnm?: Maybe<Scalars['String']['output']>;
  bldSlno?: Maybe<Scalars['String']['output']>;
  emdName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  lon?: Maybe<Scalars['Float']['output']>;
  roadAddr: Scalars['String']['output'];
  roadName?: Maybe<Scalars['String']['output']>;
  sggName?: Maybe<Scalars['String']['output']>;
  sidoName?: Maybe<Scalars['String']['output']>;
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
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type BmkptSearchItem = {
  __typename?: 'BmkptSearchItem';
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  lon?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type BmkptSearchResponse = {
  __typename?: 'BmkptSearchResponse';
  items: Array<BmkptSearchItem>;
  pageInfo: PaginationInfo;
};

export type BooleanCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  ge?: InputMaybe<Scalars['Boolean']['input']>;
  gt?: InputMaybe<Scalars['Boolean']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Boolean']['input']>;
  lt?: InputMaybe<Scalars['Boolean']['input']>;
  max?: InputMaybe<BooleanCriteria>;
  min?: InputMaybe<BooleanCriteria>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']['input']>>>;
};

export type BoundarySearchItem = {
  __typename?: 'BoundarySearchItem';
  centerLat?: Maybe<Scalars['Float']['output']>;
  centerLon?: Maybe<Scalars['Float']['output']>;
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  maxLat?: Maybe<Scalars['Float']['output']>;
  maxLon?: Maybe<Scalars['Float']['output']>;
  minLat?: Maybe<Scalars['Float']['output']>;
  minLon?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type BoundarySearchResponse = {
  __typename?: 'BoundarySearchResponse';
  data: Array<BoundarySearchItem>;
  total: Scalars['Int']['output'];
};

export type CommonCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  ge?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  max?: InputMaybe<CommonCriteria>;
  min?: InputMaybe<CommonCriteria>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};

export type DateCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  eq?: InputMaybe<Scalars['Date']['input']>;
  ge?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Date']['input']>;
  lt?: InputMaybe<Scalars['Date']['input']>;
  max?: InputMaybe<DateCriteria>;
  min?: InputMaybe<DateCriteria>;
  ne?: InputMaybe<Scalars['Date']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
};

export type DateTimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  ge?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['DateTime']['input']>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  max?: InputMaybe<DateTimeCriteria>;
  min?: InputMaybe<DateTimeCriteria>;
  ne?: InputMaybe<Scalars['DateTime']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
};

export type DistrictSearchFilter = {
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type DistrictSearchResponse = {
  __typename?: 'DistrictSearchResponse';
  items: Array<BoundarySearchItem>;
  pageInfo: PaginationInfo;
};

export type FloatCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  max?: InputMaybe<FloatCriteria>;
  min?: InputMaybe<FloatCriteria>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
};

export type IntCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  max?: InputMaybe<IntCriteria>;
  min?: InputMaybe<IntCriteria>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type JsonPatchInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  op: JsonPatchOp;
  path: Scalars['String']['input'];
  value?: InputMaybe<Scalars['JSON']['input']>;
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
  merge?: InputMaybe<Scalars['JSON']['input']>;
  patch?: InputMaybe<Array<InputMaybe<JsonPropertyPatchInput>>>;
};

export type JsonPropertyPatchInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  op: JsonPropertyPatchOperation;
  path: Scalars['String']['input'];
  value?: InputMaybe<Scalars['JSON']['input']>;
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
  between?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  eq?: InputMaybe<Scalars['Long']['input']>;
  ge?: InputMaybe<Scalars['Long']['input']>;
  gt?: InputMaybe<Scalars['Long']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Long']['input']>;
  lt?: InputMaybe<Scalars['Long']['input']>;
  max?: InputMaybe<LongCriteria>;
  min?: InputMaybe<LongCriteria>;
  ne?: InputMaybe<Scalars['Long']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']['input']>>>;
};

export type OwnerCriteria = {
  eq?: InputMaybe<Scalars['UUID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['UUID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};

/**
 * #################################################################
 * # Pagination
 * #################################################################
 */
export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor: Scalars['ID']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor: Scalars['ID']['output'];
};

export type PaginationInfo = {
  __typename?: 'PaginationInfo';
  /**  Number of items per page */
  hasNextPage: Scalars['Boolean']['output'];
  /**  if there is a next page */
  hasPreviousPage: Scalars['Boolean']['output'];
  /**  the total amount of elements */
  page: Scalars['Int']['output'];
  /**  Current page number */
  size: Scalars['Int']['output'];
  /**  the number of total pages */
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PoiSearchFilter = {
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type PoiSearchItem = {
  __typename?: 'PoiSearchItem';
  addressParcel?: Maybe<Scalars['String']['output']>;
  addressRoad?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  lon?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
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
  code?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
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
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  name: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SimpleTagDeleteInput = {
  id: Scalars['ID']['input'];
};

export type SimpleTagUpdateInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SimpleTagValue = {
  __typename?: 'SimpleTagValue';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type StringCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  containsIgnoreCase?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  endsWithIgnoreCase?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  eqIgnoreCase?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  isEmpty?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  matches?: InputMaybe<Scalars['String']['input']>;
  max?: InputMaybe<StringCriteria>;
  min?: InputMaybe<StringCriteria>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
  startsWithIgnoreCase?: InputMaybe<Scalars['String']['input']>;
};

export type TimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  eq?: InputMaybe<Scalars['Time']['input']>;
  ge?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<Scalars['Time']['input']>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  max?: InputMaybe<TimeCriteria>;
  min?: InputMaybe<TimeCriteria>;
  ne?: InputMaybe<Scalars['Time']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
};

export type TriptSearchFilter = {
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type TriptSearchItem = {
  __typename?: 'TriptSearchItem';
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  lon?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type TriptSearchResponse = {
  __typename?: 'TriptSearchResponse';
  items: Array<TriptSearchItem>;
  pageInfo: PaginationInfo;
};

export type UnsptSearchFilter = {
  keyword: Scalars['String']['input'];
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type UnsptSearchItem = {
  __typename?: 'UnsptSearchItem';
  id: Scalars['ID']['output'];
  lat?: Maybe<Scalars['Float']['output']>;
  lon?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
};

export type UnsptSearchResponse = {
  __typename?: 'UnsptSearchResponse';
  items: Array<UnsptSearchItem>;
  pageInfo: PaginationInfo;
};

export type WithAuditable = {
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type WithJsonProperty = {
  properties?: Maybe<Scalars['JSON']['output']>;
};

export type WithSimpleTags = {
  tags: Array<Maybe<SimpleTagValue>>;
};

export type Bmkpt_SearchQueryVariables = Exact<{
  filter?: InputMaybe<BmkptSearchFilter>;
}>;


export type Bmkpt_SearchQuery = { __typename?: 'Query', bmkptSearch: { __typename?: 'BmkptSearchResponse', items: Array<{ __typename?: 'BmkptSearchItem', id: string, name: string, lat?: number | null, lon?: number | null }> } };

export type Address_SearchQueryVariables = Exact<{
  filter?: InputMaybe<AddressSearchFilter>;
}>;


export type Address_SearchQuery = { __typename?: 'Query', addressSearch: { __typename?: 'AddressSearchResponse', items: Array<{ __typename?: 'AddressSearchItem', id: string, sidoName?: string | null, sggName?: string | null, emdName?: string | null, bldMnnm?: string | null, bldSlno?: string | null, roadName?: string | null, roadAddr: string, lat?: number | null, lon?: number | null }> } };

export type Unspt_SearchQueryVariables = Exact<{
  filter?: InputMaybe<UnsptSearchFilter>;
}>;


export type Unspt_SearchQuery = { __typename?: 'Query', unsptSearch: { __typename?: 'UnsptSearchResponse', items: Array<{ __typename?: 'UnsptSearchItem', id: string, name: string, lat?: number | null, lon?: number | null }> } };

export type Tript_SearchQueryVariables = Exact<{
  filter?: InputMaybe<TriptSearchFilter>;
}>;


export type Tript_SearchQuery = { __typename?: 'Query', triptSearch: { __typename?: 'TriptSearchResponse', items: Array<{ __typename?: 'TriptSearchItem', id: string, name: string, lat?: number | null, lon?: number | null }> } };


export const Bmkpt_SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BMKPT_SEARCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BmkptSearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"bmkptSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<Bmkpt_SearchQuery, Bmkpt_SearchQueryVariables>;
export const Address_SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ADDRESS_SEARCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AddressSearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addressSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sidoName"}},{"kind":"Field","name":{"kind":"Name","value":"sggName"}},{"kind":"Field","name":{"kind":"Name","value":"emdName"}},{"kind":"Field","name":{"kind":"Name","value":"bldMnnm"}},{"kind":"Field","name":{"kind":"Name","value":"bldSlno"}},{"kind":"Field","name":{"kind":"Name","value":"roadName"}},{"kind":"Field","name":{"kind":"Name","value":"roadAddr"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<Address_SearchQuery, Address_SearchQueryVariables>;
export const Unspt_SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UNSPT_SEARCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsptSearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsptSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<Unspt_SearchQuery, Unspt_SearchQueryVariables>;
export const Tript_SearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TRIPT_SEARCH"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TriptSearchFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"triptSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"lat"}},{"kind":"Field","name":{"kind":"Name","value":"lon"}}]}}]}}]}}]} as unknown as DocumentNode<Tript_SearchQuery, Tript_SearchQueryVariables>;