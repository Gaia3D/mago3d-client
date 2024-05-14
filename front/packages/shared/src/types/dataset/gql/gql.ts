/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query dataGroups {\n  groups(pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}) {\n    __typename\n    items {\n      id\n      name\n      description\n      enabled\n      access\n      createdAt\n    }\n  }\n}\n\nquery dataAssets($filter: AssetFilterInput, $pageable: AssetPageableInput) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      groups {\n        id\n        name\n        description\n        enabled\n        access\n      }\n      name\n      description\n      assetType\n      enabled\n      access\n      createdBy\n      createdAt\n      updatedBy\n      updatedAt\n      process {\n        id\n        name\n        context\n        properties\n        status\n        tasks {\n          id\n          status\n          error\n          stacktrace\n        }\n      }\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}": types.DataGroupsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query dataGroups {\n  groups(pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}) {\n    __typename\n    items {\n      id\n      name\n      description\n      enabled\n      access\n      createdAt\n    }\n  }\n}\n\nquery dataAssets($filter: AssetFilterInput, $pageable: AssetPageableInput) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      groups {\n        id\n        name\n        description\n        enabled\n        access\n      }\n      name\n      description\n      assetType\n      enabled\n      access\n      createdBy\n      createdAt\n      updatedBy\n      updatedAt\n      process {\n        id\n        name\n        context\n        properties\n        status\n        tasks {\n          id\n          status\n          error\n          stacktrace\n        }\n      }\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}"): (typeof documents)["query dataGroups {\n  groups(pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}) {\n    __typename\n    items {\n      id\n      name\n      description\n      enabled\n      access\n      createdAt\n    }\n  }\n}\n\nquery dataAssets($filter: AssetFilterInput, $pageable: AssetPageableInput) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      groups {\n        id\n        name\n        description\n        enabled\n        access\n      }\n      name\n      description\n      assetType\n      enabled\n      access\n      createdBy\n      createdAt\n      updatedBy\n      updatedAt\n      process {\n        id\n        name\n        context\n        properties\n        status\n        tasks {\n          id\n          status\n          error\n          stacktrace\n        }\n      }\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;