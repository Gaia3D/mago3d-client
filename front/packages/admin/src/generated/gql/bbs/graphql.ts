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
 * # Query
 * ##################################################################################
 */
export type Article = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Article';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']['output']>;
  answered: Scalars['Boolean']['output'];
  board: Board;
  comments?: Maybe<Array<Maybe<Comment>>>;
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  enabled: Scalars['Boolean']['output'];
  files?: Maybe<Array<Maybe<ArticleFile>>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID']['output'];
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
  viewCount: Scalars['Int']['output'];
  writer?: Maybe<Scalars['String']['output']>;
};

export type ArticleCursored = {
  __typename?: 'ArticleCursored';
  content: Array<Article>;
  hasNext?: Maybe<Scalars['Boolean']['output']>;
  hasPrevious?: Maybe<Scalars['Boolean']['output']>;
  number?: Maybe<Scalars['Long']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  totalElements?: Maybe<Scalars['Int']['output']>;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type ArticleFile = WithAuditable & {
  __typename?: 'ArticleFile';
  contentSize?: Maybe<Scalars['Long']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type ArticleFilterInput = {
  access?: InputMaybe<BbsAccessCriteria>;
  and?: InputMaybe<Array<ArticleFilterInput>>;
  answered?: InputMaybe<Scalars['Boolean']['input']>;
  boardId?: InputMaybe<SimpleCriteria>;
  content?: InputMaybe<StringCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<ArticleFilterInput>;
  or?: InputMaybe<Array<ArticleFilterInput>>;
};

export enum ArticleFlag {
  Flag1 = 'FLAG1',
  Flag2 = 'FLAG2',
  Flag3 = 'FLAG3'
}

export type ArticleLockedInput = {
  locked: Scalars['Boolean']['input'];
  password: Scalars['String']['input'];
  writer: Scalars['String']['input'];
};

export type ArticlePageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<ArticleSort>>;
};

export type ArticlePaged = {
  __typename?: 'ArticlePaged';
  items: Array<Article>;
  pageInfo: PaginationInfo;
};

export type ArticlePinnedInput = {
  from?: InputMaybe<Scalars['DateTime']['input']>;
  pinned: Scalars['Boolean']['input'];
  to?: InputMaybe<Scalars['DateTime']['input']>;
};

export enum ArticleSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/**
 * ##################################################################################
 * # ENUM
 * ##################################################################################
 */
export enum BbsAccess {
  /**  member modifiable */
  AnonymousAccessible = 'ANONYMOUS_ACCESSIBLE',
  /**  anonymous accessible */
  AnonymousModifiable = 'ANONYMOUS_MODIFIABLE',
  Default = 'DEFAULT',
  /**  default */
  MemberAccessible = 'MEMBER_ACCESSIBLE',
  /**  member accessible */
  MemberModifiable = 'MEMBER_MODIFIABLE'
}

/**
 * ##################################################################################
 * # Input
 * ##################################################################################
 */
export type BbsAccessCriteria = {
  between?: InputMaybe<Array<InputMaybe<BbsAccess>>>;
  eq?: InputMaybe<BbsAccess>;
  ge?: InputMaybe<BbsAccess>;
  gt?: InputMaybe<BbsAccess>;
  in?: InputMaybe<Array<InputMaybe<BbsAccess>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<BbsAccess>;
  lt?: InputMaybe<BbsAccess>;
  max?: InputMaybe<BbsAccessCriteria>;
  min?: InputMaybe<BbsAccessCriteria>;
  ne?: InputMaybe<BbsAccess>;
  notBetween?: InputMaybe<Array<InputMaybe<BbsAccess>>>;
  notIn?: InputMaybe<Array<InputMaybe<BbsAccess>>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Board = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Board';
  access: BbsAccess;
  articles: Array<Article>;
  category: Category;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  createdByUser: User;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  updatedByUser: User;
};

export type BoardFilterInput = {
  access?: InputMaybe<BbsAccessCriteria>;
  and?: InputMaybe<Array<BoardFilterInput>>;
  categoryId?: InputMaybe<SimpleCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<BoardFilterInput>;
  or?: InputMaybe<Array<BoardFilterInput>>;
};

export enum BoardFlag {
  /**  anonymous commentable */
  AnonymousAttachable = 'ANONYMOUS_ATTACHABLE',
  /**  member attachable */
  AnonymousCommentable = 'ANONYMOUS_COMMENTABLE',
  /**  recommentable */
  Answerable = 'ANSWERABLE',
  /**  answerable */
  Attachable = 'ATTACHABLE',
  /**  attachable */
  Categorizable = 'CATEGORIZABLE',
  Commentable = 'COMMENTABLE',
  /**  pinned */
  Locked = 'LOCKED',
  /**  member commentable */
  MemberAttachable = 'MEMBER_ATTACHABLE',
  /**  locked */
  MemberCommentable = 'MEMBER_COMMENTABLE',
  /**  categorizable */
  Pinned = 'PINNED',
  /**  commentable */
  Recommentable = 'RECOMMENTABLE'
}

export type BoardPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<BoardSort>>;
};

