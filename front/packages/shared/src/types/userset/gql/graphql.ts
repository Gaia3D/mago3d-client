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
  /** A JSON scalar */
  JSON: { input: any; output: any; }
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

export type CreateUserGroupInput = {
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateUserGroupResponse = {
  __typename?: 'CreateUserGroupResponse';
  attributes?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type CreateUserInput = {
  cellphones?: InputMaybe<Array<Scalars['String']['input']>>;
  email: Scalars['String']['input'];
  enabled?: Scalars['Boolean']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  groups?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
  roles?: InputMaybe<Array<Scalars['ID']['input']>>;
  telephones?: InputMaybe<Array<Scalars['String']['input']>>;
  username: Scalars['ID']['input'];
};

export type CreateUserResponse = {
  __typename?: 'CreateUserResponse';
  email: Scalars['String']['output'];
  enabled: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  username: Scalars['String']['output'];
};

export type CreateUserRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['ID']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateUserRoleResponse = {
  __typename?: 'CreateUserRoleResponse';
  attributes?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['ID']['output'];
};

/**
 * type DefaultErrorInfo implements ErrorInfo {
 *     message: String!
 * }
 */
export type DefaultError = Error & {
  __typename?: 'DefaultError';
  errors?: Maybe<Array<Error>>;
  message: Scalars['String']['output'];
};

export type Error = {
  errors?: Maybe<Array<Error>>;
  message: Scalars['String']['output'];
};

export type ExistsUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type ExistsUserResponse = DefaultError | ExistsUserResult;

export type ExistsUserResult = {
  __typename?: 'ExistsUserResult';
  email: Scalars['Boolean']['output'];
  phone: Scalars['Boolean']['output'];
  username: Scalars['Boolean']['output'];
};

export type FloatFilter = {
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
};

export type IntFilter = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type JoinUserInput = {
  cellphones?: InputMaybe<Array<Scalars['String']['input']>>;
  email: Scalars['String']['input'];
  enabled?: Scalars['Boolean']['input'];
  firstName: Scalars['String']['input'];
  groups?: InputMaybe<Array<Scalars['ID']['input']>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
  telephones?: InputMaybe<Array<Scalars['String']['input']>>;
  username: Scalars['String']['input'];
};

export type JoinUserResponse = DefaultError | User;

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

export type Mutation = {
  __typename?: 'Mutation';
  associateUserRole: Scalars['Boolean']['output'];
  /**  사용자 */
  createUser: CreateUserResponse;
  /**  그룹 */
  createUserGroup: CreateUserGroupResponse;
  /**  권한 */
  createUserRole: CreateUserRoleResponse;
  deleteUser: Scalars['Boolean']['output'];
  deleteUserGroup: Scalars['Boolean']['output'];
  deleteUserRole: Scalars['Boolean']['output'];
  /**  회원가입 */
  joinUser: JoinUserResponse;
  /**  암호 초기화 */
  resetUserPassword: ResetUserPasswordResponse;
  updateUser: UpdateUserResponse;
  updateUserGroup: UpdateUserGroupResponse;
  /**  암호 변경 */
  updateUserPassword: Scalars['Boolean']['output'];
  updateUserRole: UpdateUserRoleResponse;
};


export type MutationAssociateUserRoleArgs = {
  append?: InputMaybe<Array<Scalars['ID']['input']>>;
  id: Scalars['ID']['input'];
  remove?: InputMaybe<Array<Scalars['ID']['input']>>;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserGroupArgs = {
  input: CreateUserGroupInput;
};


export type MutationCreateUserRoleArgs = {
  input: CreateUserRoleInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationJoinUserArgs = {
  input: JoinUserInput;
};


export type MutationResetUserPasswordArgs = {
  input: ResetUserPasswordInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};


export type MutationUpdateUserGroupArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserGroupInput;
};


export type MutationUpdateUserPasswordArgs = {
  id: Scalars['ID']['input'];
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationUpdateUserRoleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserRoleInput;
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
  /**  the total amount of elements. */
  page: Scalars['Int']['output'];
  /**  Current page number */
  size: Scalars['Int']['output'];
  /**  the number of total pages */
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  existsUser: ExistsUserResponse;
  profile: User;
  /**  사용자 조회 */
  user?: Maybe<User>;
  /**  그룹 조회 */
  userGroup: UserGroup;
  userGroups: UserGroupPaged;
  /**  권한 */
  userRole: UserRole;
  userRoles: UserRolePaged;
  users: UserPaged;
};


export type QueryExistsUserArgs = {
  input: ExistsUserInput;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserGroupArgs = {
  filter?: InputMaybe<UserGroupFilter>;
  id: Scalars['ID']['input'];
};


export type QueryUserGroupsArgs = {
  filter?: InputMaybe<UserGroupFilter>;
  pageable?: InputMaybe<UserGroupPageable>;
};


export type QueryUserRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserRolesArgs = {
  filter?: InputMaybe<UserRoleFilter>;
  pageable?: InputMaybe<UserRolePageable>;
};


export type QueryUsersArgs = {
  filter?: InputMaybe<UserFilter>;
  pageable?: InputMaybe<UserPageable>;
};

export type ResetUserPasswordError = Error & {
  __typename?: 'ResetUserPasswordError';
  errors?: Maybe<Array<Error>>;
  message: Scalars['String']['output'];
};

export type ResetUserPasswordInput = {
  cellphone: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type ResetUserPasswordResponse = DefaultError | User;

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

export type UpdateUserGroupInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
  properties?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateUserGroupResponse = {
  __typename?: 'UpdateUserGroupResponse';
  attributes?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type UpdateUserInput = {
  cellphones?: InputMaybe<Array<Scalars['String']['input']>>;
  email?: InputMaybe<Scalars['String']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  groupId?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  properties?: InputMaybe<JsonPropertyInput>;
  roles?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  telephones?: InputMaybe<Array<Scalars['String']['input']>>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserResponse = {
  __typename?: 'UpdateUserResponse';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  roles?: Maybe<Array<Maybe<Scalars['ID']['output']>>>;
  username: Scalars['String']['output'];
};

export type UpdateUserRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['ID']['input'];
  properties?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateUserRoleResponse = {
  __typename?: 'UpdateUserRoleResponse';
  attributes?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  cellphones?: Maybe<Array<Scalars['String']['output']>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['ID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  emailVerified: Scalars['Boolean']['output'];
  enabled: Scalars['Boolean']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  groups?: Maybe<Array<Maybe<UserGroup>>>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  properties?: Maybe<Scalars['JSON']['output']>;
  roles?: Maybe<Array<Maybe<UserRole>>>;
  telephones?: Maybe<Array<Scalars['String']['output']>>;
  username: Scalars['String']['output'];
};

/**  사용자 필터 */
export type UserFilter = {
  and?: InputMaybe<Array<UserFilter>>;
  division?: InputMaybe<StringCriteria>;
  email?: InputMaybe<StringCriteria>;
  enabled?: InputMaybe<BooleanCriteria>;
  firstName?: InputMaybe<StringCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  lastName?: InputMaybe<StringCriteria>;
  name?: InputMaybe<StringCriteria>;
  not?: InputMaybe<UserFilter>;
  or?: InputMaybe<Array<UserFilter>>;
  unit?: InputMaybe<StringCriteria>;
  username?: InputMaybe<StringCriteria>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  attributes?: Maybe<Scalars['JSON']['output']>;
  /**     parent: GroupParentQueryResponse, */
  children: Array<UserGroup>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  users?: Maybe<Array<Maybe<User>>>;
};

export type UserGroupChildQueryResponse = {
  __typename?: 'UserGroupChildQueryResponse';
  attributes?: Maybe<Scalars['JSON']['output']>;
  children: Array<Maybe<UserGroupChildQueryResponse>>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type UserGroupFilter = {
  and?: InputMaybe<Array<UserGroupFilter>>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UserGroupFilter>;
  or?: InputMaybe<Array<UserGroupFilter>>;
};

export type UserGroupPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<UserGroupSort>>;
};

export type UserGroupPaged = {
  __typename?: 'UserGroupPaged';
  items: Array<UserGroup>;
  pageInfo: PaginationInfo;
};

export type UserGroupParentQueryResponse = {
  __typename?: 'UserGroupParentQueryResponse';
  ancestors: Array<Maybe<UserGroupParentQueryResponse>>;
  attributes?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<UserGroupParentQueryResponse>;
  path: Scalars['String']['output'];
};

export enum UserGroupSort {
  CreatedAtAsc = 'CreatedAtAsc',
  CreatedAtDesc = 'CreatedAtDesc',
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc'
}

export type UserPageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<UserSort>>;
};

export type UserPaged = {
  __typename?: 'UserPaged';
  items: Array<User>;
  pageInfo: PaginationInfo;
};

export type UserRole = {
  __typename?: 'UserRole';
  attributes?: Maybe<Scalars['JSON']['output']>;
  composite: Scalars['Boolean']['output'];
  composites: Array<Maybe<UserRole>>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserRoleFilter = {
  and?: InputMaybe<Array<UserRoleFilter>>;
  enabled?: InputMaybe<BooleanCriteria>;
  id?: InputMaybe<SimpleCriteria>;
  name?: InputMaybe<SimpleCriteria>;
  not?: InputMaybe<UserRoleFilter>;
  or?: InputMaybe<Array<UserRoleFilter>>;
};

export type UserRolePageable = {
  page?: Scalars['Int']['input'];
  size?: Scalars['Int']['input'];
  sort?: InputMaybe<Array<UserRoleSort>>;
};

export type UserRolePaged = {
  __typename?: 'UserRolePaged';
  items: Array<UserRole>;
  pageInfo: PaginationInfo;
};

export enum UserRoleSort {
  NameAsc = 'NameAsc',
  NameDesc = 'NameDesc'
}

export enum UserSort {
  CreatedAtAsc = 'CreatedAtAsc',
  CreatedAtDesc = 'CreatedAtDesc',
  EmailAsc = 'EmailAsc',
  EmailDesc = 'EmailDesc',
  FirstNameAsc = 'FirstNameAsc',
  FirstNameDesc = 'FirstNameDesc',
  LastNameAsc = 'LastNameAsc',
  LastNameDesc = 'LastNameDesc',
  UsernameAsc = 'UsernameAsc',
  UsernameDesc = 'UsernameDesc'
}

export type WithJsonProperty = {
  properties?: Maybe<Scalars['JSON']['output']>;
};

export type WithSimpleTags = {
  tags: Array<Maybe<SimpleTagValue>>;
};

export type UsersetJoinUserMutationVariables = Exact<{
  input: JoinUserInput;
}>;


export type UsersetJoinUserMutation = { __typename?: 'Mutation', joinUser: { __typename: 'DefaultError', message: string } | { __typename: 'User', username: string } };

export type UsersetUpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UsersetUpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UpdateUserResponse', id: string } };

export type UsersetUpdatePasswordMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  oldPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type UsersetUpdatePasswordMutation = { __typename?: 'Mutation', updateUserPassword: boolean };

export type UsersetResetUserPasswordMutationVariables = Exact<{
  input: ResetUserPasswordInput;
}>;


export type UsersetResetUserPasswordMutation = { __typename?: 'Mutation', resetUserPassword: { __typename?: 'DefaultError', message: string } | { __typename?: 'User', username: string } };

export type UsersetUserGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersetUserGroupsQuery = { __typename?: 'Query', userGroups: { __typename?: 'UserGroupPaged', items: Array<{ __typename?: 'UserGroup', id: string, name: string }> } };

export type UsersetProfileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UsersetProfileQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, username: string, firstName?: string | null, cellphones?: Array<string> | null, telephones?: Array<string> | null, email?: string | null, enabled: boolean, properties?: any | null } | null };


export const UsersetJoinUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsersetJoinUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinUserInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UsersetJoinUserMutation, UsersetJoinUserMutationVariables>;
export const UsersetUpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsersetUpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UsersetUpdateUserMutation, UsersetUpdateUserMutationVariables>;
export const UsersetUpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsersetUpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword"}}}]}]}}]} as unknown as DocumentNode<UsersetUpdatePasswordMutation, UsersetUpdatePasswordMutationVariables>;
export const UsersetResetUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsersetResetUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetUserPasswordInput"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Error"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]} as unknown as DocumentNode<UsersetResetUserPasswordMutation, UsersetResetUserPasswordMutationVariables>;
export const UsersetUserGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersetUserGroups"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<UsersetUserGroupsQuery, UsersetUserGroupsQueryVariables>;
export const UsersetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UsersetProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"api"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"StringValue","value":"userset","block":false}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"cellphones"}},{"kind":"Field","name":{"kind":"Name","value":"telephones"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"properties"}}]}}]}}]} as unknown as DocumentNode<UsersetProfileQuery, UsersetProfileQueryVariables>;