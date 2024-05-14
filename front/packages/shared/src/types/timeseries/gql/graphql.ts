/* eslint-disable */
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
  /** An arbitrary precision signed decimal */
  BigDecimal: { input: any; output: any; }
  /** An arbitrary precision signed integer */
  BigInteger: { input: any; output: any; }
  /** An 8-bit signed integer */
  Byte: { input: any; output: any; }
  /** A UTF-16 code unit; a character on Unicode's BMP */
  Char: { input: any; output: any; }
  /** An RFC-3339 compliant Full Date Scalar */
  Date: { input: any; output: any; }
  /** A slightly refined version of RFC-3339 compliant DateTime Scalar */
  DateTime: { input: any; output: any; }
  /** A JSON scalar */
  JSON: { input: any; output: any; }
  /** A 64-bit signed integer */
  Long: { input: any; output: any; }
  /** A 16-bit signed integer */
  Short: { input: any; output: any; }
  /** An RFC-3339 compliant Full Time Scalar */
  Time: { input: any; output: any; }
  /** A universally unique identifier compliant UUID Scalar */
  UUID: { input: any; output: any; }
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Category = {
  __typename?: 'Category';
  children: Array<Category>;
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateCategoryInput = {
  code: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateCategoryResponse = {
  __typename?: 'CreateCategoryResponse';
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateProductInput = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  imageYn?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
  refDateId?: InputMaybe<Scalars['ID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  type: Scalars['String']['input'];
  uploadId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateProductResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateProductResponse';
  bbox?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  downloadThumbnail?: Maybe<Scalars['String']['output']>;
  downloadThumbnailTransparent?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  extension?: Maybe<Scalars['String']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  footprint?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  imageYn?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  size?: Maybe<Scalars['Long']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  type: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type CreateUploadFileResponse = {
  __typename?: 'CreateUploadFileResponse';
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  download: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type DownloadFile = {
  __typename?: 'DownloadFile';
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  count: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  expiredAt?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  product: Product;
  properties?: Maybe<Scalars['JSON']['output']>;
  status: DownloadStatus;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  areaName?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  digitalVer?: Maybe<Scalars['String']['output']>;
  doyeopKindCode?: Maybe<Scalars['String']['output']>;
  doyeopName?: Maybe<Scalars['String']['output']>;
  doyeopNum?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID']['output'];
  paperVer?: Maybe<Scalars['String']['output']>;
  printDate?: Maybe<Scalars['DateTime']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  scaleCode?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['String']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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

export type LocateCategoryInput = {
  option: LocateOption;
  target: Scalars['ID']['input'];
};

export enum LocateOption {
  After = 'AFTER',
  Before = 'BEFORE',
  FirstChild = 'FIRST_CHILD',
  LastChild = 'LAST_CHILD'
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

export type Mutation = {
  __typename?: 'Mutation';
  /**  Category */
  createCategory: CreateCategoryResponse;
  /**  Product */
  createProduct: CreateProductResponse;
  deleteCategory: Scalars['Boolean']['output'];
  deleteDoyeopInfo: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteSatelliteInfo: Scalars['Boolean']['output'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteUploadFile: Scalars['Boolean']['output'];
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
  id: Scalars['ID']['input'];
};


export type MutationDeleteDoyeopInfoArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteProductArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSatelliteInfoArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLocateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: LocateCategoryInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateDoyeopInfoArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<UpdateDoyeopInfoInput>;
};


export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<UpdateProductInput>;
};


export type MutationUpdateSatelliteInfoArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<UpdateSatelliteInfoInput>;
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Product = {
  __typename?: 'Product';
  bbox?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  date?: Maybe<Scalars['DateTime']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  downloadThumbnail?: Maybe<Scalars['String']['output']>;
  downloadThumbnailTransparent?: Maybe<Scalars['String']['output']>;
  doyeop?: Maybe<DoyeopInfo>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  extension?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  footprint?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  imageYn?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  satellite?: Maybe<SatelliteInfo>;
  size?: Maybe<Scalars['Long']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  type: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type ProductFilterInput = {
  and?: InputMaybe<Array<ProductFilterInput>>;
  boundaryCode?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<DateTimeCriteria>;
  month?: InputMaybe<IntCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<ProductFilterInput>;
  or?: InputMaybe<Array<ProductFilterInput>>;
  searchArea?: InputMaybe<Scalars['JSON']['input']>;
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  id: Scalars['ID']['input'];
};


export type QueryDownloadFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDownloadFilesArgs = {
  filter?: InputMaybe<DownloadFileFilterInput>;
  pageable?: InputMaybe<DownloadFilePageableInput>;
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProductsArgs = {
  filter: ProductFilterInput;
  pageable?: InputMaybe<ProductPageable>;
};


export type QueryUploadFileArgs = {
  id: Scalars['ID']['input'];
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
  acquisitionDate?: Maybe<Scalars['DateTime']['output']>;
  bandCount?: Maybe<Scalars['String']['output']>;
  bitCount?: Maybe<Scalars['String']['output']>;
  cloud?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  geogcs?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  multigrayCode?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  secureAreaYn?: Maybe<Scalars['Boolean']['output']>;
  sensor?: Maybe<Scalars['String']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  xPixel?: Maybe<Scalars['String']['output']>;
  xResolution?: Maybe<Scalars['String']['output']>;
  yPixel?: Maybe<Scalars['String']['output']>;
  yResolution?: Maybe<Scalars['String']['output']>;
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

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCategoryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCategoryResponse = {
  __typename?: 'UpdateCategoryResponse';
  code: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateDoyeopInfoInput = {
  areaName?: InputMaybe<Scalars['String']['input']>;
  countryCode?: InputMaybe<Scalars['String']['input']>;
  digitalVer?: InputMaybe<Scalars['String']['input']>;
  doyeopKindCode?: InputMaybe<Scalars['String']['input']>;
  doyeopName?: InputMaybe<Scalars['String']['input']>;
  doyeopNum?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  paperVer?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  scaleCode?: InputMaybe<Scalars['String']['input']>;
  statusCode?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateDoyeopInfoResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateDoyeopInfoResponse';
  areaName?: Maybe<Scalars['String']['output']>;
  countryCode?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  digitalVer?: Maybe<Scalars['String']['output']>;
  doyeopKindCode?: Maybe<Scalars['String']['output']>;
  doyeopName?: Maybe<Scalars['String']['output']>;
  doyeopNum?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID']['output'];
  paperVer?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  scaleCode?: Maybe<Scalars['String']['output']>;
  statusCode?: Maybe<Scalars['String']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateProductInput = {
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  imageYn?: InputMaybe<Scalars['Boolean']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateProductResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateProductResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  id: Scalars['ID']['output'];
  imageYn?: Maybe<Scalars['Boolean']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSatelliteInfoInput = {
  bandCount?: InputMaybe<Scalars['String']['input']>;
  bitCount?: InputMaybe<Scalars['String']['input']>;
  cloud?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<ProductFlag>>>;
  geogcs?: InputMaybe<Scalars['String']['input']>;
  multigrayCode?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  secureAreaYn?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  xPixel?: InputMaybe<Scalars['String']['input']>;
  xResolution?: InputMaybe<Scalars['String']['input']>;
  yPixel?: InputMaybe<Scalars['String']['input']>;
  yResolution?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSatelliteInfoResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateSatelliteInfoResponse';
  bandCount?: Maybe<Scalars['String']['output']>;
  bitCount?: Maybe<Scalars['String']['output']>;
  cloud?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  flags?: Maybe<Array<Maybe<ProductFlag>>>;
  geogcs?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  multigrayCode?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  secureAreaYn?: Maybe<Scalars['Boolean']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  xPixel?: Maybe<Scalars['String']['output']>;
  xResolution?: Maybe<Scalars['String']['output']>;
  yPixel?: Maybe<Scalars['String']['output']>;
  yResolution?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type UploadFile = {
  __typename?: 'UploadFile';
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  download: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