export enum BoardSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OrderAsc = 'ORDER_ASC',
  OrderDesc = 'ORDER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Category = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Category';
  access: BbsAccess;
  boards: Array<Maybe<Board>>;
  children?: Maybe<Array<Maybe<Category>>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type CategoryFilterInput = {
  access?: InputMaybe<BbsAccessCriteria>;
  and?: InputMaybe<Array<CategoryFilterInput>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<CategoryFilterInput>;
  or?: InputMaybe<Array<CategoryFilterInput>>;
};

export enum CategoryFlag {
  AnonymousAccessible = 'ANONYMOUS_ACCESSIBLE',
  AnonymousAttachable = 'ANONYMOUS_ATTACHABLE',
  AnonymousCommentable = 'ANONYMOUS_COMMENTABLE',
  AnonymousModifiable = 'ANONYMOUS_MODIFIABLE',
  MemberAccessible = 'MEMBER_ACCESSIBLE',
  MemberAttachable = 'MEMBER_ATTACHABLE',
  MemberCommentable = 'MEMBER_COMMENTABLE',
  MemberModifiable = 'MEMBER_MODIFIABLE'
}

export type CategoryPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<CategorySort>>;
};

export enum CategorySort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OrderAsc = 'ORDER_ASC',
  OrderDesc = 'ORDER_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Comment = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Comment';
  access: BbsAccess;
  children?: Maybe<Array<Maybe<Comment>>>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID']['output'];
  parent?: Maybe<Comment>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type CommentFilterInput = {
  access?: InputMaybe<BbsAccessCriteria>;
  and?: InputMaybe<Array<CommentFilterInput>>;
  articleId?: InputMaybe<SimpleCriteria>;
  content?: InputMaybe<StringCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<CommentFilterInput>;
  or?: InputMaybe<Array<CommentFilterInput>>;
};

export enum CommentFlag {
  Flag1 = 'FLAG1',
  Flag2 = 'FLAG2',
  Flag3 = 'FLAG3'
}

export type CommentPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<CommentSort>>;
};

export enum CommentSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

