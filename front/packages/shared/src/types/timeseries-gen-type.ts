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
  BigDecimal: any;
  BigInteger: any;
  Byte: any;
  Char: any;
  Date: any;
  DateTime: any;
  JSON: any;
  Long: any;
  Short: any;
  Time: any;
  UUID: any;
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Category = {
  __typename?: 'Category';
  children: Array<Category>;
  code: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateCategoryInput = {
  code: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
};

export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  code: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateProductInput = {
  date?: InputMaybe<Scalars['DateTime']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  imageYn?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<Scalars['JSON']>;
  refDateId?: InputMaybe<Scalars['ID']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  type: Scalars['String'];
  uploadId?: InputMaybe<Scalars['ID']>;
};

export type CreateProductResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateProductResponse';
  bbox?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['DateTime']>;
  download?: Maybe<Scalars['String']>;
  downloadThumbnail?: Maybe<Scalars['String']>;
  downloadThumbnailTransparent?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  extension?: Maybe<Scalars['String']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  footprint?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  imageYn?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  size?: Maybe<Scalars['Long']>;
  tags: Array<Maybe<SimpleTagValue>>;
  type: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type CreateUploadFileResponse = {
  __typename?: 'CreateUploadFileResponse';
  contentSize: Scalars['Int'];
  contentType: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  download: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  properties?: Maybe<Scalars['JSON']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type DownloadFile = {
  __typename?: 'DownloadFile';
  contentSize: Scalars['Int'];
  contentType: Scalars['String'];
  count: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  download?: Maybe<Scalars['String']>;
  expiredAt?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  id: Scalars['ID'];
  product: Product;
  properties?: Maybe<Scalars['JSON']>;
  status: DownloadStatus;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type DownloadFileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  filename?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UploadFileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
};

export type DownloadFilePageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<DownloadFileSort>>;
};

export type DownloadFilePaged = {
  __typename?: 'DownloadFilePaged';
  items: Array<Maybe<DownloadFile>>;
  pageInfo: PaginationInfo;
};

export enum DownloadFileSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

export enum DownloadStatus {
  Downloaded = 'DOWNLOADED',
  Downloading = 'DOWNLOADING',
  Expired = 'EXPIRED',
  Failed = 'FAILED',
  Ready = 'READY'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type DoyeopInfo = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'DoyeopInfo';
  areaName?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  digitalVer?: Maybe<Scalars['String']>;
  doyeopKindCode?: Maybe<Scalars['String']>;
  doyeopName?: Maybe<Scalars['String']>;
  doyeopNum?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID'];
  paperVer?: Maybe<Scalars['String']>;
  printDate?: Maybe<Scalars['DateTime']>;
  properties?: Maybe<Scalars['JSON']>;
  scaleCode?: Maybe<Scalars['String']>;
  statusCode?: Maybe<Scalars['String']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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

export type LocateCategoryInput = {
  option: LocateOption;
  target: Scalars['ID'];
};

export enum LocateOption {
  After = 'AFTER',
  Before = 'BEFORE',
  FirstChild = 'FIRST_CHILD',
  LastChild = 'LAST_CHILD'
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

export type Mutation = {
  __typename?: 'Mutation';
  /**  Category */
  createCategory: CreateCategoryResponse;
  /**  Product */
  createProduct: CreateProductResponse;
  deleteCategory: Scalars['Boolean'];
  deleteDoyeopInfo: Scalars['Boolean'];
  deleteProduct: Scalars['Boolean'];
  deleteSatelliteInfo: Scalars['Boolean'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteUploadFile: Scalars['Boolean'];
  locateCategory: Category;
  updateCategory: UpdateCategoryResponse;
  /**  DoyeopInfo */
  updateDoyeopInfo: UpdateDoyeopInfoResponse;
  updateProduct: UpdateProductResponse;
  /**  SatelliteInfo */
  updateSatelliteInfo: UpdateSatelliteInfoResponse;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateProductArgs = {
  input?: InputMaybe<CreateProductInput>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteDoyeopInfoArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteProductArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteSatelliteInfoArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID'];
};


export type MutationLocateCategoryArgs = {
  id: Scalars['ID'];
  input: LocateCategoryInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID'];
  input: UpdateCategoryInput;
};


export type MutationUpdateDoyeopInfoArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<UpdateDoyeopInfoInput>;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<UpdateProductInput>;
};


export type MutationUpdateSatelliteInfoArgs = {
  id: Scalars['ID'];
  input?: InputMaybe<UpdateSatelliteInfoInput>;
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Product = {
  __typename?: 'Product';
  bbox?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  date?: Maybe<Scalars['DateTime']>;
  download?: Maybe<Scalars['String']>;
  downloadThumbnail?: Maybe<Scalars['String']>;
  downloadThumbnailTransparent?: Maybe<Scalars['String']>;
  doyeop?: Maybe<DoyeopInfo>;
  enabled?: Maybe<Scalars['Boolean']>;
  extension?: Maybe<Scalars['String']>;
  filename?: Maybe<Scalars['String']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  footprint?: Maybe<Scalars['JSON']>;
  id: Scalars['ID'];
  imageYn?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  satellite?: Maybe<SatelliteInfo>;
  size?: Maybe<Scalars['Long']>;
  tags: Array<Maybe<SimpleTagValue>>;
  type: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type ProductFilterInput = {
  and?: InputMaybe<Array<ProductFilterInput>>;
  boundaryCode?: InputMaybe<Scalars['String']>;
  date?: InputMaybe<DateTimeCriteria>;
  month?: InputMaybe<IntCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<ProductFilterInput>;
  or?: InputMaybe<Array<ProductFilterInput>>;
  searchArea?: InputMaybe<Scalars['JSON']>;
  type?: InputMaybe<StringCriteria>;
};

/**
 * ##################################################################################
 * # ENUM
 * ##################################################################################
 */
export enum ProductFlag {
  Flag1 = 'FLAG1',
  Flag2 = 'FLAG2',
  Flag3 = 'FLAG3'
}

export type ProductPageable = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<ProductSort>>;
};

export type ProductPaged = {
  __typename?: 'ProductPaged';
  items: Array<Product>;
  pageInfo: PaginationInfo;
};

export enum ProductSort {
  DateAsc = 'DATE_ASC',
  DateDesc = 'DATE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC'
}

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  /**  Category 조회 */
  category?: Maybe<Category>;
  /**  Download */
  downloadFile: DownloadFile;
  downloadFiles: DownloadFilePaged;
  /**  Product */
  product: Product;
  products: ProductPaged;
  /**  Upload */
  uploadFile: UploadFile;
  uploadFiles: UploadFilePaged;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryDownloadFileArgs = {
  id: Scalars['ID'];
};


export type QueryDownloadFilesArgs = {
  filter?: InputMaybe<DownloadFileFilterInput>;
  pageable?: InputMaybe<DownloadFilePageableInput>;
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryProductsArgs = {
  filter: ProductFilterInput;
  pageable?: InputMaybe<ProductPageable>;
};


export type QueryUploadFileArgs = {
  id: Scalars['ID'];
};


export type QueryUploadFilesArgs = {
  filter?: InputMaybe<UploadFileFilterInput>;
  pageable?: InputMaybe<UploadFilePageableInput>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type SatelliteInfo = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'SatelliteInfo';
  acquisitionDate?: Maybe<Scalars['DateTime']>;
  bandCount?: Maybe<Scalars['String']>;
  bitCount?: Maybe<Scalars['String']>;
  cloud?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled?: Maybe<Scalars['Boolean']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  geogcs?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  multigrayCode?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  secureAreaYn?: Maybe<Scalars['Boolean']>;
  sensor?: Maybe<Scalars['String']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
  xPixel?: Maybe<Scalars['String']>;
  xResolution?: Maybe<Scalars['String']>;
  yPixel?: Maybe<Scalars['String']>;
  yResolution?: Maybe<Scalars['String']>;
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

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCategoryInput = {
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryResponse = {
  __typename?: 'UpdateCategoryResponse';
  code: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateDoyeopInfoInput = {
  areaName?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
  digitalVer?: InputMaybe<Scalars['String']>;
  doyeopKindCode?: InputMaybe<Scalars['String']>;
  doyeopName?: InputMaybe<Scalars['String']>;
  doyeopNum?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  paperVer?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<JsonPropertyInput>;
  scaleCode?: InputMaybe<Scalars['String']>;
  statusCode?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateDoyeopInfoResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateDoyeopInfoResponse';
  areaName?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  digitalVer?: Maybe<Scalars['String']>;
  doyeopKindCode?: Maybe<Scalars['String']>;
  doyeopName?: Maybe<Scalars['String']>;
  doyeopNum?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID'];
  paperVer?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  scaleCode?: Maybe<Scalars['String']>;
  statusCode?: Maybe<Scalars['String']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateProductInput = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  imageYn?: InputMaybe<Scalars['Boolean']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateProductResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateProductResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled?: Maybe<Scalars['Boolean']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID'];
  imageYn?: Maybe<Scalars['Boolean']>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSatelliteInfoInput = {
  bandCount?: InputMaybe<Scalars['String']>;
  bitCount?: InputMaybe<Scalars['String']>;
  cloud?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  geogcs?: InputMaybe<Scalars['String']>;
  multigrayCode?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<JsonPropertyInput>;
  secureAreaYn?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  xPixel?: InputMaybe<Scalars['String']>;
  xResolution?: InputMaybe<Scalars['String']>;
  yPixel?: InputMaybe<Scalars['String']>;
  yResolution?: InputMaybe<Scalars['String']>;
};

export type UpdateSatelliteInfoResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateSatelliteInfoResponse';
  bandCount?: Maybe<Scalars['String']>;
  bitCount?: Maybe<Scalars['String']>;
  cloud?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled?: Maybe<Scalars['Boolean']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  geogcs?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  multigrayCode?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  secureAreaYn?: Maybe<Scalars['Boolean']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
  xPixel?: Maybe<Scalars['String']>;
  xResolution?: Maybe<Scalars['String']>;
  yPixel?: Maybe<Scalars['String']>;
  yResolution?: Maybe<Scalars['String']>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type UploadFile = {
  __typename?: 'UploadFile';
  contentSize: Scalars['Int'];
  contentType: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  download: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  properties?: Maybe<Scalars['JSON']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type UploadFileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  filename?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UploadFileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
};

export type UploadFilePageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<UploadFileSort>>;
};

export type UploadFilePaged = {
  __typename?: 'UploadFilePaged';
  items: Array<Maybe<UploadFile>>;
  pageInfo: PaginationInfo;
};

export enum UploadFileSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

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