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

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type Article = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Article';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']>;
  answered: Scalars['Boolean'];
  board: Board;
  comments?: Maybe<Array<Maybe<Comment>>>;
  content: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  enabled: Scalars['Boolean'];
  files?: Maybe<Array<Maybe<ArticleFile>>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
  viewCount: Scalars['Int'];
  writer?: Maybe<Scalars['String']>;
};

export type ArticleCursored = {
  __typename?: 'ArticleCursored';
  content: Array<Article>;
  hasNext?: Maybe<Scalars['Boolean']>;
  hasPrevious?: Maybe<Scalars['Boolean']>;
  number?: Maybe<Scalars['Long']>;
  size?: Maybe<Scalars['Int']>;
  totalElements?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type ArticleFile = WithAuditable & {
  __typename?: 'ArticleFile';
  contentSize?: Maybe<Scalars['Long']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

export type ArticleFilterInput = {
  access?: InputMaybe<BbsAccessCriteria>;
  and?: InputMaybe<Array<ArticleFilterInput>>;
  answered?: InputMaybe<Scalars['Boolean']>;
  boardId?: InputMaybe<SimpleCriteria>;
  content?: InputMaybe<StringCriteria>;
  createdAt?: InputMaybe<DateTimeCriteria>;
  createdBy?: InputMaybe<OwnerCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  locked?: InputMaybe<Scalars['Boolean']>;
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
  locked: Scalars['Boolean'];
  password: Scalars['String'];
  writer: Scalars['String'];
};

export type ArticlePageable = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<ArticleSort>>;
};

export type ArticlePaged = {
  __typename?: 'ArticlePaged';
  items: Array<Article>;
  pageInfo: PaginationInfo;
};

export type ArticlePinnedInput = {
  from?: InputMaybe<Scalars['DateTime']>;
  pinned: Scalars['Boolean'];
  to?: InputMaybe<Scalars['DateTime']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  createdByUser: User;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
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
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
export type Category = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'Category';
  access: BbsAccess;
  boards: Array<Maybe<Board>>;
  children?: Maybe<Array<Maybe<Category>>>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parent?: Maybe<Category>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
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
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID'];
  parent?: Maybe<Comment>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
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
  page?: Scalars['Int'];
  size?: Scalars['Int'];
  sort?: InputMaybe<Array<CommentSort>>;
};

export enum CommentSort {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC'
}

export type CommentTreeResponse = WithJsonProperty & {
  __typename?: 'CommentTreeResponse';
  properties?: Maybe<Scalars['JSON']>;
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

export type CreateArticleInput = {
  access?: BbsAccess;
  answer?: InputMaybe<Scalars['String']>;
  boardId: Scalars['ID'];
  content?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<ArticleFlag>>>;
  /**  공지글 */
  lockedInput?: InputMaybe<ArticleLockedInput>;
  name?: InputMaybe<Scalars['String']>;
  pinnedInput?: InputMaybe<ArticlePinnedInput>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
  /**  비밀글 */
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type CreateArticleResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateArticleResponse';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']>;
  answered: Scalars['Boolean'];
  board: Board;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<ArticleFile>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
  name: Scalars['String'];
  pinned?: Maybe<Scalars['Boolean']>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
  viewCount: Scalars['Int'];
  writer?: Maybe<Scalars['String']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateBoardInput = {
  access?: BbsAccess;
  categoryId: Scalars['ID'];
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<BoardFlag>>>;
  name: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateBoardResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateBoardResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
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
export type CreateCategoryInput = {
  access?: BbsAccess;
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<CategoryFlag>>>;
  name: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateCategoryResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateCategoryResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID'];
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
export type CreateCommentInput = {
  access?: BbsAccess;
  articleId: Scalars['ID'];
  content: Scalars['String'];
  enabled?: Scalars['Boolean'];
  flags?: InputMaybe<Array<InputMaybe<CommentFlag>>>;
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<Array<InputMaybe<SimpleTagCreateInput>>>;
};

export type CreateCommentResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'CreateCommentResponse';
  access: BbsAccess;
  articleId: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID'];
  parent?: Maybe<Comment>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateMapNoteInput = {
  cameraPosition?: InputMaybe<Scalars['JSON']>;
  content?: InputMaybe<Scalars['String']>;
  drawGeometry: Scalars['JSON'];
  orientation?: InputMaybe<Scalars['JSON']>;
  symbolId?: InputMaybe<Array<Scalars['ID']>>;
  title: Scalars['String'];
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type CreateMapNoteResponse = WithAuditable & {
  __typename?: 'CreateMapNoteResponse';
  cameraPosition?: Maybe<Scalars['JSON']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  /**     symbols: [Symbol!] */
  createdBy?: Maybe<Scalars['ID']>;
  drawGeometry: Scalars['JSON'];
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  orientation?: Maybe<Scalars['JSON']>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateSymbolGroupInput = {
  access?: SymbolAccess;
  collapsed?: Scalars['Boolean'];
  description?: InputMaybe<Scalars['String']>;
  enabled?: Scalars['Boolean'];
  name: Scalars['String'];
  order?: InputMaybe<Scalars['Int']>;
  parentId?: InputMaybe<Scalars['ID']>;
};

export type CreateSymbolGroupResponse = WithAuditable & {
  __typename?: 'CreateSymbolGroupResponse';
  access: SymbolAccess;
  collapsed: Scalars['Boolean'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  parent?: Maybe<SymbolGroup>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Create
 * ##################################################################################
 */
export type CreateSymbolInput = {
  groupId: Scalars['ID'];
  name: Scalars['String'];
  uploadId: Array<Scalars['ID']>;
};

export type CreateSymbolResponse = WithAuditable & {
  __typename?: 'CreateSymbolResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  files: Array<SymbolFile>;
  group?: Maybe<SymbolGroup>;
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
 * # Delete
 * ##################################################################################
 */
export type DeleteArticleInput = {
  boardId: Scalars['ID'];
  id: Scalars['ID'];
  password?: InputMaybe<Scalars['String']>;
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

/**
 * #################################################################
 * # Default Filter Operators
 * #################################################################
 */
export type IdCriteria = {
  eq?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
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
  patch?: InputMaybe<Array<JsonPropertyPatchInput>>;
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

export type MapNote = WithAuditable & {
  __typename?: 'MapNote';
  cameraPosition?: Maybe<Scalars['JSON']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  drawGeometry: Scalars['JSON'];
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  orientation?: Maybe<Scalars['JSON']>;
  symbols?: Maybe<Array<Symbol>>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
};

/**
 * ##################################################################################
 * # Query
 * ##################################################################################
 */
export type MapNoteFile = WithAuditable & {
  __typename?: 'MapNoteFile';
  contentSize?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
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
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
  deleteAllMapNotes: Scalars['Boolean'];
  deleteArticle: Scalars['Boolean'];
  deleteArticleFile: Scalars['Boolean'];
  deleteBoard: Scalars['Boolean'];
  deleteCategory: Scalars['Boolean'];
  deleteComment: Scalars['Boolean'];
  deleteMapNote: Scalars['Boolean'];
  deleteMapNoteFile: Scalars['Boolean'];
  deleteSymbol: Scalars['Boolean'];
  deleteSymbolFile: Scalars['Boolean'];
  deleteSymbolGroup: Scalars['Boolean'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteSymbolUploadFile: Scalars['Boolean'];
  /**
   *  Upload
   *  Use RestAPI instead of Graphql
   *  createUploadFiles(files: [Upload!]): [ID]!
   */
  deleteUploadFile: Scalars['Boolean'];
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
  id: Array<Scalars['ID']>;
};


export type MutationDeleteBoardArgs = {
  id: Array<InputMaybe<Scalars['ID']>>;
};


export type MutationDeleteCategoryArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteCommentArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteMapNoteArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteMapNoteFileArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteSymbolArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteSymbolFileArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteSymbolGroupArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteSymbolUploadFileArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationDeleteUploadFileArgs = {
  id: Array<Scalars['ID']>;
};


export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput;
};


export type MutationUpdateBoardArgs = {
  id: Scalars['ID'];
  input: UpdateBoardInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID'];
  input: UpdateCategoryInput;
};


export type MutationUpdateCommentArgs = {
  id: Scalars['ID'];
  input: UpdateCommentInput;
};


export type MutationUpdateMapNoteArgs = {
  id: Scalars['ID'];
  input: UpdateMapNoteInput;
};


export type MutationUpdateSymbolArgs = {
  id: Scalars['ID'];
  input: UpdateSymbolInput;
};


export type MutationUpdateSymbolGroupArgs = {
  id: Scalars['ID'];
  input: UpdateSymbolGroupInput;
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
  cursor?: InputMaybe<Scalars['Long']>;
  filter?: InputMaybe<ArticleFilterInput>;
  size?: Scalars['Int'];
};


export type QueryArticlesPagedArgs = {
  filter?: InputMaybe<ArticleFilterInput>;
  pageable?: InputMaybe<ArticlePageable>;
};


export type QueryArticlesPinnedArgs = {
  boardId: Scalars['ID'];
};


export type QueryBoardArgs = {
  id: Scalars['ID'];
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
  id: Scalars['ID'];
};


export type QueryCommentArgs = {
  id: Scalars['ID'];
};


export type QueryCommentTreeViewArgs = {
  articleId: Scalars['ID'];
};


export type QueryCommentsArgs = {
  filter?: InputMaybe<CommentFilterInput>;
  pageable?: InputMaybe<CommentPageable>;
};


export type QueryMapNoteArgs = {
  id: Scalars['ID'];
};


export type QueryMapNotesArgs = {
  filter?: InputMaybe<MapNoteFilterInput>;
  pageable?: InputMaybe<MapNotePageable>;
};


export type QuerySymbolArgs = {
  id: Scalars['ID'];
};


export type QuerySymbolGroupArgs = {
  id: Scalars['ID'];
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
  id: Scalars['ID'];
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
  boardId: Scalars['ID'];
  id: Scalars['ID'];
  password?: InputMaybe<Scalars['String']>;
};

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

export type Symbol = WithAuditable & {
  __typename?: 'Symbol';
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  files: Array<SymbolFile>;
  group?: Maybe<SymbolGroup>;
  id: Scalars['ID'];
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  contentSize?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
  height?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  thumbnail?: Maybe<SymbolFileThumbnail>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
  updatedByUser: User;
  width?: Maybe<Scalars['Int']>;
};

export type SymbolFileThumbnail = {
  __typename?: 'SymbolFileThumbnail';
  contentSize?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  download?: Maybe<Scalars['String']>;
  filename: Scalars['String'];
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
  collapsed: Scalars['Boolean'];
  count: Scalars['Int'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  createdByUser: User;
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  order: Scalars['Int'];
  parent?: Maybe<SymbolGroup>;
  symbols?: Maybe<Array<Symbol>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
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
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
  properties?: Maybe<Scalars['JSON']>;
};

export type SymbolPageable = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
export type UpdateArticleInput = {
  access?: InputMaybe<BbsAccess>;
  answer?: InputMaybe<Scalars['String']>;
  answered?: InputMaybe<Scalars['Boolean']>;
  boardId: Scalars['ID'];
  content?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<ArticleFlag>>>;
  id: Scalars['ID'];
  lockedInput?: InputMaybe<ArticleLockedInput>;
  name?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  /**  비밀글 */
  pinnedInput?: InputMaybe<ArticlePinnedInput>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
  /**  공지글 */
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateArticleResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateArticleResponse';
  access: BbsAccess;
  answer?: Maybe<Scalars['String']>;
  answered: Scalars['Boolean'];
  board: Board;
  content: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled: Scalars['Boolean'];
  files: Array<Maybe<ArticleFile>>;
  flags?: Maybe<Array<Maybe<ArticleFlag>>>;
  id: Scalars['ID'];
  locked: Scalars['Boolean'];
  name: Scalars['String'];
  pinned?: Maybe<Scalars['Boolean']>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
  viewCount: Scalars['Int'];
  writer?: Maybe<Scalars['String']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateBoardInput = {
  access?: InputMaybe<BbsAccess>;
  categoryId?: InputMaybe<Scalars['ID']>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<BoardFlag>>>;
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateBoardResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateBoardResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<BoardFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  order?: Maybe<Scalars['Int']>;
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCategoryInput = {
  access?: InputMaybe<BbsAccess>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<CategoryFlag>>>;
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateCategoryResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateCategoryResponse';
  access: BbsAccess;
  createdAt?: Maybe<Scalars['String']>;
  createdBy: Scalars['ID'];
  description?: Maybe<Scalars['String']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CategoryFlag>>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  properties?: Maybe<Scalars['JSON']>;
  tags: Array<Maybe<SimpleTagValue>>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy: Scalars['ID'];
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateCommentInput = {
  access?: InputMaybe<BbsAccess>;
  articleId?: InputMaybe<Scalars['ID']>;
  content?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  flags?: InputMaybe<Array<InputMaybe<CommentFlag>>>;
  parentId?: InputMaybe<Scalars['ID']>;
  properties?: InputMaybe<JsonPropertyInput>;
  tags?: InputMaybe<SimpleTagCommandInput>;
};

export type UpdateCommentResponse = WithAuditable & WithJsonProperty & WithSimpleTags & {
  __typename?: 'UpdateCommentResponse';
  access: BbsAccess;
  articleId: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  enabled: Scalars['Boolean'];
  flags?: Maybe<Array<Maybe<CommentFlag>>>;
  id: Scalars['ID'];
  parent?: Maybe<Comment>;
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
export type UpdateMapNoteInput = {
  cameraPosition?: InputMaybe<Scalars['JSON']>;
  content?: InputMaybe<Scalars['String']>;
  drawGeometry?: InputMaybe<Scalars['JSON']>;
  orientation?: InputMaybe<Scalars['JSON']>;
  symbolId?: InputMaybe<Array<Scalars['ID']>>;
  title?: InputMaybe<Scalars['String']>;
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateMapNoteResponse = WithAuditable & {
  __typename?: 'UpdateMapNoteResponse';
  cameraPosition?: Maybe<Scalars['JSON']>;
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  /**     symbols: [Symbol!] */
  createdBy?: Maybe<Scalars['ID']>;
  drawGeometry?: Maybe<Scalars['JSON']>;
  files?: Maybe<Array<MapNoteFile>>;
  geometryType?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  orientation?: Maybe<Scalars['JSON']>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSymbolGroupInput = {
  access?: InputMaybe<SymbolAccess>;
  collapsed?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Scalars['Int']>;
  parentId?: InputMaybe<Scalars['ID']>;
};

export type UpdateSymbolGroupResponse = WithAuditable & {
  __typename?: 'UpdateSymbolGroupResponse';
  access?: Maybe<SymbolAccess>;
  collapsed?: Maybe<Scalars['Boolean']>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['Int']>;
  parent?: Maybe<SymbolGroup>;
  updatedAt?: Maybe<Scalars['String']>;
  updatedBy?: Maybe<Scalars['ID']>;
};

/**
 * ##################################################################################
 * # Update
 * ##################################################################################
 */
export type UpdateSymbolInput = {
  groupId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  uploadId?: InputMaybe<Array<Scalars['ID']>>;
};

export type UpdateSymbolResponse = WithAuditable & {
  __typename?: 'UpdateSymbolResponse';
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['ID']>;
  files?: Maybe<Array<Maybe<SymbolFile>>>;
  group?: Maybe<SymbolGroup>;
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
  createdBy?: InputMaybe<OwnerCriteria>;
  filename?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UploadFileFilterInput>;
  or?: InputMaybe<Array<InputMaybe<UploadFileFilterInput>>>;
};

export type UploadFilePageable = {
  page?: Scalars['Int'];
  size?: Scalars['Int'];
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
  attributes?: Maybe<Scalars['JSON']>;
  createdAt?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  emailVerified?: Maybe<Scalars['Boolean']>;
  enabled: Scalars['Boolean'];
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
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