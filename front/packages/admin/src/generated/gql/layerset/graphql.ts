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

/**
 * ##################################################################################
 * # Input
 * ##################################################################################
 */
export type AccessCriteria = {
  eq?: InputMaybe<LayerAccess>;
  in?: InputMaybe<Array<InputMaybe<LayerAccess>>>;
  ne?: InputMaybe<LayerAccess>;
};

export type AppendUserLayerInput = {
  assetId: Scalars['ID']['input'];
  groupId: Scalars['ID']['input'];
};

export type AssetFilterInput = {
  access?: InputMaybe<CommonCriteria>;
  and?: InputMaybe<Array<AssetFilterInput>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<SimpleCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  isRoot?: InputMaybe<BooleanCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<AssetFilterInput>;
  or?: InputMaybe<Array<AssetFilterInput>>;
};

export type AttributeStyleInput = {
  attribute?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  rules?: InputMaybe<Array<InputMaybe<RuleStyleInput>>>;
};

export enum AttributeType {
  Array = 'ARRAY',
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Geometry = 'GEOMETRY',
  Number = 'NUMBER',
  Object = 'OBJECT',
  Other = 'OTHER',
  String = 'STRING'
}

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

export type ChannelOptions = {
  gamma?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<ContrastMethod>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type Channels = {
  blue?: InputMaybe<ChannelOptions>;
  gray?: InputMaybe<ChannelOptions>;
  green?: InputMaybe<ChannelOptions>;
  red?: InputMaybe<ChannelOptions>;
};

export type ClassifiedAttribute = {
  __typename?: 'ClassifiedAttribute';
  rules?: Maybe<Array<Maybe<Rule>>>;
  type?: Maybe<AttributeType>;
};

export type CogInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
};

export type ColorMapEntry = {
  bandValue?: InputMaybe<Scalars['Float']['input']>;
  color?: InputMaybe<Scalars['String']['input']>;
  entryOpacity?: InputMaybe<Scalars['Float']['input']>;
  textLabel?: InputMaybe<Scalars['String']['input']>;
};

export enum ColorMapType {
  Intervals = 'INTERVALS',
  Ramp = 'RAMP',
  Values = 'VALUES'
}

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

export enum ContrastMethod {
  Histogram = 'HISTOGRAM',
  Normalize = 'NORMALIZE'
}

export type CoverageInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
  workspace?: Scalars['String']['input'];
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateAssetInput = {
  access?: LayerAccess;
  context: PublishContextValue;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  groupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
  type: LayerAssetType;
  visible?: Scalars['Boolean']['input'];
};

