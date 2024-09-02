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

export enum Access {
  Private = 'Private',
  Protected = 'Protected',
  Public = 'Public'
}

export type AccessCriteria = {
  eq?: InputMaybe<Access>;
  in?: InputMaybe<Array<InputMaybe<Access>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Access>;
  notIn?: InputMaybe<Array<InputMaybe<Access>>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Asset = {
  __typename?: 'Asset';
  access: Access;
  assetType: AssetType;
  convertedFiles?: Maybe<Array<Maybe<ConvertedFile>>>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  process?: Maybe<Process>;
  properties?: Maybe<Scalars['JSON']>;
  status?: Maybe<ProcessTaskStatus>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

export type AssetConnection = {
  __typename?: 'AssetConnection';
  edges: Array<AssetEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type AssetEdge = {
  __typename?: 'AssetEdge';
  cursor: Scalars['ID'];
  node?: Maybe<Asset>;
};

export type AssetFile = {
  __typename?: 'AssetFile';
  contentSize: Scalars['Int'];
  contentType: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  filepath?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type AssetFilterInput = {
  access?: InputMaybe<AccessCriteria>;
  and?: InputMaybe<Array<InputMaybe<AssetFilterInput>>>;
  assetType?: InputMaybe<AssetTypeCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<SimpleCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  groupId?: InputMaybe<SimpleCriteria>;
  groupName?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<AssetFilterInput>;
  or?: InputMaybe<Array<InputMaybe<AssetFilterInput>>>;
  status?: InputMaybe<ProcessTaskStatusCriteria>;
};

export type AssetPageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<AssetSort>>>;
};

export type AssetPaged = {
  __typename?: 'AssetPaged';
  items: Array<Maybe<Asset>>;
  pageInfo: PaginationInfo;
};

export enum AssetSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OrderAsc = 'ORDER_ASC',
  OrderDesc = 'ORDER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export enum AssetType {
  Cog = 'COG',
  Czml = 'CZML',
  GeoJson = 'GeoJSON',
  Imagery = 'Imagery',
  Kml = 'KML',
  Shp = 'SHP',
  Terrain = 'Terrain',
  Tiles3D = 'Tiles3D'
}

export type AssetTypeCriteria = {
  eq?: InputMaybe<AssetType>;
  in?: InputMaybe<Array<InputMaybe<AssetType>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<AssetType>;
  notIn?: InputMaybe<Array<InputMaybe<AssetType>>>;
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

export type CogConvertInput = {
  compress?: Scalars['String'];
  overviews?: Scalars['Boolean'];
  tiled?: Scalars['Boolean'];
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

export type ConvertedFile = {
  __typename?: 'ConvertedFile';
  contentSize: Scalars['Int'];
  contentType: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  filepath?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  taskId: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateAssetInput = {
  access?: Access;
  assetType: AssetType;
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<DataAssetFlag>>>;
  groupId?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name: Scalars['String'];
  properties?: InputMaybe<Scalars['JSON']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type CreateAssetResponse = {
  __typename?: 'CreateAssetResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateGroupInput = {
  access?: Access;
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<DataGroupFlag>>>;
  name: Scalars['String'];
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<Scalars['JSON']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateGroupResponse = {
  __typename?: 'CreateGroupResponse';
  access: Access;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
  properties?: Maybe<Scalars['JSON']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateLabelInput = {
  access?: Access;
  content?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  files?: InputMaybe<Array<Scalars['ID']>>;
  /**     groupId: ID! */
  name: Scalars['String'];
  properties?: InputMaybe<Scalars['JSON']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateLabelResponse = {
  __typename?: 'CreateLabelResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID'];
  /**     groupId: ID! */
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateProcessInput = {
  context: ProcessContextInput;
  name: Scalars['String'];
  properties?: InputMaybe<Scalars['JSON']>;
  source: ProcessSourceInput;
};

export type CreateProcessResponse = {
  __typename?: 'CreateProcessResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  status?: Maybe<ProcessTaskStatus>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreatePropInput = {
  name: Scalars['String'];
  uploadId: Array<Scalars['ID']>;
};

export type CreatePropResponse = WithAuditable & {
  __typename?: 'CreatePropResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  files: Array<PropFile>;
  id: Scalars['ID'];
  name: Scalars['String'];
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

export enum DataAssetFlag {
  Document = 'DOCUMENT',
  Image = 'IMAGE',
  Model = 'MODEL',
  Other = 'OTHER',
  Raster = 'RASTER',
  Vector = 'VECTOR',
  Video = 'VIDEO'
}

export enum DataGroupFlag {
  Aerial = 'AERIAL',
  Airforce = 'AIRFORCE',
  Army = 'ARMY',
  Basemap = 'BASEMAP',
  Dem = 'DEM',
  Marines = 'MARINES',
  Navy = 'NAVY',
  Satellite = 'SATELLITE',
  Terrain = 'TERRAIN'
}

export type DateCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
  eq?: InputMaybe<Scalars['Date']>;
  ge?: InputMaybe<Scalars['Date']>;
  gt?: InputMaybe<Scalars['Date']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']>>>;
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

/**  F4D */
export type F4DConvertInput = {
  indexing?: InputMaybe<Scalars['Boolean']>;
  meshType?: InputMaybe<Scalars['String']>;
  skinLevel?: InputMaybe<Scalars['Int']>;
  sourceCharset?: Scalars['String'];
  targetCharset?: Scalars['String'];
  upAxis?: InputMaybe<ProcessTaskF4DUpAxis>;
  usf?: InputMaybe<Scalars['Float']>;
};

export type FloatCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  max?: InputMaybe<FloatCriteria>;
  min?: InputMaybe<FloatCriteria>;
  ne?: InputMaybe<Scalars['Float']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Group = {
  __typename?: 'Group';
  access: Access;
  assets?: Maybe<Array<Maybe<Asset>>>;
  children: Array<Maybe<Group>>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parent?: Maybe<Group>;
  properties?: Maybe<Scalars['JSON']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

export type GroupConnection = {
  __typename?: 'GroupConnection';
  edges: Array<GroupEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type GroupEdge = {
  __typename?: 'GroupEdge';
  cursor: Scalars['ID'];
  node?: Maybe<Group>;
};

export type GroupFile = {
  __typename?: 'GroupFile';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GroupFilterInput = {
  access?: InputMaybe<AccessCriteria>;
  and?: InputMaybe<Array<GroupFilterInput>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<SimpleCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<GroupFilterInput>;
  onlyRoot?: InputMaybe<Scalars['Boolean']>;
  or?: InputMaybe<Array<GroupFilterInput>>;
  parentId?: InputMaybe<SimpleCriteria>;
};

export type GroupPageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<GroupSort>>>;
};

export type GroupPaged = {
  __typename?: 'GroupPaged';
  items: Array<Maybe<Group>>;
  pageInfo: PaginationInfo;
};

export enum GroupSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type IntCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  max?: InputMaybe<IntCriteria>;
  min?: InputMaybe<IntCriteria>;
  ne?: InputMaybe<Scalars['Int']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
};

export enum InterpolationType {
  Bilinear = 'BILINEAR',
  Nearest = 'NEAREST'
}

export type JsonPropertyInput = {
  /**  Using RFC6902 JSON Patch */
  merge?: InputMaybe<Scalars['JSON']>;
  patch?: InputMaybe<Array<JsonPropertyPatchInput>>;
};

export type JsonPropertyPatchInput = {
  from?: InputMaybe<Scalars['String']>;
  op: JsonPropertyPatchOp;
  path: Scalars['String'];
  value?: InputMaybe<Scalars['JSON']>;
};

/**
 * #################################################################
 * # JsonProperty
 * #################################################################
 */
export enum JsonPropertyPatchOp {
  Add = 'add',
  Copy = 'copy',
  Move = 'move',
  Remove = 'remove',
  Replace = 'replace'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Label = {
  __typename?: 'Label';
  access: Access;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID'];
  /**     boardId: ID! */
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
  viewCount: Scalars['Int'];
};

export type LabelConnection = {
  __typename?: 'LabelConnection';
  edges: Array<LabelEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type LabelEdge = {
  __typename?: 'LabelEdge';
  cursor: Scalars['ID'];
  node?: Maybe<Asset>;
};

export type LabelFilterInput = {
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
};

export type LabelPageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<LabelSort>>>;
};

export type LabelPaged = {
  __typename?: 'LabelPaged';
  items: Array<Maybe<Label>>;
  pageInfo: PaginationInfo;
};

export enum LabelSort {
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC'
}

/**
 * ##################################################################################
 * # Locate
 * ##################################################################################
 */
export type LayerAssetInfoSource = {
  groupId: Scalars['ID'];
  id: Scalars['ID'];
};

export type LayerAssetInfoTarget = {
  groupId: Scalars['ID'];
  id?: InputMaybe<Scalars['ID']>;
};

export type LocateAssetInput = {
  option?: InputMaybe<LocateOption>;
  source: LayerAssetInfoSource;
  target: LayerAssetInfoTarget;
};

export type LocateGroupInput = {
  option: LocateOption;
  target: Scalars['ID'];
};

/**
 * #################################################################
 * # SimpleTag
 * #################################################################
 */
export enum LocateOption {
  After = 'AFTER',
  Before = 'BEFORE',
  FirstChild = 'FIRST_CHILD',
  LastChild = 'LAST_CHILD'
}

export type Mutation = {
  __typename?: 'Mutation';
  appendAsset: Scalars['Boolean'];
  appendAssetFile: Scalars['Boolean'];
  /**  Asset */
  createAsset: CreateAssetResponse;
  /**  Group */
  createGroup: CreateGroupResponse;
  /**  Label */
  createLabel: CreateLabelResponse;
  /**  Process */
  createProcess: CreateProcessResponse;
  createProp: CreatePropResponse;
  deleteAsset: Scalars['Boolean'];
  deleteAssetFile: Scalars['Boolean'];
  deleteGroup: Scalars['Boolean'];
  deleteLabel: Scalars['Boolean'];
  deleteProp?: Maybe<Scalars['Boolean']>;
  /**  Upload */
  deleteUploadFile: Scalars['Boolean'];
  locateAsset: Asset;
  locateGroup: Group;
  replaceAsset: Scalars['Boolean'];
  updateAsset: UpdateAssetResponse;
  updateGroup: UpdateGroupResponse;
  updateLabel: UpdateLabelResponse;
  updateProcess: UpdateProcessResponse;
  updateProp: UpdatePropResponse;
};


export type MutationAppendAssetArgs = {
  assetId: Array<InputMaybe<Scalars['ID']>>;
  id: Scalars['ID'];
};


export type MutationAppendAssetFileArgs = {
  fileId: Array<InputMaybe<Scalars['ID']>>;
  id: Scalars['ID'];
};


export type MutationCreateAssetArgs = {
  input: CreateAssetInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateLabelArgs = {
  input: CreateLabelInput;
};


export type MutationCreateProcessArgs = {
  input: CreateProcessInput;
};


export type MutationCreatePropArgs = {
  input: CreatePropInput;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteAssetFileArgs = {
  fileId: Array<InputMaybe<Scalars['ID']>>;
  id: Scalars['ID'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLabelArgs = {
  id: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeletePropArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID'];
};


export type MutationLocateAssetArgs = {
  input: LocateAssetInput;
};


export type MutationLocateGroupArgs = {
  id: Scalars['ID'];
  input: LocateGroupInput;
};


export type MutationReplaceAssetArgs = {
  assetId: Array<InputMaybe<Scalars['ID']>>;
  id: Scalars['ID'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID'];
  input: UpdateAssetInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID'];
  input: UpdateGroupInput;
};


export type MutationUpdateLabelArgs = {
  id: Scalars['ID'];
  input: UpdateLabelInput;
};


export type MutationUpdateProcessArgs = {
  id: Scalars['ID'];
  input: UpdateProcessInput;
};


export type MutationUpdatePropArgs = {
  id: Scalars['ID'];
  input: UpdatePropInput;
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

export type Pageable = {
  page: Scalars['Int'];
  size: Scalars['Int'];
  sort?: Maybe<Array<Maybe<Scalars['ID']>>>;
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

export type Process = {
  __typename?: 'Process';
  context?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  status?: Maybe<ProcessTaskStatus>;
  tasks?: Maybe<Array<Maybe<ProcessTask>>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

export type ProcessConnection = {
  __typename?: 'ProcessConnection';
  edges: Array<GroupEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type ProcessContextInput = {
  cog?: InputMaybe<CogConvertInput>;
  f4d?: InputMaybe<F4DConvertInput>;
  ogr2ogr?: InputMaybe<ShpConvertInput>;
  smartTile?: InputMaybe<SmartTileConvertInput>;
  t3d?: InputMaybe<T3DConvertInput>;
  terrain?: InputMaybe<TerrainConvertInput>;
  warp?: InputMaybe<TiffConvertInput>;
};

export type ProcessEdge = {
  __typename?: 'ProcessEdge';
  cursor: Scalars['ID'];
  node?: Maybe<Process>;
};

export type ProcessFilterInput = {
  and?: InputMaybe<Array<ProcessFilterInput>>;
  assetId?: InputMaybe<SimpleCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<ProcessFilterInput>;
  or?: InputMaybe<Array<ProcessFilterInput>>;
};

export type ProcessPageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<ProcessSort>>>;
};

export type ProcessPaged = {
  __typename?: 'ProcessPaged';
  items: Array<Maybe<Process>>;
  pageInfo: PaginationInfo;
};

export enum ProcessSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

export type ProcessSourceInput = {
  assetId: Array<InputMaybe<Scalars['ID']>>;
};

export type ProcessTask = {
  __typename?: 'ProcessTask';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  error?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  stacktrace?: Maybe<Scalars['String']>;
  status?: Maybe<ProcessTaskStatus>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export enum ProcessTaskF4DUpAxis {
  Y = 'Y',
  Z = 'Z'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export enum ProcessTaskStatus {
  Done = 'Done',
  Error = 'Error',
  None = 'None',
  Ready = 'Ready',
  Running = 'Running',
  Terminated = 'Terminated',
  Terminating = 'Terminating'
}

export type ProcessTaskStatusCriteria = {
  eq?: InputMaybe<ProcessTaskStatus>;
  in?: InputMaybe<Array<InputMaybe<ProcessTaskStatus>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<ProcessTaskStatus>;
  notIn?: InputMaybe<Array<InputMaybe<ProcessTaskStatus>>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Prop = WithAuditable & {
  __typename?: 'Prop';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  files: Array<PropFile>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

export type PropCursored = {
  __typename?: 'PropCursored';
  content: Array<Prop>;
  hasNext?: Maybe<Scalars['Boolean']>;
  hasPrevious?: Maybe<Scalars['Boolean']>;
  number?: Maybe<Scalars['Long']>;
  size?: Maybe<Scalars['Int']>;
  totalElements?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type PropFile = WithAuditable & {
  __typename?: 'PropFile';
  contentSize?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  thumbnail?: Maybe<PropFileThumbnail>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
  width?: Maybe<Scalars['Int']>;
};

export type PropFileThumbnail = {
  __typename?: 'PropFileThumbnail';
  contentSize?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
};

export type PropFilterInput = {
  and?: InputMaybe<Array<InputMaybe<PropFilterInput>>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<SimpleCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<PropFilterInput>;
  or?: InputMaybe<Array<InputMaybe<PropFilterInput>>>;
};

export type PropPageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<PropsSort>>>;
};

export type PropPaged = {
  __typename?: 'PropPaged';
  items: Array<Maybe<Prop>>;
  pageInfo: PaginationInfo;
};

export enum PropsSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type Query = {
  __typename?: 'Query';
  /**  Asset */
  asset?: Maybe<Asset>;
  assets: AssetPaged;
  /**  Group */
  group?: Maybe<Group>;
  groups: GroupPaged;
  /**  Label */
  label?: Maybe<Label>;
  labels: LabelPaged;
  /**  Process */
  process?: Maybe<Process>;
  processes: ProcessPaged;
  prop?: Maybe<Prop>;
  props: PropCursored;
  propsPaged: PropPaged;
  /**  Upload */
  uploadFile?: Maybe<UploadFile>;
  uploadFiles: UploadFilePaged;
};


export type QueryAssetArgs = {
  id: Scalars['ID'];
};


export type QueryAssetsArgs = {
  filter?: InputMaybe<AssetFilterInput>;
  pageable?: InputMaybe<AssetPageableInput>;
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGroupsArgs = {
  filter?: InputMaybe<GroupFilterInput>;
  pageable?: InputMaybe<GroupPageableInput>;
};


export type QueryLabelArgs = {
  id: Scalars['ID'];
};


export type QueryLabelsArgs = {
  filter?: InputMaybe<LabelFilterInput>;
  pageable?: InputMaybe<LabelPageableInput>;
};


export type QueryProcessArgs = {
  id: Scalars['ID'];
};


export type QueryProcessesArgs = {
  filter?: InputMaybe<ProcessFilterInput>;
  pageable?: InputMaybe<ProcessPageableInput>;
};


export type QueryPropArgs = {
  id: Scalars['ID'];
};


export type QueryPropsArgs = {
  cursor?: InputMaybe<Scalars['Long']>;
  filter?: InputMaybe<PropFilterInput>;
  size?: Scalars['Int'];
};


export type QueryPropsPagedArgs = {
  filter?: InputMaybe<PropFilterInput>;
  pageable?: InputMaybe<PropPageableInput>;
};


export type QueryUploadFileArgs = {
  id: Scalars['ID'];
};


export type QueryUploadFilesArgs = {
  filter?: InputMaybe<UploadFileFilterInput>;
  pageable?: InputMaybe<UploadFilePageableInput>;
};

export type ShpConvertInput = {
  layerType?: Scalars['String'];
  output?: InputMaybe<ShpConvertOutputInput>;
  sourceCharset?: Scalars['String'];
  sourceSrs?: Scalars['String'];
  targetCharset?: Scalars['String'];
  targetSrs?: Scalars['String'];
};

export type ShpConvertOutputInput = {
  pgsql?: InputMaybe<ShpOutputPgsql>;
  test?: InputMaybe<ShpOutputPgsqlTest>;
};

export type ShpOutputPgsql = {
  database: Scalars['String'];
  host: Scalars['String'];
  password: Scalars['String'];
  port?: InputMaybe<Scalars['Int']>;
  schema?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type ShpOutputPgsqlTest = {
  database?: InputMaybe<Scalars['String']>;
  host?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  port?: InputMaybe<Scalars['Int']>;
  schema?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
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

export type SmartTileConvertInput = {
  charset?: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
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

/**  3DTiles */
export type T3DConvertInput = {
  absoluteAltitude?: InputMaybe<Scalars['Boolean']>;
  altitudeColumn?: InputMaybe<Scalars['String']>;
  autoUpAxis?: InputMaybe<Scalars['Boolean']>;
  crs?: InputMaybe<Scalars['String']>;
  flipCoordinate?: InputMaybe<Scalars['Boolean']>;
  heightColumn?: InputMaybe<Scalars['String']>;
  inputType: T3DFormatType;
  maxCount?: InputMaybe<Scalars['Int']>;
  maxLod?: InputMaybe<Scalars['Int']>;
  maxPoints?: InputMaybe<Scalars['Int']>;
  minLod?: InputMaybe<Scalars['Int']>;
  minimumHeight?: InputMaybe<Scalars['Float']>;
  nameColumn?: InputMaybe<Scalars['String']>;
  pngTexture?: InputMaybe<Scalars['Boolean']>;
  proj?: InputMaybe<Scalars['String']>;
  quiet?: Scalars['Boolean'];
  recursive?: Scalars['Boolean'];
  refineAdd?: InputMaybe<Scalars['Boolean']>;
  reverseTexCoord?: InputMaybe<Scalars['Boolean']>;
  yUpAxis?: InputMaybe<Scalars['Boolean']>;
  zeroOrigin?: InputMaybe<Scalars['Boolean']>;
};

export enum T3DFormatType {
  /**  OUTPUT Formats */
  B3Dm = 'B3DM',
  CityGml = 'CITY_GML',
  Collada = 'COLLADA',
  DirectX = 'DirectX',
  /**  3D Formats */
  Fbx = 'FBX',
  Geojson = 'GEOJSON',
  Glb = 'GLB',
  Gltf = 'GLTF',
  I3Dm = 'I3DM',
  Ifc = 'IFC',
  IndoorGml = 'INDOOR_GML',
  Json = 'JSON',
  Kml = 'KML',
  Las = 'LAS',
  Laz = 'LAZ',
  Lwo = 'LWO',
  Lws = 'LWS',
  Max_3Ds = 'MAX_3DS',
  MaxAse = 'MAX_ASE',
  Modo = 'MODO',
  Obj = 'OBJ',
  Pnts = 'PNTS',
  /**  2D Formats */
  Shp = 'SHP',
  Temp = 'TEMP'
}

/**  Terrain */
export type TerrainConvertInput = {
  calculateNormals?: InputMaybe<Scalars['Boolean']>;
  debug?: InputMaybe<Scalars['Boolean']>;
  help?: InputMaybe<Scalars['Boolean']>;
  interpolationType?: InputMaybe<InterpolationType>;
  maxDepth: Scalars['Int'];
  minDepth: Scalars['Int'];
  strength?: InputMaybe<Scalars['Float']>;
};

export type TiffConvertInput = {
  ot?: InputMaybe<Type>;
  sourceSrs?: Scalars['String'];
  targetSrs?: Scalars['String'];
};

export type TimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  eq?: InputMaybe<Scalars['Time']>;
  ge?: InputMaybe<Scalars['Time']>;
  gt?: InputMaybe<Scalars['Time']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  le?: InputMaybe<Scalars['Time']>;
  lt?: InputMaybe<Scalars['Time']>;
  max?: InputMaybe<TimeCriteria>;
  min?: InputMaybe<TimeCriteria>;
  ne?: InputMaybe<Scalars['Time']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Time']>>>;
};

export enum Type {
  Byte = 'Byte',
  CFloat32 = 'CFloat32',
  CFloat64 = 'CFloat64',
  CInt16 = 'CInt16',
  CInt32 = 'CInt32',
  Float32 = 'Float32',
  Float64 = 'Float64',
  Int8 = 'Int8',
  Int16 = 'Int16',
  Int32 = 'Int32',
  Int64 = 'Int64',
  UInt16 = 'UInt16',
  UInt32 = 'UInt32',
  UInt64 = 'UInt64'
}

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateAssetInput = {
  access?: InputMaybe<Access>;
  assetType?: InputMaybe<AssetType>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<DataAssetFlag>>>;
  groupId?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  name?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<JsonPropertyInput>;
  status?: InputMaybe<ProcessTaskStatus>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateAssetResponse = {
  __typename?: 'UpdateAssetResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
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
export type UpdateGroupInput = {
  access?: InputMaybe<Access>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<DataGroupFlag>>>;
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateGroupResponse = {
  __typename?: 'UpdateGroupResponse';
  access: Access;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parentId?: Maybe<Scalars['ID']>;
  properties?: Maybe<Scalars['JSON']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  viewCount: Scalars['Int'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateLabelInput = {
  access?: InputMaybe<Access>;
  assetType?: InputMaybe<AssetType>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  /**     groupId: ID */
  name?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateLabelResponse = {
  __typename?: 'UpdateLabelResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID'];
  /**     groupId: ID! */
  name: Scalars['String'];
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
export type UpdateProcessInput = {
  context?: InputMaybe<ProcessContextInput>;
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  properties?: InputMaybe<JsonPropertyInput>;
  source?: InputMaybe<ProcessSourceInput>;
};

export type UpdateProcessResponse = {
  __typename?: 'UpdateProcessResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSON']>;
  status?: Maybe<ProcessTaskStatus>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdatePropInput = {
  name?: InputMaybe<Scalars['String']>;
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdatePropResponse = WithAuditable & {
  __typename?: 'UpdatePropResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  files: Array<PropFile>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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
  createdBy: Scalars['ID'];
  createdByUser: User;
  download: Scalars['String'];
  filename: Scalars['String'];
  id: Scalars['ID'];
  properties?: Maybe<Scalars['JSON']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

export type UploadFileFilterInput = {
  and?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<SimpleCriteria>;
  filename?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UploadFileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
};

export type UploadFilePageableInput = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<InputMaybe<UploadFileSort>>>;
};

export type UploadFilePaged = {
  __typename?: 'UploadFilePaged';
  items: Array<Maybe<UploadFile>>;
  pageInfo: PaginationInfo;
};

export enum UploadFileSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC'
}

export type User = {
  __typename?: 'User';
  attributes?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  enabled: Scalars['Boolean'];
  firstname?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastname?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
};

export type WithAuditable = {
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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