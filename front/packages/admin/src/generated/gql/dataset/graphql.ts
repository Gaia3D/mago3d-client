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

export enum Access {
  Private = 'Private',
  Protected = 'Protected',
  Public = 'Public'
}

export type AccessCriteria = {
  eq?: InputMaybe<Access>;
  in?: InputMaybe<Array<InputMaybe<Access>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  process?: Maybe<Process>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<ProcessTaskStatus>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type AssetConnection = {
  __typename?: 'AssetConnection';
  edges: Array<AssetEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type AssetEdge = {
  __typename?: 'AssetEdge';
  cursor: Scalars['ID']['output'];
  node?: Maybe<Asset>;
};

export type AssetFile = {
  __typename?: 'AssetFile';
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  filepath?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<AssetType>;
  notIn?: InputMaybe<Array<InputMaybe<AssetType>>>;
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

export type CogConvertInput = {
  compress?: Scalars['String']['input'];
  overviews?: Scalars['Boolean']['input'];
  tiled?: Scalars['Boolean']['input'];
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

export type ConvertedFile = {
  __typename?: 'ConvertedFile';
  contentSize: Scalars['Int']['output'];
  contentType: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  filepath?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  taskId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateAssetInput = {
  access?: Access;
  assetType: AssetType;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<DataAssetFlag>>>;
  groupId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateAssetResponse = {
  __typename?: 'CreateAssetResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateGroupInput = {
  access?: Access;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<DataGroupFlag>>>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateGroupResponse = {
  __typename?: 'CreateGroupResponse';
  access: Access;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateLabelInput = {
  access?: Access;
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  files?: InputMaybe<Array<Scalars['ID']['input']>>;
  /**     groupId: ID! */
  name: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateLabelResponse = {
  __typename?: 'CreateLabelResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID']['output'];
  /**     groupId: ID! */
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateProcessInput = {
  context: ProcessContextInput;
  name: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
  source: ProcessSourceInput;
};

export type CreateProcessResponse = {
  __typename?: 'CreateProcessResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<ProcessTaskStatus>;
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
  between?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
  eq?: InputMaybe<Scalars['Date']['input']>;
  ge?: InputMaybe<Scalars['Date']['input']>;
  gt?: InputMaybe<Scalars['Date']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Date']['input']>>>;
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

/**  F4D */
export type F4DConvertInput = {
  indexing?: InputMaybe<Scalars['Boolean']['input']>;
  meshType?: InputMaybe<Scalars['String']['input']>;
  skinLevel?: InputMaybe<Scalars['Int']['input']>;
  sourceCharset?: Scalars['String']['input'];
  targetCharset?: Scalars['String']['input'];
  upAxis?: InputMaybe<ProcessTaskF4DUpAxis>;
  usf?: InputMaybe<Scalars['Float']['input']>;
};

export type FloatCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  max?: InputMaybe<FloatCriteria>;
  min?: InputMaybe<FloatCriteria>;
  ne?: InputMaybe<Scalars['Float']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
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
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Group>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type GroupConnection = {
  __typename?: 'GroupConnection';
  edges: Array<GroupEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type GroupEdge = {
  __typename?: 'GroupEdge';
  cursor: Scalars['ID']['output'];
  node?: Maybe<Group>;
};

export type GroupFile = {
  __typename?: 'GroupFile';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  onlyRoot?: InputMaybe<Scalars['Boolean']['input']>;
  or?: InputMaybe<Array<GroupFilterInput>>;
  parentId?: InputMaybe<SimpleCriteria>;
};

export type GroupPageableInput = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  max?: InputMaybe<IntCriteria>;
  min?: InputMaybe<IntCriteria>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export enum InterpolationType {
  Bilinear = 'BILINEAR',
  Nearest = 'NEAREST'
}

export type JsonPropertyInput = {
  /**  Using RFC6902 JSON Patch */
  merge?: InputMaybe<Scalars['JSON']['input']>;
  patch?: InputMaybe<Array<JsonPropertyPatchInput>>;
};

export type JsonPropertyPatchInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  op: JsonPropertyPatchOp;
  path: Scalars['String']['input'];
  value?: InputMaybe<Scalars['JSON']['input']>;
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
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID']['output'];
  /**     boardId: ID! */
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  viewCount: Scalars['Int']['output'];
};

export type LabelConnection = {
  __typename?: 'LabelConnection';
  edges: Array<LabelEdge>;
  pageInfo?: Maybe<PageInfo>;
};

export type LabelEdge = {
  __typename?: 'LabelEdge';
  cursor: Scalars['ID']['output'];
  node?: Maybe<Asset>;
};

export type LabelFilterInput = {
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
};

export type LabelPageableInput = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  groupId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type LayerAssetInfoTarget = {
  groupId: Scalars['ID']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type LocateAssetInput = {
  option?: InputMaybe<LocateOption>;
  source: LayerAssetInfoSource;
  target: LayerAssetInfoTarget;
};

export type LocateGroupInput = {
  option: LocateOption;
  target: Scalars['ID']['input'];
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
  appendAsset: Scalars['Boolean']['output'];
  appendAssetFile: Scalars['Boolean']['output'];
  /**  Asset */
  createAsset: CreateAssetResponse;
  /**  Group */
  createGroup: CreateGroupResponse;
  /**  Label */
  createLabel: CreateLabelResponse;
  /**  Process */
  createProcess: CreateProcessResponse;
  deleteAsset: Scalars['Boolean']['output'];
  deleteAssetFile: Scalars['Boolean']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deleteLabel: Scalars['Boolean']['output'];
  /**  Upload */
  deleteUploadFile: Scalars['Boolean']['output'];
  locateAsset: Asset;
  locateGroup: Group;
  replaceAsset: Scalars['Boolean']['output'];
  updateAsset: UpdateAssetResponse;
  updateGroup: UpdateGroupResponse;
  updateLabel: UpdateLabelResponse;
  updateProcess: UpdateProcessResponse;
};


export type MutationAppendAssetArgs = {
  assetId: Array<InputMaybe<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
};


export type MutationAppendAssetFileArgs = {
  fileId: Array<InputMaybe<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
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


export type MutationDeleteAssetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteAssetFileArgs = {
  fileId: Array<InputMaybe<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLabelArgs = {
  id: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationDeleteUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLocateAssetArgs = {
  input: LocateAssetInput;
};


export type MutationLocateGroupArgs = {
  id: Scalars['ID']['input'];
  input: LocateGroupInput;
};


export type MutationReplaceAssetArgs = {
  assetId: Array<InputMaybe<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAssetInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
};


export type MutationUpdateLabelArgs = {
  id: Scalars['ID']['input'];
  input: UpdateLabelInput;
};


export type MutationUpdateProcessArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProcessInput;
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

export type Pageable = {
  page: Scalars['Int']['output'];
  size: Scalars['Int']['output'];
  sort?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
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

export type Process = {
  __typename?: 'Process';
  context?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<ProcessTaskStatus>;
  tasks?: Maybe<Array<Maybe<ProcessTask>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
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
  cursor: Scalars['ID']['output'];
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  assetId: Array<InputMaybe<Scalars['ID']['input']>>;
};

export type ProcessTask = {
  __typename?: 'ProcessTask';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  stacktrace?: Maybe<Scalars['String']['output']>;
  status?: Maybe<ProcessTaskStatus>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<ProcessTaskStatus>;
  notIn?: InputMaybe<Array<InputMaybe<ProcessTaskStatus>>>;
};

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
  /**  Upload */
  uploadFile?: Maybe<UploadFile>;
  uploadFiles: UploadFilePaged;
};


export type QueryAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetsArgs = {
  filter?: InputMaybe<AssetFilterInput>;
  pageable?: InputMaybe<AssetPageableInput>;
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupsArgs = {
  filter?: InputMaybe<GroupFilterInput>;
  pageable?: InputMaybe<GroupPageableInput>;
};


export type QueryLabelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLabelsArgs = {
  filter?: InputMaybe<LabelFilterInput>;
  pageable?: InputMaybe<LabelPageableInput>;
};


export type QueryProcessArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProcessesArgs = {
  filter?: InputMaybe<ProcessFilterInput>;
  pageable?: InputMaybe<ProcessPageableInput>;
};


export type QueryUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUploadFilesArgs = {
  filter?: InputMaybe<UploadFileFilterInput>;
  pageable?: InputMaybe<UploadFilePageableInput>;
};

export type ShpConvertInput = {
  layerType?: Scalars['String']['input'];
  output?: InputMaybe<ShpConvertOutputInput>;
  sourceCharset?: Scalars['String']['input'];
  sourceSrs?: Scalars['String']['input'];
  targetCharset?: Scalars['String']['input'];
  targetSrs?: Scalars['String']['input'];
};

export type ShpConvertOutputInput = {
  pgsql?: InputMaybe<ShpOutputPgsql>;
  test?: InputMaybe<ShpOutputPgsqlTest>;
};

export type ShpOutputPgsql = {
  database: Scalars['String']['input'];
  host: Scalars['String']['input'];
  password: Scalars['String']['input'];
  port?: InputMaybe<Scalars['Int']['input']>;
  schema?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type ShpOutputPgsqlTest = {
  database?: InputMaybe<Scalars['String']['input']>;
  host?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  port?: InputMaybe<Scalars['Int']['input']>;
  schema?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
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

export type SmartTileConvertInput = {
  charset?: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
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

/**  3DTiles */
export type T3DConvertInput = {
  absoluteAltitude?: InputMaybe<Scalars['Boolean']['input']>;
  altitudeColumn?: InputMaybe<Scalars['String']['input']>;
  autoUpAxis?: InputMaybe<Scalars['Boolean']['input']>;
  crs?: InputMaybe<Scalars['String']['input']>;
  flipCoordinate?: InputMaybe<Scalars['Boolean']['input']>;
  heightColumn?: InputMaybe<Scalars['String']['input']>;
  inputType: T3DFormatType;
  maxCount?: InputMaybe<Scalars['Int']['input']>;
  maxLod?: InputMaybe<Scalars['Int']['input']>;
  maxPoints?: InputMaybe<Scalars['Int']['input']>;
  minLod?: InputMaybe<Scalars['Int']['input']>;
  minimumHeight?: InputMaybe<Scalars['Float']['input']>;
  nameColumn?: InputMaybe<Scalars['String']['input']>;
  pngTexture?: InputMaybe<Scalars['Boolean']['input']>;
  proj?: InputMaybe<Scalars['String']['input']>;
  quiet?: Scalars['Boolean']['input'];
  recursive?: Scalars['Boolean']['input'];
  refineAdd?: InputMaybe<Scalars['Boolean']['input']>;
  reverseTexCoord?: InputMaybe<Scalars['Boolean']['input']>;
  yUpAxis?: InputMaybe<Scalars['Boolean']['input']>;
  zeroOrigin?: InputMaybe<Scalars['Boolean']['input']>;
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
  calculateNormals?: InputMaybe<Scalars['Boolean']['input']>;
  debug?: InputMaybe<Scalars['Boolean']['input']>;
  help?: InputMaybe<Scalars['Boolean']['input']>;
  interpolationType?: InputMaybe<InterpolationType>;
  maxDepth: Scalars['Int']['input'];
  minDepth: Scalars['Int']['input'];
  strength?: InputMaybe<Scalars['Float']['input']>;
};

export type TiffConvertInput = {
  ot?: InputMaybe<Type>;
  sourceSrs?: Scalars['String']['input'];
  targetSrs?: Scalars['String']['input'];
};

export type TimeCriteria = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  eq?: InputMaybe<Scalars['Time']['input']>;
  ge?: InputMaybe<Scalars['Time']['input']>;
  gt?: InputMaybe<Scalars['Time']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  le?: InputMaybe<Scalars['Time']['input']>;
  lt?: InputMaybe<Scalars['Time']['input']>;
  max?: InputMaybe<TimeCriteria>;
  min?: InputMaybe<TimeCriteria>;
  ne?: InputMaybe<Scalars['Time']['input']>;
  notBetween?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Time']['input']>>>;
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
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<DataAssetFlag>>>;
  groupId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  status?: InputMaybe<ProcessTaskStatus>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateAssetResponse = {
  __typename?: 'UpdateAssetResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  flags?: Maybe<Array<Maybe<DataAssetFlag>>>;
  groups?: Maybe<Array<Maybe<Group>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
export type UpdateGroupInput = {
  access?: InputMaybe<Access>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<DataGroupFlag>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateGroupResponse = {
  __typename?: 'UpdateGroupResponse';
  access: Access;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<DataGroupFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['ID']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags?: Maybe<Array<Maybe<SimpleTagValue>>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  viewCount: Scalars['Int']['output'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateLabelInput = {
  access?: InputMaybe<Access>;
  assetType?: InputMaybe<AssetType>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  /**     groupId: ID */
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateLabelResponse = {
  __typename?: 'UpdateLabelResponse';
  access: Access;
  assetType: AssetType;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<AssetFile>>;
  id: Scalars['ID']['output'];
  /**     groupId: ID! */
  name: Scalars['String']['output'];
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
export type UpdateProcessInput = {
  context?: InputMaybe<ProcessContextInput>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  source?: InputMaybe<ProcessSourceInput>;
};

export type UpdateProcessResponse = {
  __typename?: 'UpdateProcessResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<ProcessTaskStatus>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  download: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
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
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
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
  attributes?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  enabled: Scalars['Boolean']['output'];
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type WithAuditable = {
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type WithSimpleTags = {
  tags: Array<Maybe<SimpleTagValue>>;
};

export type DatasetCreateProcessMutationVariables = Exact<{
  input: CreateProcessInput;
}>;


export type DatasetCreateProcessMutation = { __typename?: 'Mutation', createProcess: { __typename?: 'CreateProcessResponse', id: string, status?: ProcessTaskStatus | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type DatasetCreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type DatasetCreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupResponse', id: string, parentId?: string | null, name: string, description?: string | null, createdAt?: string | null, createdBy?: string | null, enabled: boolean, updatedAt?: string | null, updatedBy?: string | null } };

export type DatasetUpdateGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
}>;


export type DatasetUpdateGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename?: 'UpdateGroupResponse', id: string } };

export type DatasetDeleteGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetDeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type DatasetCreateAssetMutationVariables = Exact<{
  input: CreateAssetInput;
}>;


export type DatasetCreateAssetMutation = { __typename?: 'Mutation', createAsset: { __typename?: 'CreateAssetResponse', id: string } };

export type DatasetUpdateAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAssetInput;
}>;


export type DatasetUpdateAssetMutation = { __typename?: 'Mutation', updateAsset: { __typename?: 'UpdateAssetResponse', id: string, name: string } };

export type DatasetDeleteAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetDeleteAssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type DatasetDeleteAssetFileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  fileId: Array<InputMaybe<Scalars['ID']['input']>> | InputMaybe<Scalars['ID']['input']>;
}>;


export type DatasetDeleteAssetFileMutation = { __typename?: 'Mutation', deleteAssetFile: boolean };

export type DatasetAssetFileFragment = { __typename?: 'AssetFile', id: string, filename: string, contentSize: number, contentType: string } & { ' $fragmentName'?: 'DatasetAssetFileFragment' };

export type DatasetGroupListQueryVariables = Exact<{ [key: string]: never; }>;


export type DatasetGroupListQuery = { __typename?: 'Query', groups: { __typename?: 'GroupPaged', items: Array<{ __typename?: 'Group', id: string, name: string } | null> } };

export type DatasetGroupListForUpdateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetGroupListForUpdateQuery = { __typename?: 'Query', group?: { __typename?: 'Group', id: string, name: string, description?: string | null, assets?: Array<{ __typename?: 'Asset', id: string, name: string, assetType: AssetType, createdAt?: string | null } | null> | null } | null };

export type DatasetAssetListQueryVariables = Exact<{
  filter?: InputMaybe<AssetFilterInput>;
  pageable?: InputMaybe<AssetPageableInput>;
}>;


export type DatasetAssetListQuery = { __typename?: 'Query', assets: { __typename?: 'AssetPaged', items: Array<{ __typename?: 'Asset', id: string, name: string, assetType: AssetType, status?: ProcessTaskStatus | null, createdAt?: string | null, updatedAt?: string | null } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, page: number, size: number } } };

export type DatasetAssetForDetailQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetAssetForDetailQuery = { __typename?: 'Query', asset?: { __typename?: 'Asset', id: string, name: string, description?: string | null, assetType: AssetType, properties?: any | null, groups?: Array<{ __typename?: 'Group', id: string, name: string } | null> | null, files: Array<(
      { __typename?: 'AssetFile', id: string }
      & { ' $fragmentRefs'?: { 'DatasetAssetFileFragment': DatasetAssetFileFragment } }
    ) | null>, process?: { __typename?: 'Process', id: string, status?: ProcessTaskStatus | null } | null } | null };

export type DatasetAssetForUpdateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetAssetForUpdateQuery = { __typename?: 'Query', asset?: { __typename?: 'Asset', id: string, name: string, description?: string | null, assetType: AssetType, properties?: any | null, groups?: Array<{ __typename?: 'Group', id: string, name: string } | null> | null, files: Array<{ __typename?: 'AssetFile', id: string, filename: string, createdAt?: string | null } | null> } | null, groups: { __typename?: 'GroupPaged', items: Array<{ __typename?: 'Group', id: string, name: string } | null> } };

export type DatasetAssetForLayerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetAssetForLayerQuery = { __typename?: 'Query', asset?: { __typename?: 'Asset', id: string, name: string, description?: string | null, assetType: AssetType, createdAt?: string | null, createdBy: string, enabled: boolean, updatedAt?: string | null, updatedBy: string, files: Array<{ __typename?: 'AssetFile', id: string, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } | null> } | null };

export type DatasetProcessLogQueryVariables = Exact<{
  assetId: Scalars['ID']['input'];
}>;


export type DatasetProcessLogQuery = { __typename?: 'Query', processes: { __typename?: 'ProcessPaged', items: Array<{ __typename?: 'Process', id: string, name?: string | null, status?: ProcessTaskStatus | null, createdAt?: string | null, tasks?: Array<{ __typename?: 'ProcessTask', id: string, error?: string | null, stacktrace?: string | null } | null> | null } | null>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, page: number, size: number } } };

export type DatasetProcessQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DatasetProcessQuery = { __typename?: 'Query', process?: { __typename?: 'Process', id: string, name?: string | null, status?: ProcessTaskStatus | null, context?: any | null, createdBy: string, createdAt?: string | null, updatedBy: string, updatedAt?: string | null, properties?: any | null, tasks?: Array<{ __typename?: 'ProcessTask', id: string, status?: ProcessTaskStatus | null, stacktrace?: string | null, error?: string | null } | null> | null } | null };

export const DatasetAssetFileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetAssetFile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"contentSize"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}}]}}]} as unknown as DocumentNode<DatasetAssetFileFragment, unknown>;
export const DatasetCreateProcessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetCreateProcess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProcessInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createProcess"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<DatasetCreateProcessMutation, DatasetCreateProcessMutationVariables>;
export const DatasetCreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetCreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<DatasetCreateGroupMutation, DatasetCreateGroupMutationVariables>;
export const DatasetUpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetUpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DatasetUpdateGroupMutation, DatasetUpdateGroupMutationVariables>;
export const DatasetDeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetDeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DatasetDeleteGroupMutation, DatasetDeleteGroupMutationVariables>;
export const DatasetCreateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetCreateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DatasetCreateAssetMutation, DatasetCreateAssetMutationVariables>;
export const DatasetUpdateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetUpdateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DatasetUpdateAssetMutation, DatasetUpdateAssetMutationVariables>;
export const DatasetDeleteAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetDeleteAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DatasetDeleteAssetMutation, DatasetDeleteAssetMutationVariables>;
export const DatasetDeleteAssetFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DatasetDeleteAssetFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAssetFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"fileId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fileId"}}}]}]}}]} as unknown as DocumentNode<DatasetDeleteAssetFileMutation, DatasetDeleteAssetFileMutationVariables>;
export const DatasetGroupListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetGroupList"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"enabled"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"BooleanValue","value":true}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"pageable"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"0"}},{"kind":"ObjectField","name":{"kind":"Name","value":"size"},"value":{"kind":"IntValue","value":"1000"}},{"kind":"ObjectField","name":{"kind":"Name","value":"sort"},"value":{"kind":"EnumValue","value":"CREATED_AT_DESC"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetGroupListQuery, DatasetGroupListQueryVariables>;
export const DatasetGroupListForUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetGroupListForUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetGroupListForUpdateQuery, DatasetGroupListForUpdateQueryVariables>;
export const DatasetAssetListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetAssetList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssetFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AssetPageableInput"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetAssetListQuery, DatasetAssetListQueryVariables>;
export const DatasetAssetForDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetAssetForDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DatasetAssetFile"}}]}},{"kind":"Field","name":{"kind":"Name","value":"process"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DatasetAssetFile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AssetFile"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"contentSize"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}}]}}]} as unknown as DocumentNode<DatasetAssetForDetailQuery, DatasetAssetForDetailQueryVariables>;
export const DatasetAssetForUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetAssetForUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetAssetForUpdateQuery, DatasetAssetForUpdateQueryVariables>;
export const DatasetAssetForLayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetAssetForLayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assetType"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetAssetForLayerQuery, DatasetAssetForLayerQueryVariables>;
export const DatasetProcessLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetProcessLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"processes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"assetId"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assetId"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"stacktrace"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}}]}}]}}]}}]} as unknown as DocumentNode<DatasetProcessLogQuery, DatasetProcessLogQueryVariables>;
export const DatasetProcessDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DatasetProcess"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"dataset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"process"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"context"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"stacktrace"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}}]}}]}}]} as unknown as DocumentNode<DatasetProcessQuery, DatasetProcessQueryVariables>;