export type CreateAssetResponse = WithAuditable & WithJsonProperty & {
  __typename?: 'CreateAssetResponse';
  access?: Maybe<LayerAccess>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<LayerAssetStatus>;
  type?: Maybe<LayerAssetType>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  visible: Scalars['Boolean']['output'];
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateGroupInput = {
  access?: LayerAccess;
  collapsed?: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
  published?: Scalars['Boolean']['input'];
};

export type CreateGroupResponse = WithAuditable & {
  __typename?: 'CreateGroupResponse';
  access: LayerAccess;
  children?: Maybe<Array<Maybe<LayerGroup>>>;
  collapsed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<LayerGroup>;
  published: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * #################################################################################
 */
export type CreateLabelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLabelResponse = WithAuditable & {
  __typename?: 'CreateLabelResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * #################################################################################
 */
export type CreateStyleInput = {
  access?: LayerAccess;
  context: StyleContextValue;
  defaultStatus?: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  format?: LayerStyleFormat;
  name: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateStyleResponse = WithAuditable & {
  __typename?: 'CreateStyleResponse';
  access?: Maybe<LayerAccess>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  defaultStatus?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  format?: Maybe<LayerStyleFormat>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type CreateUserAssetInput = {
  assetId: Scalars['ID']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateUserGroupInput = {
  assets?: InputMaybe<Array<CreateUserAssetInput>>;
  children?: InputMaybe<Array<CreateUserGroupInput>>;
  collapsed?: InputMaybe<Scalars['Boolean']['input']>;
  groupId?: InputMaybe<Scalars['ID']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parent?: InputMaybe<CreateUserGroupInput>;
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

export type F4DInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
};

export type FeatureInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
  store?: Scalars['String']['input'];
  workspace?: Scalars['String']['input'];
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

export type GroupFilterInput = {
  access?: InputMaybe<CommonCriteria>;
  and?: InputMaybe<Array<GroupFilterInput>>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<GroupFilterInput>;
  or?: InputMaybe<Array<GroupFilterInput>>;
  parentId?: InputMaybe<SimpleCriteria>;
  userId?: InputMaybe<SimpleCriteria>;
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

export type LabelFilter = {
  and?: InputMaybe<Array<LabelFilter>>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<LabelFilter>;
  or?: InputMaybe<Array<LabelFilter>>;
  value?: InputMaybe<StringCriteria>;
};

export enum LayerAccess {
  Default = 'Default',
  Inherit = 'Inherit',
  Private = 'Private',
  Protected = 'Protected',
  Public = 'Public'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type LayerAsset = WithAuditable & WithJsonProperty & {
  __typename?: 'LayerAsset';
  access?: Maybe<LayerAccess>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  groups?: Maybe<Array<Maybe<LayerGroup>>>;
  id: Scalars['ID']['output'];
  logs?: Maybe<Array<Maybe<LayerAssetLog>>>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<LayerAssetStatus>;
  styles?: Maybe<Array<Maybe<LayerStyle>>>;
  type?: Maybe<LayerAssetType>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export enum LayerAssetCreateStatus {
  Done = 'DONE',
  Error = 'ERROR',
  Init = 'INIT',
  Ready = 'READY',
  Running = 'RUNNING'
}

/**
 * ##################################################################################
 * # Locate
 * ##################################################################################
 */
export type LayerAssetInfo = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type LayerAssetLog = WithAuditable & {
  __typename?: 'LayerAssetLog';
  assetId: Scalars['ID']['output'];
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  type: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # ENUM
 * ##################################################################################
 */
export enum LayerAssetStatus {
  Done = 'DONE',
  Error = 'ERROR',
  Init = 'INIT',
  Ready = 'READY',
  Running = 'RUNNING'
}

export enum LayerAssetType {
  Cog = 'COG',
  F4D = 'F4D',
  Geojson = 'GEOJSON',
  Layergroup = 'LAYERGROUP',
  Raster = 'RASTER',
  Smarttile = 'SMARTTILE',
  Tiles3D = 'TILES3D',
  Vector = 'VECTOR'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type LayerGroup = WithAuditable & {
  __typename?: 'LayerGroup';
  access: LayerAccess;
  assets: Array<LayerAsset>;
  children: Array<LayerGroup>;
  collapsed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<LayerGroup>;
  published: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type LayerLabel = {
  __typename?: 'LayerLabel';
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type LayerStyle = {
  __typename?: 'LayerStyle';
  access?: Maybe<LayerAccess>;
  context?: Maybe<Scalars['JSON']['output']>;
  defaultStatus?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  format?: Maybe<LayerStyleFormat>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export enum LayerStyleFormat {
  Geostyler = 'Geostyler',
  Json = 'JSON',
  Mapbox = 'Mapbox',
  Mapfile = 'Mapfile',
  Openlayers = 'Openlayers',
  Qml = 'QML',
  Sld = 'SLD'
}

export type LineStyleInput = {
  graphicFillStyle?: InputMaybe<PointStyleInput>;
  graphicStrokeStyle?: InputMaybe<PointStyleInput>;
  strokeColor?: InputMaybe<Scalars['String']['input']>;
  strokeDasharray?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  strokeDashoffset?: InputMaybe<Scalars['Float']['input']>;
  strokeLinecap?: InputMaybe<Linecap>;
  strokeLinejoin?: InputMaybe<Linejoin>;
  strokeOpacity?: InputMaybe<Scalars['Float']['input']>;
  strokeWidth?: InputMaybe<Scalars['Float']['input']>;
};

export enum Linecap {
  Butt = 'BUTT',
  Round = 'ROUND',
  Square = 'SQUARE'
}

export enum Linejoin {
  Bevel = 'BEVEL',
  Mitre = 'MITRE',
  Round = 'ROUND'
}

export type LocateAssetInput = {
  option: LocateOption;
  source: LayerAssetInfo;
  target: LayerAssetInfo;
};

export type LocateGroupInput = {
  option?: InputMaybe<LocateOption>;
  target?: InputMaybe<Scalars['ID']['input']>;
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
  appendUserLayer?: Maybe<Scalars['Boolean']['output']>;
  applyAssetRemoteStyle: Scalars['Boolean']['output'];
  applyAssetStyle: LayerAsset;
  /**  Asset */
  createAsset: CreateAssetResponse;
  /**  Group */
  createGroup: CreateGroupResponse;
  /**  Label */
  createLabel: CreateLabelResponse;
  /**  Style */
  createStyle: CreateStyleResponse;
  deleteAsset: Scalars['Boolean']['output'];
  deleteGroup: Scalars['Boolean']['output'];
  deleteLabel: Scalars['Boolean']['output'];
  deleteStyle: Scalars['Boolean']['output'];
  locateAsset: LayerAsset;
  locateGroup: LayerGroup;
  /**  RemoteAsset */
  reloadRemoteAsset: Scalars['Boolean']['output'];
  /**  User */
  saveUserLayer: Array<Maybe<UserLayerGroup>>;
  updateAsset: UpdateAssetResponse;
  updateGroup: UpdateGroupResponse;
  updateLabel: UpdateLabelResponse;
  updateStyle: UpdateStyleResponse;
};


export type MutationAppendUserLayerArgs = {
  input: AppendUserLayerInput;
};


export type MutationApplyAssetRemoteStyleArgs = {
  id: Scalars['ID']['input'];
  styleName: Scalars['String']['input'];
};


export type MutationApplyAssetStyleArgs = {
  id: Scalars['ID']['input'];
  styleId: Scalars['ID']['input'];
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


export type MutationCreateStyleArgs = {
  input: CreateStyleInput;
};


export type MutationDeleteAssetArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteGroupArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteLabelArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteStyleArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationLocateAssetArgs = {
  input: LocateAssetInput;
};


export type MutationLocateGroupArgs = {
  id: Scalars['ID']['input'];
  input: LocateGroupInput;
};


export type MutationReloadRemoteAssetArgs = {
  layerKey: Scalars['String']['input'];
};


export type MutationSaveUserLayerArgs = {
  input?: InputMaybe<Array<InputMaybe<CreateUserGroupInput>>>;
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


export type MutationUpdateStyleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateStyleInput;
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

export type PointStyleInput = {
  fillColor?: InputMaybe<Scalars['String']['input']>;
  fillOpacity?: InputMaybe<Scalars['Float']['input']>;
  rotation?: InputMaybe<Scalars['Float']['input']>;
  shape?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Float']['input']>;
  strokeColor?: InputMaybe<Scalars['String']['input']>;
  strokeDasharray?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  strokeDashoffset?: InputMaybe<Scalars['Float']['input']>;
  strokeLinecap?: InputMaybe<Linecap>;
  strokeLinejoin?: InputMaybe<Linejoin>;
  strokeOpacity?: InputMaybe<Scalars['Float']['input']>;
  strokeWidth?: InputMaybe<Scalars['Float']['input']>;
};

export type PolygonStyleInput = {
  fillColor?: InputMaybe<Scalars['String']['input']>;
  fillGraphic?: InputMaybe<PointStyleInput>;
  fillOpacity?: InputMaybe<Scalars['Float']['input']>;
  graphicFillStyle?: InputMaybe<PointStyleInput>;
  graphicStrokeStyle?: InputMaybe<PointStyleInput>;
  strokeColor?: InputMaybe<Scalars['String']['input']>;
  strokeDasharray?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  strokeDashoffset?: InputMaybe<Scalars['Float']['input']>;
  strokeLinecap?: InputMaybe<Linecap>;
  strokeLinejoin?: InputMaybe<Linejoin>;
  strokeOpacity?: InputMaybe<Scalars['Float']['input']>;
  strokeWidth?: InputMaybe<Scalars['Float']['input']>;
};

export type PublishContextValue = {
  cog?: InputMaybe<CogInput>;
  coverage?: InputMaybe<CoverageInput>;
  f4d?: InputMaybe<F4DInput>;
  feature?: InputMaybe<FeatureInput>;
  remote?: InputMaybe<RemoteInput>;
  remoteT3d?: InputMaybe<RemoteT3DInput>;
  smartTile?: InputMaybe<SmartTileInput>;
  t3d?: InputMaybe<T3DInput>;
};

export type Query = {
  __typename?: 'Query';
  asset: LayerAsset;
  /**  Asset */
  assets: Array<Maybe<LayerAsset>>;
  classifyAttribute: ClassifiedAttribute;
  group: LayerGroup;
  /**  Group */
  groups: Array<Maybe<LayerGroup>>;
  /**  Label */
  label: LayerLabel;
  /**  RemoteAsset */
  remote?: Maybe<Scalars['JSON']['output']>;
  remoteAssets: Array<Maybe<RemoteLayerAsset>>;
  remoteStyles: Array<Maybe<RemoteLayerStyle>>;
  /**  Style */
  style: LayerStyle;
  /**  Terrain */
  terrains: Array<Maybe<TerrainAsset>>;
  userAsset: UserLayerAsset;
  /**  UserLayerAsset */
  userAssets: Array<Maybe<UserLayerAsset>>;
  userGroup: UserLayerGroup;
  /**  UserLayerGroup */
  userGroups: Array<Maybe<UserLayerGroup>>;
};


export type QueryAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAssetsArgs = {
  filter?: InputMaybe<AssetFilterInput>;
};


export type QueryClassifyAttributeArgs = {
  attribute: Scalars['String']['input'];
  nativeName: Scalars['String']['input'];
};


export type QueryGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGroupsArgs = {
  filter?: InputMaybe<GroupFilterInput>;
};


export type QueryLabelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRemoteArgs = {
  href: Scalars['String']['input'];
};


export type QueryRemoteStylesArgs = {
  filter?: InputMaybe<RemoteStyleFilterInput>;
};


export type QueryStyleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAssetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserAssetsArgs = {
  filter?: InputMaybe<UserAssetFilterInput>;
};


export type QueryUserGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserGroupsArgs = {
  filter?: InputMaybe<UserGroupFilterInput>;
};

export type RasterStyleInput = {
  channels?: InputMaybe<Channels>;
  entries?: InputMaybe<Array<InputMaybe<ColorMapEntry>>>;
  gamma?: InputMaybe<Scalars['Float']['input']>;
  mode?: InputMaybe<ContrastMethod>;
  opacity?: InputMaybe<Scalars['Float']['input']>;
  type?: InputMaybe<ColorMapType>;
};

export type RemoteInput = {
  href: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type RemoteLayerAsset = {
  __typename?: 'RemoteLayerAsset';
  href?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type RemoteLayerStyle = {
  __typename?: 'RemoteLayerStyle';
  href: Scalars['String']['output'];
  name: Scalars['String']['output'];
  type: StyleType;
};

export type RemoteStyleFilterInput = {
  type?: InputMaybe<StyleType>;
};

export type RemoteT3DInput = {
  href: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type Rule = {
  __typename?: 'Rule';
  color?: Maybe<Scalars['String']['output']>;
  eq?: Maybe<Scalars['String']['output']>;
  max?: Maybe<Scalars['String']['output']>;
  min?: Maybe<Scalars['String']['output']>;
};

export type RuleInput = {
  eq?: InputMaybe<Scalars['String']['input']>;
  max?: InputMaybe<Scalars['String']['input']>;
  min?: InputMaybe<Scalars['String']['input']>;
};

export type RuleStyleInput = {
  rule?: InputMaybe<RuleInput>;
  style?: InputMaybe<PolygonStyleInput>;
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

export type SmartTileInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
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

export type StyleContextValue = {
  attribute?: InputMaybe<AttributeStyleInput>;
  line?: InputMaybe<LineStyleInput>;
  point?: InputMaybe<PointStyleInput>;
  polygon?: InputMaybe<PolygonStyleInput>;
  raster?: InputMaybe<RasterStyleInput>;
};

export type StyleFilter = {
  and?: InputMaybe<Array<StyleFilter>>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<StyleFilter>;
  or?: InputMaybe<Array<StyleFilter>>;
};

export enum StyleType {
  Line = 'LINE',
  Point = 'POINT',
  Polygon = 'POLYGON',
  Raster = 'RASTER',
  Unknown = 'UNKNOWN'
}

export type T3DInput = {
  dataAssetId?: InputMaybe<Scalars['ID']['input']>;
};

export type TerrainAsset = WithJsonProperty & {
  __typename?: 'TerrainAsset';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  selected?: Maybe<Scalars['Boolean']['output']>;
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
export type UpdateAssetInput = {
  access?: InputMaybe<LayerAccess>;
  context?: InputMaybe<PublishContextValue>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  groupIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  type?: InputMaybe<LayerAssetType>;
  visible?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateAssetResponse = WithAuditable & WithJsonProperty & {
  __typename?: 'UpdateAssetResponse';
  access?: Maybe<LayerAccess>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<LayerAssetStatus>;
  type?: Maybe<LayerAssetType>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateGroupInput = {
  access?: InputMaybe<LayerAccess>;
  collapsed?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateGroupResponse = WithAuditable & {
  __typename?: 'UpdateGroupResponse';
  access: LayerAccess;
  children?: Maybe<Array<Maybe<LayerGroup>>>;
  collapsed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<LayerGroup>;
  published: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateLabelInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLabelResponse = WithAuditable & {
  __typename?: 'UpdateLabelResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateStyleInput = {
  access?: InputMaybe<LayerAccess>;
  context?: InputMaybe<StyleContextValue>;
  defaultStatus?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  format?: InputMaybe<LayerStyleFormat>;
  name?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
};

export type UpdateStyleResponse = WithAuditable & {
  __typename?: 'UpdateStyleResponse';
  access?: Maybe<LayerAccess>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  defaultStatus?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  format?: Maybe<LayerStyleFormat>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

export type UserAssetFilterInput = {
  access?: InputMaybe<CommonCriteria>;
  and?: InputMaybe<Array<UserAssetFilterInput>>;
  enabled?: InputMaybe<BooleanCriteria>;
  groupId?: InputMaybe<SimpleCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  isRoot?: InputMaybe<BooleanCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<UserAssetFilterInput>;
  or?: InputMaybe<Array<UserAssetFilterInput>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type UserGroupFilterInput = {
  access?: InputMaybe<CommonCriteria>;
  and?: InputMaybe<Array<UserGroupFilterInput>>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<UserGroupFilterInput>;
  or?: InputMaybe<Array<UserGroupFilterInput>>;
  parentId?: InputMaybe<SimpleCriteria>;
};

export type UserLayerAsset = WithAuditable & WithJsonProperty & {
  __typename?: 'UserLayerAsset';
  access?: Maybe<LayerAccess>;
  assetId: Scalars['ID']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  logs?: Maybe<Array<Maybe<LayerAssetLog>>>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  type?: Maybe<LayerAssetType>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  visible?: Maybe<Scalars['Boolean']['output']>;
};

export type UserLayerGroup = WithAuditable & {
  __typename?: 'UserLayerGroup';
  access: LayerAccess;
  assets: Array<UserLayerAsset>;
  children: Array<UserLayerGroup>;
  collapsed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  groupId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<UserLayerGroup>;
  published: Scalars['Boolean']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
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

export type LayersetCreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type LayersetCreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupResponse', id: string } };

export type LayersetUpdateGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
}>;


export type LayersetUpdateGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename?: 'UpdateGroupResponse', id: string, name: string, description?: string | null, enabled: boolean, access: LayerAccess, published: boolean, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type LayersetDeleteGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LayersetDeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type LayersetLocateGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: LocateGroupInput;
}>;


export type LayersetLocateGroupMutation = { __typename?: 'Mutation', locateGroup: { __typename?: 'LayerGroup', id: string } };

export type LayersetCreateAssetMutationVariables = Exact<{
  input: CreateAssetInput;
}>;


export type LayersetCreateAssetMutation = { __typename?: 'Mutation', createAsset: { __typename?: 'CreateAssetResponse', id: string, name: string, description?: string | null, enabled: boolean, access?: LayerAccess | null, status?: LayerAssetStatus | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type LayersetUpdateAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAssetInput;
}>;


export type LayersetUpdateAssetMutation = { __typename?: 'Mutation', updateAsset: { __typename?: 'UpdateAssetResponse', id: string, name?: string | null, description?: string | null, order?: number | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, access?: LayerAccess | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type LayersetDeleteAssetMutationVariables = Exact<{
  ids: Scalars['ID']['input'];
}>;


export type LayersetDeleteAssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type LayersetLocateAssetMutationVariables = Exact<{
  input: LocateAssetInput;
}>;


export type LayersetLocateAssetMutation = { __typename?: 'Mutation', locateAsset: { __typename?: 'LayerAsset', id: string } };

export type LayersetReloadRemoteAssetMutationVariables = Exact<{
  layerKey: Scalars['String']['input'];
}>;


export type LayersetReloadRemoteAssetMutation = { __typename?: 'Mutation', reloadRemoteAsset: boolean };

export type Create_LayergroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type Create_LayergroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupResponse', id: string, name: string, description?: string | null, enabled: boolean, published: boolean, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type Update_LayergroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
}>;


export type Update_LayergroupMutation = { __typename?: 'Mutation', updateGroup: { __typename?: 'UpdateGroupResponse', id: string, name: string, description?: string | null, enabled: boolean, published: boolean, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type Delete_LayergroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type Delete_LayergroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type Create_LayerassetMutationVariables = Exact<{
  input: CreateAssetInput;
}>;


export type Create_LayerassetMutation = { __typename?: 'Mutation', createAsset: { __typename?: 'CreateAssetResponse', id: string, name: string } };

export type Update_LayerassetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAssetInput;
}>;


export type Update_LayerassetMutation = { __typename?: 'Mutation', updateAsset: { __typename?: 'UpdateAssetResponse', id: string, name?: string | null, description?: string | null, order?: number | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, access?: LayerAccess | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type Locate_GroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: LocateGroupInput;
}>;


export type Locate_GroupMutation = { __typename?: 'Mutation', locateGroup: { __typename?: 'LayerGroup', id: string } };

export type Locate_AssetMutationVariables = Exact<{
  input: LocateAssetInput;
}>;


export type Locate_AssetMutation = { __typename?: 'Mutation', locateAsset: { __typename?: 'LayerAsset', id: string } };

export type Delete_AssetMutationVariables = Exact<{
  ids: Scalars['ID']['input'];
}>;


export type Delete_AssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type Reload_Remote_AssetMutationVariables = Exact<{
  layerKey: Scalars['String']['input'];
}>;


export type Reload_Remote_AssetMutation = { __typename?: 'Mutation', reloadRemoteAsset: boolean };

export type CreateLayerGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type CreateLayerGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupResponse', id: string, name: string, description?: string | null, enabled: boolean, published: boolean, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type UpdateLayerGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateGroupInput;
}>;


export type UpdateLayerGroupMutation = { __typename?: 'Mutation', updateGroup: { __typename?: 'UpdateGroupResponse', id: string, name: string, description?: string | null, enabled: boolean, published: boolean, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type DeleteLayerGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLayerGroupMutation = { __typename?: 'Mutation', deleteGroup: boolean };

export type CreateLayerAssetMutationVariables = Exact<{
  input: CreateAssetInput;
}>;


export type CreateLayerAssetMutation = { __typename?: 'Mutation', createAsset: { __typename?: 'CreateAssetResponse', id: string, name: string } };

export type UpdateLayerAssetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAssetInput;
}>;


export type UpdateLayerAssetMutation = { __typename?: 'Mutation', updateAsset: { __typename?: 'UpdateAssetResponse', id: string, name?: string | null, description?: string | null, order?: number | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, access?: LayerAccess | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type LocateLayerGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: LocateGroupInput;
}>;


export type LocateLayerGroupMutation = { __typename?: 'Mutation', locateGroup: { __typename?: 'LayerGroup', id: string } };

export type LocateLayerAssetMutationVariables = Exact<{
  input: LocateAssetInput;
}>;


export type LocateLayerAssetMutation = { __typename?: 'Mutation', locateAsset: { __typename?: 'LayerAsset', id: string } };

export type DeleteLayerAssetMutationVariables = Exact<{
  ids: Scalars['ID']['input'];
}>;


export type DeleteLayerAssetMutation = { __typename?: 'Mutation', deleteAsset: boolean };

export type ReloadRemoteLayerAssetMutationVariables = Exact<{
  layerKey: Scalars['String']['input'];
}>;


export type ReloadRemoteLayerAssetMutation = { __typename?: 'Mutation', reloadRemoteAsset: boolean };

export type CreateLayerStyleMutationVariables = Exact<{
  input: CreateStyleInput;
}>;


export type CreateLayerStyleMutation = { __typename?: 'Mutation', createStyle: { __typename?: 'CreateStyleResponse', id: string, name: string } };

export type UpdateLayerStyleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateStyleInput;
}>;


export type UpdateLayerStyleMutation = { __typename?: 'Mutation', updateStyle: { __typename?: 'UpdateStyleResponse', id: string, name: string, format?: LayerStyleFormat | null, description?: string | null, enabled?: boolean | null, defaultStatus?: boolean | null, access?: LayerAccess | null, createdAt?: string | null, createdBy?: string | null, updatedAt?: string | null, updatedBy?: string | null } };

export type DeleteLayerStyleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLayerStyleMutation = { __typename?: 'Mutation', deleteStyle: boolean };

export type ApplyLayerStyleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  styleId: Scalars['ID']['input'];
}>;


export type ApplyLayerStyleMutation = { __typename?: 'Mutation', applyAssetStyle: { __typename?: 'LayerAsset', id: string, name?: string | null, styles?: Array<{ __typename?: 'LayerStyle', id?: string | null, name?: string | null } | null> | null } };

export type LayersetGroupListQueryVariables = Exact<{ [key: string]: never; }>;


export type LayersetGroupListQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'LayerGroup', id: string, name?: string | null, enabled: boolean, access: LayerAccess } | null> };

export type LayersetGroupBasicFragment = { __typename?: 'LayerGroup', id: string, name?: string | null, description?: string | null, enabled: boolean, access: LayerAccess, order?: number | null, collapsed: boolean, createdAt?: string | null, updatedAt?: string | null } & { ' $fragmentName'?: 'LayersetGroupBasicFragment' };

export type LayersetAssetBasicFragment = { __typename?: 'LayerAsset', id: string, name?: string | null, description?: string | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, access?: LayerAccess | null, status?: LayerAssetStatus | null, createdAt?: string | null, updatedAt?: string | null } & { ' $fragmentName'?: 'LayersetAssetBasicFragment' };

export type LayersetGroupListWithAssetQueryVariables = Exact<{ [key: string]: never; }>;


export type LayersetGroupListWithAssetQuery = { __typename?: 'Query', groups: Array<(
    { __typename?: 'LayerGroup', assets: Array<(
      { __typename?: 'LayerAsset' }
      & { ' $fragmentRefs'?: { 'LayersetAssetBasicFragment': LayersetAssetBasicFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'LayersetGroupBasicFragment': LayersetGroupBasicFragment } }
  ) | null> };

export type LayersetAssetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LayersetAssetQuery = { __typename?: 'Query', asset: (
    { __typename?: 'LayerAsset', properties?: any | null, groups?: Array<{ __typename?: 'LayerGroup', id: string, name?: string | null } | null> | null, logs?: Array<{ __typename?: 'LayerAssetLog', id: string, assetId: string, type: string, content: string, createdAt?: string | null, updatedAt?: string | null } | null> | null, styles?: Array<{ __typename?: 'LayerStyle', id?: string | null, name?: string | null, defaultStatus?: boolean | null, context?: any | null } | null> | null }
    & { ' $fragmentRefs'?: { 'LayersetAssetBasicFragment': LayersetAssetBasicFragment } }
  ) };

export type LayerGroupBasicFragment = { __typename?: 'LayerGroup', id: string, name?: string | null, description?: string | null, enabled: boolean, published: boolean, collapsed: boolean, access: LayerAccess, order?: number | null } & { ' $fragmentName'?: 'LayerGroupBasicFragment' };

export type LayerAssetBasicFragment = { __typename?: 'LayerAsset', id: string, name?: string | null, description?: string | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, order?: number | null, access?: LayerAccess | null, createdAt?: string | null, updatedAt?: string | null } & { ' $fragmentName'?: 'LayerAssetBasicFragment' };

export type LayerGroupsQueryVariables = Exact<{
  filter?: InputMaybe<GroupFilterInput>;
}>;


export type LayerGroupsQuery = { __typename?: 'Query', groups: Array<(
    { __typename?: 'LayerGroup', assets: Array<(
      { __typename?: 'LayerAsset', logs?: Array<{ __typename?: 'LayerAssetLog', id: string, assetId: string, type: string, content: string } | null> | null }
      & { ' $fragmentRefs'?: { 'LayerAssetBasicFragment': LayerAssetBasicFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'LayerGroupBasicFragment': LayerGroupBasicFragment } }
  ) | null> };

export type LayerAssetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LayerAssetQuery = { __typename?: 'Query', asset: { __typename?: 'LayerAsset', id: string, name?: string | null, description?: string | null, type?: LayerAssetType | null, enabled?: boolean | null, visible?: boolean | null, access?: LayerAccess | null, createdBy?: string | null, createdAt?: string | null, updatedBy?: string | null, updatedAt?: string | null, properties?: any | null } };

export type LayerGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LayerGroupQuery = { __typename?: 'Query', group: (
    { __typename?: 'LayerGroup', assets: Array<(
      { __typename?: 'LayerAsset', logs?: Array<{ __typename?: 'LayerAssetLog', id: string, assetId: string, type: string, content: string } | null> | null }
      & { ' $fragmentRefs'?: { 'LayerAssetBasicFragment': LayerAssetBasicFragment } }
    )> }
    & { ' $fragmentRefs'?: { 'LayerGroupBasicFragment': LayerGroupBasicFragment } }
  ) };

export type RemoteQueryVariables = Exact<{
  href: Scalars['String']['input'];
}>;


export type RemoteQuery = { __typename?: 'Query', remote?: any | null };

export type ClassifyAttributeQueryVariables = Exact<{
  nativeName: Scalars['String']['input'];
  attribute: Scalars['String']['input'];
}>;


export type ClassifyAttributeQuery = { __typename?: 'Query', classifyAttribute: { __typename?: 'ClassifiedAttribute', type?: AttributeType | null, rules?: Array<{ __typename?: 'Rule', min?: string | null, max?: string | null, eq?: string | null, color?: string | null } | null> | null } };

export const LayersetGroupBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LayersetGroupBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayersetGroupBasicFragment, unknown>;
export const LayersetAssetBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LayersetAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayersetAssetBasicFragment, unknown>;
export const LayerGroupBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerGroupBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]} as unknown as DocumentNode<LayerGroupBasicFragment, unknown>;
export const LayerAssetBasicFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayerAssetBasicFragment, unknown>;
export const LayersetCreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetCreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LayersetCreateGroupMutation, LayersetCreateGroupMutationVariables>;
export const LayersetUpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetUpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<LayersetUpdateGroupMutation, LayersetUpdateGroupMutationVariables>;
export const LayersetDeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetDeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"id"}}]}}]}]}}]} as unknown as DocumentNode<LayersetDeleteGroupMutation, LayersetDeleteGroupMutationVariables>;
export const LayersetLocateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetLocateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LayersetLocateGroupMutation, LayersetLocateGroupMutationVariables>;
export const LayersetCreateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetCreateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<LayersetCreateAssetMutation, LayersetCreateAssetMutationVariables>;
export const LayersetUpdateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetUpdateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<LayersetUpdateAssetMutation, LayersetUpdateAssetMutationVariables>;
export const LayersetDeleteAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetDeleteAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"ids"}}]}}]}]}}]} as unknown as DocumentNode<LayersetDeleteAssetMutation, LayersetDeleteAssetMutationVariables>;
export const LayersetLocateAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetLocateAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LayersetLocateAssetMutation, LayersetLocateAssetMutationVariables>;
export const LayersetReloadRemoteAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LayersetReloadRemoteAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reloadRemoteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"layerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}}}]}]}}]} as unknown as DocumentNode<LayersetReloadRemoteAssetMutation, LayersetReloadRemoteAssetMutationVariables>;
export const Create_LayergroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_LAYERGROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<Create_LayergroupMutation, Create_LayergroupMutationVariables>;
export const Update_LayergroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UPDATE_LAYERGROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<Update_LayergroupMutation, Update_LayergroupMutationVariables>;
export const Delete_LayergroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_LAYERGROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"id"}}]}}]}]}}]} as unknown as DocumentNode<Delete_LayergroupMutation, Delete_LayergroupMutationVariables>;
export const Create_LayerassetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CREATE_LAYERASSET"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<Create_LayerassetMutation, Create_LayerassetMutationVariables>;
export const Update_LayerassetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UPDATE_LAYERASSET"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<Update_LayerassetMutation, Update_LayerassetMutationVariables>;
export const Locate_GroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LOCATE_GROUP"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Locate_GroupMutation, Locate_GroupMutationVariables>;
export const Locate_AssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LOCATE_ASSET"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateAssetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<Locate_AssetMutation, Locate_AssetMutationVariables>;
export const Delete_AssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DELETE_ASSET"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"ids"}}]}}]}]}}]} as unknown as DocumentNode<Delete_AssetMutation, Delete_AssetMutationVariables>;
export const Reload_Remote_AssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RELOAD_REMOTE_ASSET"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reloadRemoteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"layerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}}}]}]}}]} as unknown as DocumentNode<Reload_Remote_AssetMutation, Reload_Remote_AssetMutationVariables>;
export const CreateLayerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLayerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<CreateLayerGroupMutation, CreateLayerGroupMutationVariables>;
export const UpdateLayerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLayerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<UpdateLayerGroupMutation, UpdateLayerGroupMutationVariables>;
export const DeleteLayerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLayerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"id"}}]}}]}]}}]} as unknown as DocumentNode<DeleteLayerGroupMutation, DeleteLayerGroupMutationVariables>;
export const CreateLayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLayerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateLayerAssetMutation, CreateLayerAssetMutationVariables>;
export const UpdateLayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLayerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<UpdateLayerAssetMutation, UpdateLayerAssetMutationVariables>;
export const LocateLayerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"locateLayerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateGroupInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LocateLayerGroupMutation, LocateLayerGroupMutationVariables>;
export const LocateLayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"locateLayerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LocateAssetInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"locateAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LocateLayerAssetMutation, LocateLayerAssetMutationVariables>;
export const DeleteLayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLayerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"ids"}}]}}]}]}}]} as unknown as DocumentNode<DeleteLayerAssetMutation, DeleteLayerAssetMutationVariables>;
export const ReloadRemoteLayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"reloadRemoteLayerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reloadRemoteAsset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"layerKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"layerKey"}}}]}]}}]} as unknown as DocumentNode<ReloadRemoteLayerAssetMutation, ReloadRemoteLayerAssetMutationVariables>;
export const CreateLayerStyleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createLayerStyle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStyleInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStyle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateLayerStyleMutation, CreateLayerStyleMutationVariables>;
export const UpdateLayerStyleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateLayerStyle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStyleInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStyle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"defaultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}}]}}]}}]} as unknown as DocumentNode<UpdateLayerStyleMutation, UpdateLayerStyleMutationVariables>;
export const DeleteLayerStyleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteLayerStyle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStyle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"ListValue","values":[{"kind":"Variable","name":{"kind":"Name","value":"id"}}]}}]}]}}]} as unknown as DocumentNode<DeleteLayerStyleMutation, DeleteLayerStyleMutationVariables>;
export const ApplyLayerStyleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"applyLayerStyle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"styleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyAssetStyle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"styleId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"styleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"styles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ApplyLayerStyleMutation, ApplyLayerStyleMutationVariables>;
export const LayersetGroupListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LayersetGroupList"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]}}]} as unknown as DocumentNode<LayersetGroupListQuery, LayersetGroupListQueryVariables>;
export const LayersetGroupListWithAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LayersetGroupListWithAsset"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LayersetGroupBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LayersetAssetBasic"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LayersetGroupBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LayersetAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayersetGroupListWithAssetQuery, LayersetGroupListWithAssetQueryVariables>;
export const LayersetAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LayersetAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"LayersetAssetBasic"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"styles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultStatus"}},{"kind":"Field","name":{"kind":"Name","value":"context"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LayersetAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayersetAssetQuery, LayersetAssetQueryVariables>;
export const LayerGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"layerGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GroupFilterInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"layerGroupBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"layerAssetBasic"}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerGroupBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayerGroupsQuery, LayerGroupsQueryVariables>;
export const LayerAssetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"layerAsset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"asset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}}]}}]}}]} as unknown as DocumentNode<LayerAssetQuery, LayerAssetQueryVariables>;
export const LayerGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"layerGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"group"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"layerGroupBasic"}},{"kind":"Field","name":{"kind":"Name","value":"assets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"layerAssetBasic"}},{"kind":"Field","name":{"kind":"Name","value":"logs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"assetId"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerGroupBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerGroup"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"layerAssetBasic"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LayerAsset"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"visible"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<LayerGroupQuery, LayerGroupQueryVariables>;
export const RemoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"remote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"href"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"remote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"href"},"value":{"kind":"Variable","name":{"kind":"Name","value":"href"}}}]}]}}]} as unknown as DocumentNode<RemoteQuery, RemoteQueryVariables>;
export const ClassifyAttributeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"classifyAttribute"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nativeName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"EnumValue","value":"layerset"}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classifyAttribute"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"nativeName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nativeName"}}},{"kind":"Argument","name":{"kind":"Name","value":"attribute"},"value":{"kind":"Variable","name":{"kind":"Name","value":"attribute"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"rules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"min"}},{"kind":"Field","name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"eq"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode<ClassifyAttributeQuery, ClassifyAttributeQueryVariables>;