export type CommentTreeResponse = WithJsonProperty & {
  __typename?: 'CommentTreeResponse';
  properties?: Maybe<Scalars['JSON']['output']>;
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

export type CreateArticleInput = {
  access?: BbsAccess;
  answer?: InputMaybe<Scalars['String']['input']>;
  boardId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<ArticleFlag>>>;
  /**  공지글 */
  lockedInput?: InputMaybe<ArticleLockedInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  pinnedInput?: InputMaybe<ArticlePinnedInput>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  /**  비밀글 */
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateArticleResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateArticleResponse';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']['output']>;
  answered: Scalars['Boolean']['output'];
  board: Board;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<ArticleFile>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID']['output'];
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pinned?: Maybe<Scalars['Boolean']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  viewCount: Scalars['Int']['output'];
  writer?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateBoardInput = {
  access?: BbsAccess;
  categoryId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<BoardFlag>>>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateBoardResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateBoardResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
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
export type CreateCategoryInput = {
  access?: BbsAccess;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<CategoryFlag>>>;
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateCategoryResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateCategoryResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID']['output'];
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
export type CreateCommentInput = {
  access?: BbsAccess;
  articleId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
  enabled?: Scalars['Boolean']['input'];
  flags?: InputMaybe<Array<InputMaybe<CommentFlag>>>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateCommentResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateCommentResponse';
  access: BbsAccess;
  articleId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID']['output'];
  parent?: Maybe<Comment>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateMapNoteInput = {
  cameraPosition?: InputMaybe<Scalars['JSON']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  drawGeometry: Scalars['JSON']['input'];
  orientation?: InputMaybe<Scalars['JSON']['input']>;
  symbolId?: InputMaybe<Array<Scalars['ID']['input']>>;
  title: Scalars['String']['input'];
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type CreateMapNoteResponse = WithAuditable & {
  __typename?: 'CreateMapNoteResponse';
  cameraPosition?: Maybe<Scalars['JSON']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  /**     symbols: [Symbol!] */
  createdBy?: Maybe<Scalars['ID']['output']>;
  drawGeometry: Scalars['JSON']['output'];
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  orientation?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateSymbolGroupInput = {
  access?: SymbolAccess;
  collapsed?: Scalars['Boolean']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateSymbolGroupResponse = WithAuditable & {
  __typename?: 'CreateSymbolGroupResponse';
  access: SymbolAccess;
  collapsed: Scalars['Boolean']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<SymbolGroup>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateSymbolInput = {
  groupId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  uploadId: Array<Scalars['ID']['input']>;
};

export type CreateSymbolResponse = WithAuditable & {
  __typename?: 'CreateSymbolResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  files: Array<SymbolFile>;
  group?: Maybe<SymbolGroup>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
 * # Delete
 * ##################################################################################
 */
export type DeleteArticleInput = {
  boardId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
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

/**
 * #################################################################
 * # Default Filter Operators
 * #################################################################
 */
export type IdCriteria = {
  eq?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
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
  patch?: InputMaybe<Array<JsonPropertyPatchInput>>;
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

export type MapNote = WithAuditable & {
  __typename?: 'MapNote';
  cameraPosition?: Maybe<Scalars['JSON']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  drawGeometry: Scalars['JSON']['output'];
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  orientation?: Maybe<Scalars['JSON']['output']>;
  symbols?: Maybe<Array<Symbol>>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type MapNoteFile = WithAuditable & {
  __typename?: 'MapNoteFile';
  contentSize?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type MapNoteFilterInput = {
  and?: InputMaybe<Array<MapNoteFilterInput>>;
  content?: InputMaybe<StringCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  geometryType?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<MapNoteFilterInput>;
  or?: InputMaybe<Array<MapNoteFilterInput>>;
  title?: InputMaybe<StringCriteria>;
};

export type MapNotePageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<MapNoteSort>>;
};

export type MapNotePaged = {
  __typename?: 'MapNotePaged';
  items: Array<MapNote>;
  pageInfo: PaginationInfo;
};

export enum MapNoteSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type Mutation = {
  __typename?: 'Mutation';
  /**  Article */
  createArticle: CreateArticleResponse;
  /**  Board */
  createBoard: CreateBoardResponse;
  /**  Category */
  createCategory: CreateCategoryResponse;
  /**  Comment */
  createComment: CreateCommentResponse;
  /**  MapNote */
  createMapNote: CreateMapNoteResponse;
  /**  Symbol */
  createSymbol: CreateSymbolResponse;
  /**  SymbolGroup */
  createSymbolGroup: CreateSymbolGroupResponse;
  deleteAllMapNotes: Scalars['Boolean']['output'];
  deleteArticle: Scalars['Boolean']['output'];
  deleteArticleFile: Scalars['Boolean']['output'];
  deleteBoard: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteComment: Scalars['Boolean']['output'];
  deleteMapNote: Scalars['Boolean']['output'];
  deleteMapNoteFile: Scalars['Boolean']['output'];
  deleteSymbol: Scalars['Boolean']['output'];
  deleteSymbolFile: Scalars['Boolean']['output'];
  deleteSymbolGroup: Scalars['Boolean']['output'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteSymbolUploadFile: Scalars['Boolean']['output'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteUploadFile: Scalars['Boolean']['output'];
  updateArticle: UpdateArticleResponse;
  updateBoard: UpdateBoardResponse;
  updateCategory: UpdateCategoryResponse;
  updateComment: UpdateCommentResponse;
  updateMapNote: UpdateMapNoteResponse;
  updateSymbol: UpdateSymbolResponse;
  updateSymbolGroup: UpdateSymbolGroupResponse;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateBoardArgs = {
  input: CreateBoardInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateMapNoteArgs = {
  input: CreateMapNoteInput;
};


export type MutationCreateSymbolArgs = {
  input: CreateSymbolInput;
};


export type MutationCreateSymbolGroupArgs = {
  input: CreateSymbolGroupInput;
};


export type MutationDeleteArticleArgs = {
  input: DeleteArticleInput;
};


export type MutationDeleteArticleFileArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteBoardArgs = {
  id: Array<InputMaybe<Scalars['ID']['input']>>;
};


export type MutationDeleteCategoryArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteCommentArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteMapNoteArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteMapNoteFileArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSymbolArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSymbolFileArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSymbolGroupArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteSymbolUploadFileArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Array<Scalars['ID']['input']>;
};


export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput;
};


export type MutationUpdateBoardArgs = {
  id: Scalars['ID']['input'];
  input: UpdateBoardInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCategoryInput;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCommentInput;
};


export type MutationUpdateMapNoteArgs = {
  id: Scalars['ID']['input'];
  input: UpdateMapNoteInput;
};


export type MutationUpdateSymbolArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSymbolInput;
};


export type MutationUpdateSymbolGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSymbolGroupInput;
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

export type Query = {
  __typename?: 'Query';
  /**  Article */
  article?: Maybe<Article>;
  articles: ArticleCursored;
  articlesPaged: ArticlePaged;
  articlesPinned: Array<Article>;
  /**  Board */
  board?: Maybe<Board>;
  boards: Array<Board>;
  categories: Array<Category>;
  /**  Category */
  category?: Maybe<Category>;
  /**  Comment */
  comment?: Maybe<Comment>;
  commentTreeView: CommentTreeResponse;
  comments: Array<Comment>;
  /**  MapNote */
  mapNote?: Maybe<MapNote>;
  mapNotes: MapNotePaged;
  /**  Symbol */
  symbol?: Maybe<Symbol>;
  /**  SymbolGroup */
  symbolGroup?: Maybe<SymbolGroup>;
  symbolGroupTreeView: SymbolGroupTree;
  symbolGroups: Array<SymbolGroup>;
  symbolGroupsPaged: SymbolGroupPaged;
  symbols: SymbolPaged;
  /**  Upload */
  uploadFile?: Maybe<UploadFile>;
  uploadFiles: UploadFilePagedResponse;
};


export type QueryArticleArgs = {
  input: ReadArticleInput;
};


export type QueryArticlesArgs = {
  cursor?: InputMaybe<Scalars['Long']['input']>;
  filter?: InputMaybe<ArticleFilterInput>;
  size?: Scalars['Int']['input'];
};


export type QueryArticlesPagedArgs = {
  filter?: InputMaybe<ArticleFilterInput>;
  pageable?: InputMaybe<ArticlePageable>;
};


export type QueryArticlesPinnedArgs = {
  boardId: Scalars['ID']['input'];
};


export type QueryBoardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBoardsArgs = {
  filter?: InputMaybe<BoardFilterInput>;
  pageable?: InputMaybe<BoardPageable>;
};


export type QueryCategoriesArgs = {
  filter?: InputMaybe<CategoryFilterInput>;
  pageable?: InputMaybe<CategoryPageable>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCommentTreeViewArgs = {
  articleId: Scalars['ID']['input'];
};


export type QueryCommentsArgs = {
  filter?: InputMaybe<CommentFilterInput>;
  pageable?: InputMaybe<CommentPageable>;
};


export type QueryMapNoteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMapNotesArgs = {
  filter?: InputMaybe<MapNoteFilterInput>;
  pageable?: InputMaybe<MapNotePageable>;
};


export type QuerySymbolArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySymbolGroupArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySymbolGroupsArgs = {
  filter?: InputMaybe<SymbolGroupFilterInput>;
};


export type QuerySymbolGroupsPagedArgs = {
  filter?: InputMaybe<SymbolGroupFilterInput>;
  pageable?: InputMaybe<SymbolGroupPageable>;
};


export type QuerySymbolsArgs = {
  filter?: InputMaybe<SymbolFilterInput>;
  pageable?: InputMaybe<SymbolPageable>;
};


export type QueryUploadFileArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUploadFilesArgs = {
  filter?: InputMaybe<UploadFileFilterInput>;
  pageable?: InputMaybe<UploadFilePageable>;
};

/**
 * ##################################################################################
 * # Read
 * ##################################################################################
 */
export type ReadArticleInput = {
  boardId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
};

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

export type Symbol = WithAuditable & {
  __typename?: 'Symbol';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  files: Array<SymbolFile>;
  group?: Maybe<SymbolGroup>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export enum SymbolAccess {
  Default = 'Default',
  Inherit = 'Inherit',
  Private = 'Private',
  Protected = 'Protected',
  Public = 'Public'
}

export type SymbolAccessCriteria = {
  between?: InputMaybe<Array<InputMaybe<SymbolAccess>>>;
  eq?: InputMaybe<SymbolAccess>;
  ge?: InputMaybe<SymbolAccess>;
  gt?: InputMaybe<SymbolAccess>;
  in?: InputMaybe<Array<InputMaybe<SymbolAccess>>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  le?: InputMaybe<SymbolAccess>;
  lt?: InputMaybe<SymbolAccess>;
  max?: InputMaybe<SymbolAccessCriteria>;
  min?: InputMaybe<SymbolAccessCriteria>;
  ne?: InputMaybe<SymbolAccess>;
  notBetween?: InputMaybe<Array<InputMaybe<SymbolAccess>>>;
  notIn?: InputMaybe<Array<InputMaybe<SymbolAccess>>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type SymbolFile = WithAuditable & {
  __typename?: 'SymbolFile';
  contentSize?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  thumbnail?: Maybe<SymbolFileThumbnail>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
  width?: Maybe<Scalars['Int']['output']>;
};

export type SymbolFileThumbnail = {
  __typename?: 'SymbolFileThumbnail';
  contentSize?: Maybe<Scalars['String']['output']>;
  contentType?: Maybe<Scalars['String']['output']>;
  download?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
};

export type SymbolFilterInput = {
  and?: InputMaybe<Array<SymbolFilterInput>>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<IdCriteria>;
  groupId?: InputMaybe<IdCriteria>;
  id?: InputMaybe<IdCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<SymbolFilterInput>;
  or?: InputMaybe<Array<SymbolFilterInput>>;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type SymbolGroup = WithAuditable & {
  __typename?: 'SymbolGroup';
  access: SymbolAccess;
  children?: Maybe<Array<SymbolGroup>>;
  collapsed: Scalars['Boolean']['output'];
  count: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  createdByUser: User;
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  parent?: Maybe<SymbolGroup>;
  symbols?: Maybe<Array<Symbol>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
  updatedByUser: User;
};

export type SymbolGroupFilterInput = {
  access?: InputMaybe<SymbolAccessCriteria>;
  and?: InputMaybe<Array<SymbolGroupFilterInput>>;
  collapsed?: InputMaybe<BooleanCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<IdCriteria>;
  description?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<SymbolGroupFilterInput>;
  or?: InputMaybe<Array<SymbolGroupFilterInput>>;
  parentId?: InputMaybe<SimpleCriteria>;
};

export type SymbolGroupPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<SymbolGroupSort>>;
};

export type SymbolGroupPaged = {
  __typename?: 'SymbolGroupPaged';
  items: Array<SymbolGroup>;
  pageInfo: PaginationInfo;
};

export enum SymbolGroupSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type SymbolGroupTree = WithJsonProperty & {
  __typename?: 'SymbolGroupTree';
  properties?: Maybe<Scalars['JSON']['output']>;
};

export type SymbolPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<SymbolSort>>;
};

export type SymbolPaged = {
  __typename?: 'SymbolPaged';
  items: Array<Symbol>;
  pageInfo: PaginationInfo;
};

export enum SymbolSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  GroupNameAsc = 'GROUP_NAME_ASC',
  GroupNameDesc = 'GROUP_NAME_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

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
export type UpdateArticleInput = {
  access?: InputMaybe<BbsAccess>;
  answer?: InputMaybe<Scalars['String']['input']>;
  answered?: InputMaybe<Scalars['Boolean']['input']>;
  boardId: Scalars['ID']['input'];
  content?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<ArticleFlag>>>;
  id: Scalars['ID']['input'];
  lockedInput?: InputMaybe<ArticleLockedInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  /**  비밀글 */
  pinnedInput?: InputMaybe<ArticlePinnedInput>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  /**  공지글 */
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateArticleResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateArticleResponse';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']['output']>;
  answered: Scalars['Boolean']['output'];
  board: Board;
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  files: Array<Maybe<ArticleFile>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID']['output'];
  locked: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pinned?: Maybe<Scalars['Boolean']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
  viewCount: Scalars['Int']['output'];
  writer?: Maybe<Scalars['String']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateBoardInput = {
  access?: InputMaybe<BbsAccess>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<BoardFlag>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateBoardResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateBoardResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCategoryInput = {
  access?: InputMaybe<BbsAccess>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<CategoryFlag>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateCategoryResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateCategoryResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  properties?: Maybe<Scalars['JSON']['output']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy: Scalars['ID']['output'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCommentInput = {
  access?: InputMaybe<BbsAccess>;
  articleId?: InputMaybe<Scalars['ID']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  flags?: InputMaybe<Array<InputMaybe<CommentFlag>>>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateCommentResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateCommentResponse';
  access: BbsAccess;
  articleId: Scalars['ID']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  enabled: Scalars['Boolean']['output'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID']['output'];
  parent?: Maybe<Comment>;
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
export type UpdateMapNoteInput = {
  cameraPosition?: InputMaybe<Scalars['JSON']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  drawGeometry?: InputMaybe<Scalars['JSON']['input']>;
  orientation?: InputMaybe<Scalars['JSON']['input']>;
  symbolId?: InputMaybe<Array<Scalars['ID']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateMapNoteResponse = WithAuditable & {
  __typename?: 'UpdateMapNoteResponse';
  cameraPosition?: Maybe<Scalars['JSON']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  /**     symbols: [Symbol!] */
  createdBy?: Maybe<Scalars['ID']['output']>;
  drawGeometry?: Maybe<Scalars['JSON']['output']>;
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  orientation?: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSymbolGroupInput = {
  access?: InputMaybe<SymbolAccess>;
  collapsed?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

export type UpdateSymbolGroupResponse = WithAuditable & {
  __typename?: 'UpdateSymbolGroupResponse';
  access?: Maybe<SymbolAccess>;
  collapsed?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  enabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  parent?: Maybe<SymbolGroup>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  updatedBy?: Maybe<Scalars['ID']['output']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSymbolInput = {
  groupId?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  uploadId?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateSymbolResponse = WithAuditable & {
  __typename?: 'UpdateSymbolResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  files?: Maybe<Array<Maybe<SymbolFile>>>;
  group?: Maybe<SymbolGroup>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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
  createdBy?: InputMaybe<OwnerCriteria>;
  filename?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UploadFileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
};

export type UploadFilePageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<UploadFileSort>>;
};

export type UploadFilePagedResponse = {
  __typename?: 'UploadFilePagedResponse';
  items: Array<UploadFile>;
  pageInfo: PaginationInfo;
};

export enum UploadFileSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC'
}

export type User = {
  __typename?: 'User';
  attributes?: Maybe<Scalars['JSON']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified?: Maybe<Scalars['Boolean']['output']>;
  enabled: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
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

export type SymbolGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SymbolGroupQuery = { __typename?: 'Query', symbolGroup?: { __typename?: 'SymbolGroup', id: string, name: string, order: number, count: number, enabled: boolean, collapsed: boolean, access: SymbolAccess, symbols?: Array<{ __typename?: 'Symbol', id: string, name: string, files: Array<{ __typename?: 'SymbolFile', id: string, contentType?: string | null, contentSize?: string | null, download?: string | null, thumbnail?: { __typename?: 'SymbolFileThumbnail', filename: string, contentType?: string | null, download?: string | null } | null }> }> | null } | null };

export type SymbolGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type SymbolGroupsQuery = { __typename?: 'Query', symbolGroups: Array<{ __typename?: 'SymbolGroup', id: string, name: string, order: number, count: number, enabled: boolean, collapsed: boolean, access: SymbolAccess }> };

export type SymbolgrouppagedQueryVariables = Exact<{
  filter?: InputMaybe<SymbolGroupFilterInput>;
  pageable?: InputMaybe<SymbolGroupPageable>;
}>;


export type SymbolgrouppagedQuery = { __typename?: 'Query', symbolGroupsPaged: { __typename?: 'SymbolGroupPaged', items: Array<{ __typename?: 'SymbolGroup', id: string, name: string, description?: string | null, order: number, count: number, enabled: boolean, collapsed: boolean, access: SymbolAccess, createdBy: string, createdAt?: string | null, updatedBy: string, updatedAt?: string | null, symbols?: Array<{ __typename?: 'Symbol', id: string, name: string, createdBy: string, createdAt?: string | null, updatedBy: string, updatedAt?: string | null }> | null }>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, page: number, size: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type SymbolQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SymbolQuery = { __typename?: 'Query', symbol?: { __typename?: 'Symbol', id: string, name: string, group?: { __typename?: 'SymbolGroup', id: string, name: string } | null, files: Array<{ __typename?: 'SymbolFile', id: string, filename: string, download?: string | null, contentSize?: string | null, width?: number | null, height?: number | null }> } | null };

export type SymbolsQueryVariables = Exact<{
  filter?: InputMaybe<SymbolFilterInput>;
  pageable?: InputMaybe<SymbolPageable>;
}>;


export type SymbolsQuery = { __typename?: 'Query', symbols: { __typename?: 'SymbolPaged', items: Array<{ __typename?: 'Symbol', id: string, name: string, files: Array<{ __typename?: 'SymbolFile', id: string, filename: string, contentType?: string | null, contentSize?: string | null, download?: string | null, thumbnail?: { __typename?: 'SymbolFileThumbnail', filename: string, contentType?: string | null, download?: string | null } | null }> }>, pageInfo: { __typename?: 'PaginationInfo', totalPages: number, totalItems: number, page: number, size: number, hasNextPage: boolean, hasPreviousPage: boolean } } };

export type CreateSymbolGroupMutationVariables = Exact<{
  input: CreateSymbolGroupInput;
}>;


export type CreateSymbolGroupMutation = { __typename?: 'Mutation', createSymbolGroup: { __typename?: 'CreateSymbolGroupResponse', id: string, name: string, description?: string | null, order?: number | null, enabled: boolean, collapsed: boolean, access: SymbolAccess, createdBy?: string | null, createdAt?: string | null, updatedBy?: string | null, updatedAt?: string | null } };

export type UpdateSymbolGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSymbolGroupInput;
}>;


export type UpdateSymbolGroupMutation = { __typename?: 'Mutation', updateSymbolGroup: { __typename?: 'UpdateSymbolGroupResponse', id: string, name?: string | null, description?: string | null, order?: number | null, enabled?: boolean | null, collapsed?: boolean | null, access?: SymbolAccess | null, createdBy?: string | null, createdAt?: string | null, updatedBy?: string | null, updatedAt?: string | null } };

export type DeleteSymbolGroupMutationVariables = Exact<{
  id: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteSymbolGroupMutation = { __typename?: 'Mutation', deleteSymbolGroup: boolean };

export type CreateSymbolMutationVariables = Exact<{
  input: CreateSymbolInput;
}>;


export type CreateSymbolMutation = { __typename?: 'Mutation', createSymbol: { __typename?: 'CreateSymbolResponse', id: string, name: string } };

export type DeleteSymbolMutationVariables = Exact<{
  id: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteSymbolMutation = { __typename?: 'Mutation', deleteSymbol: boolean };

export type UpdateSymbolMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSymbolInput;
}>;


export type UpdateSymbolMutation = { __typename?: 'Mutation', updateSymbol: { __typename?: 'UpdateSymbolResponse', id: string, name: string } };

export type DeleteSymbolFileMutationVariables = Exact<{
  id: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteSymbolFileMutation = { __typename?: 'Mutation', deleteSymbolFile: boolean };


export const SymbolGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SymbolGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbolGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"symbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentSize"}},{"kind":"Field","name":{"kind":"Name","value":"download"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"download"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<SymbolGroupQuery, SymbolGroupQueryVariables>;
export const SymbolGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SymbolGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbolGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}}]}}]}}]} as unknown as DocumentNode<SymbolGroupsQuery, SymbolGroupsQueryVariables>;
export const SymbolgrouppagedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SYMBOLGROUPPAGED"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SymbolGroupFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SymbolGroupPageable"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbolGroupsPaged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"symbols"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<SymbolgrouppagedQuery, SymbolgrouppagedQueryVariables>;
export const SymbolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SYMBOL"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbol"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"download"}},{"kind":"Field","name":{"kind":"Name","value":"contentSize"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}}]}}]} as unknown as DocumentNode<SymbolQuery, SymbolQueryVariables>;
export const SymbolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SYMBOLS"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SymbolFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SymbolPageable"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"symbols"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pageable"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pageable"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"contentSize"}},{"kind":"Field","name":{"kind":"Name","value":"download"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"filename"}},{"kind":"Field","name":{"kind":"Name","value":"contentType"}},{"kind":"Field","name":{"kind":"Name","value":"download"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}}]}}]}}]} as unknown as DocumentNode<SymbolsQuery, SymbolsQueryVariables>;
export const CreateSymbolGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSymbolGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSymbolGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSymbolGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateSymbolGroupMutation, CreateSymbolGroupMutationVariables>;
export const UpdateSymbolGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSymbolGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSymbolGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSymbolGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collapsed"}},{"kind":"Field","name":{"kind":"Name","value":"access"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateSymbolGroupMutation, UpdateSymbolGroupMutationVariables>;
export const DeleteSymbolGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteSymbolGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSymbolGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteSymbolGroupMutation, DeleteSymbolGroupMutationVariables>;
export const CreateSymbolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createSymbol"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSymbolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSymbol"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateSymbolMutation, CreateSymbolMutationVariables>;
export const DeleteSymbolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteSymbol"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSymbol"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteSymbolMutation, DeleteSymbolMutationVariables>;
export const UpdateSymbolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateSymbol"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSymbolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSymbol"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateSymbolMutation, UpdateSymbolMutationVariables>;
export const DeleteSymbolFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteSymbolFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSymbolFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteSymbolFileMutation, DeleteSymbolFileMutationVariables>;