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
    "mutation DatasetCreateProcess($input: CreateProcessInput!) @api(name: dataset) {\n  createProcess(input: $input) {\n    id\n    status\n    createdAt\n    createdBy\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetCreateGroup($input: CreateGroupInput!) @api(name: dataset) {\n  createGroup(input: $input) {\n    id\n    parentId\n    name\n    description\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetUpdateGroup($id: ID!, $input: UpdateGroupInput!) @api(name: dataset) {\n  updateGroup(id: $id, input: $input) {\n    id\n  }\n}\n\nmutation DatasetDeleteGroup($id: ID!) @api(name: dataset) {\n  deleteGroup(id: $id)\n}\n\nmutation DatasetCreateAsset($input: CreateAssetInput!) @api(name: dataset) {\n  createAsset(input: $input) {\n    id\n  }\n}\n\nmutation DatasetUpdateAsset($id: ID!, $input: UpdateAssetInput!) @api(name: dataset) {\n  updateAsset(id: $id, input: $input) {\n    id\n    name\n  }\n}\n\nmutation DatasetDeleteAsset($id: ID!) @api(name: dataset) {\n  deleteAsset(id: $id)\n}\n\nmutation DatasetDeleteAssetFile($id: ID!, $fileId: [ID]!) @api(name: dataset) {\n  deleteAssetFile(id: $id, fileId: $fileId)\n}": types.DatasetCreateProcessDocument,
    "fragment DatasetAssetFile on AssetFile {\n  id\n  filename\n  contentSize\n  contentType\n}\n\nquery DatasetAssetList($filter: AssetFilterInput, $pageable: AssetPageableInput) @api(name: dataset) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      name\n      assetType\n      enabled\n      access\n      status\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetGroupList @api(name: dataset) {\n  groups(\n    filter: {enabled: {eq: true}}\n    pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}\n  ) {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetGroupListForUpdate($id: ID!) @api(name: dataset) {\n  group(id: $id) {\n    id\n    name\n    description\n    assets {\n      id\n      name\n      assetType\n      createdAt\n    }\n  }\n}\n\nquery DatasetAssetForDetail($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      ...DatasetAssetFile\n    }\n    process {\n      id\n      status\n    }\n  }\n}\n\nquery DatasetAssetForUpdate($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      filename\n      createdAt\n    }\n  }\n  groups {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetAssetForLayer($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n    files {\n      id\n      createdAt\n      createdBy\n      updatedAt\n      updatedBy\n    }\n  }\n}\n\nquery DatasetProcessLog($assetId: ID!) @api(name: dataset) {\n  processes(filter: {assetId: {eq: $assetId}}) {\n    items {\n      id\n      name\n      status\n      tasks {\n        id\n        error\n        stacktrace\n      }\n      createdAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetProcess($id: ID!) @api(name: dataset) {\n  process(id: $id) {\n    id\n    name\n    status\n    context\n    tasks {\n      id\n      status\n      stacktrace\n      error\n    }\n    createdBy\n    createdAt\n    updatedBy\n    updatedAt\n    properties\n  }\n}": types.DatasetAssetFileFragmentDoc,
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
export function graphql(source: "mutation DatasetCreateProcess($input: CreateProcessInput!) @api(name: dataset) {\n  createProcess(input: $input) {\n    id\n    status\n    createdAt\n    createdBy\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetCreateGroup($input: CreateGroupInput!) @api(name: dataset) {\n  createGroup(input: $input) {\n    id\n    parentId\n    name\n    description\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetUpdateGroup($id: ID!, $input: UpdateGroupInput!) @api(name: dataset) {\n  updateGroup(id: $id, input: $input) {\n    id\n  }\n}\n\nmutation DatasetDeleteGroup($id: ID!) @api(name: dataset) {\n  deleteGroup(id: $id)\n}\n\nmutation DatasetCreateAsset($input: CreateAssetInput!) @api(name: dataset) {\n  createAsset(input: $input) {\n    id\n  }\n}\n\nmutation DatasetUpdateAsset($id: ID!, $input: UpdateAssetInput!) @api(name: dataset) {\n  updateAsset(id: $id, input: $input) {\n    id\n    name\n  }\n}\n\nmutation DatasetDeleteAsset($id: ID!) @api(name: dataset) {\n  deleteAsset(id: $id)\n}\n\nmutation DatasetDeleteAssetFile($id: ID!, $fileId: [ID]!) @api(name: dataset) {\n  deleteAssetFile(id: $id, fileId: $fileId)\n}"): (typeof documents)["mutation DatasetCreateProcess($input: CreateProcessInput!) @api(name: dataset) {\n  createProcess(input: $input) {\n    id\n    status\n    createdAt\n    createdBy\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetCreateGroup($input: CreateGroupInput!) @api(name: dataset) {\n  createGroup(input: $input) {\n    id\n    parentId\n    name\n    description\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n  }\n}\n\nmutation DatasetUpdateGroup($id: ID!, $input: UpdateGroupInput!) @api(name: dataset) {\n  updateGroup(id: $id, input: $input) {\n    id\n  }\n}\n\nmutation DatasetDeleteGroup($id: ID!) @api(name: dataset) {\n  deleteGroup(id: $id)\n}\n\nmutation DatasetCreateAsset($input: CreateAssetInput!) @api(name: dataset) {\n  createAsset(input: $input) {\n    id\n  }\n}\n\nmutation DatasetUpdateAsset($id: ID!, $input: UpdateAssetInput!) @api(name: dataset) {\n  updateAsset(id: $id, input: $input) {\n    id\n    name\n  }\n}\n\nmutation DatasetDeleteAsset($id: ID!) @api(name: dataset) {\n  deleteAsset(id: $id)\n}\n\nmutation DatasetDeleteAssetFile($id: ID!, $fileId: [ID]!) @api(name: dataset) {\n  deleteAssetFile(id: $id, fileId: $fileId)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "fragment DatasetAssetFile on AssetFile {\n  id\n  filename\n  contentSize\n  contentType\n}\n\nquery DatasetAssetList($filter: AssetFilterInput, $pageable: AssetPageableInput) @api(name: dataset) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      name\n      assetType\n      enabled\n      access\n      status\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetGroupList @api(name: dataset) {\n  groups(\n    filter: {enabled: {eq: true}}\n    pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}\n  ) {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetGroupListForUpdate($id: ID!) @api(name: dataset) {\n  group(id: $id) {\n    id\n    name\n    description\n    assets {\n      id\n      name\n      assetType\n      createdAt\n    }\n  }\n}\n\nquery DatasetAssetForDetail($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      ...DatasetAssetFile\n    }\n    process {\n      id\n      status\n    }\n  }\n}\n\nquery DatasetAssetForUpdate($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      filename\n      createdAt\n    }\n  }\n  groups {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetAssetForLayer($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n    files {\n      id\n      createdAt\n      createdBy\n      updatedAt\n      updatedBy\n    }\n  }\n}\n\nquery DatasetProcessLog($assetId: ID!) @api(name: dataset) {\n  processes(filter: {assetId: {eq: $assetId}}) {\n    items {\n      id\n      name\n      status\n      tasks {\n        id\n        error\n        stacktrace\n      }\n      createdAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetProcess($id: ID!) @api(name: dataset) {\n  process(id: $id) {\n    id\n    name\n    status\n    context\n    tasks {\n      id\n      status\n      stacktrace\n      error\n    }\n    createdBy\n    createdAt\n    updatedBy\n    updatedAt\n    properties\n  }\n}"): (typeof documents)["fragment DatasetAssetFile on AssetFile {\n  id\n  filename\n  contentSize\n  contentType\n}\n\nquery DatasetAssetList($filter: AssetFilterInput, $pageable: AssetPageableInput) @api(name: dataset) {\n  assets(filter: $filter, pageable: $pageable) {\n    items {\n      id\n      name\n      assetType\n      enabled\n      access\n      status\n      createdAt\n      updatedAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetGroupList @api(name: dataset) {\n  groups(\n    filter: {enabled: {eq: true}}\n    pageable: {page: 0, size: 1000, sort: CREATED_AT_DESC}\n  ) {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetGroupListForUpdate($id: ID!) @api(name: dataset) {\n  group(id: $id) {\n    id\n    name\n    description\n    assets {\n      id\n      name\n      assetType\n      createdAt\n    }\n  }\n}\n\nquery DatasetAssetForDetail($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      ...DatasetAssetFile\n    }\n    process {\n      id\n      status\n    }\n  }\n}\n\nquery DatasetAssetForUpdate($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    properties\n    groups {\n      id\n      name\n    }\n    files {\n      id\n      filename\n      createdAt\n    }\n  }\n  groups {\n    items {\n      id\n      name\n    }\n  }\n}\n\nquery DatasetAssetForLayer($id: ID!) @api(name: dataset) {\n  asset(id: $id) {\n    id\n    name\n    description\n    assetType\n    createdAt\n    createdBy\n    enabled\n    updatedAt\n    updatedBy\n    files {\n      id\n      createdAt\n      createdBy\n      updatedAt\n      updatedBy\n    }\n  }\n}\n\nquery DatasetProcessLog($assetId: ID!) @api(name: dataset) {\n  processes(filter: {assetId: {eq: $assetId}}) {\n    items {\n      id\n      name\n      status\n      tasks {\n        id\n        error\n        stacktrace\n      }\n      createdAt\n    }\n    pageInfo {\n      totalPages\n      totalItems\n      page\n      size\n    }\n  }\n}\n\nquery DatasetProcess($id: ID!) @api(name: dataset) {\n  process(id: $id) {\n    id\n    name\n    status\n    context\n    tasks {\n      id\n      status\n      stacktrace\n      error\n    }\n    createdBy\n    createdAt\n    updatedBy\n    updatedAt\n    properties\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;