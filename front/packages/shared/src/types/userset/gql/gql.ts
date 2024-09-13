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
    "\n    mutation UsersetJoinUser($input:JoinUserInput!) @api(name: \"userset\") {\n        joinUser (input: $input) {\n            __typename\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n    \n    mutation UsersetUpdateUser($id:ID!, $input:UpdateUserInput!) @api(name: \"userset\") {\n        updateUser (id: $id,input: $input) {\n            id\n        }\n    }\n\n    mutation UsersetUpdatePassword($id:ID!, $oldPassword:String!, $newPassword:String!) @api(name: \"userset\") {\n        updateUserPassword (\n            id: $id,\n            oldPassword: $oldPassword\n            newPassword: $newPassword\n        )\n    }\n\n    mutation UsersetResetUserPassword($input:ResetUserPasswordInput!) @api(name: \"userset\") {\n        resetUserPassword (input: $input) {\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n": types.UsersetJoinUserDocument,
    "\n    query UsersetUserGroups @api(name: \"userset\") {\n        userGroups {\n            items {\n                id\n                name\n            }\n        }\n    }\n    \n    query UsersetProfile($id: ID!) @api(name: \"userset\") {\n        user(id: $id) {\n            id\n            username\n            firstName\n            cellphones\n            telephones\n            email\n            enabled\n            properties\n        }\n    }\n    \n": types.UsersetUserGroupsDocument,
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
export function graphql(source: "\n    mutation UsersetJoinUser($input:JoinUserInput!) @api(name: \"userset\") {\n        joinUser (input: $input) {\n            __typename\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n    \n    mutation UsersetUpdateUser($id:ID!, $input:UpdateUserInput!) @api(name: \"userset\") {\n        updateUser (id: $id,input: $input) {\n            id\n        }\n    }\n\n    mutation UsersetUpdatePassword($id:ID!, $oldPassword:String!, $newPassword:String!) @api(name: \"userset\") {\n        updateUserPassword (\n            id: $id,\n            oldPassword: $oldPassword\n            newPassword: $newPassword\n        )\n    }\n\n    mutation UsersetResetUserPassword($input:ResetUserPasswordInput!) @api(name: \"userset\") {\n        resetUserPassword (input: $input) {\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n"): (typeof documents)["\n    mutation UsersetJoinUser($input:JoinUserInput!) @api(name: \"userset\") {\n        joinUser (input: $input) {\n            __typename\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n    \n    mutation UsersetUpdateUser($id:ID!, $input:UpdateUserInput!) @api(name: \"userset\") {\n        updateUser (id: $id,input: $input) {\n            id\n        }\n    }\n\n    mutation UsersetUpdatePassword($id:ID!, $oldPassword:String!, $newPassword:String!) @api(name: \"userset\") {\n        updateUserPassword (\n            id: $id,\n            oldPassword: $oldPassword\n            newPassword: $newPassword\n        )\n    }\n\n    mutation UsersetResetUserPassword($input:ResetUserPasswordInput!) @api(name: \"userset\") {\n        resetUserPassword (input: $input) {\n            ... on User {\n                username\n            }\n            ... on Error {\n                message\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query UsersetUserGroups @api(name: \"userset\") {\n        userGroups {\n            items {\n                id\n                name\n            }\n        }\n    }\n    \n    query UsersetProfile($id: ID!) @api(name: \"userset\") {\n        user(id: $id) {\n            id\n            username\n            firstName\n            cellphones\n            telephones\n            email\n            enabled\n            properties\n        }\n    }\n    \n"): (typeof documents)["\n    query UsersetUserGroups @api(name: \"userset\") {\n        userGroups {\n            items {\n                id\n                name\n            }\n        }\n    }\n    \n    query UsersetProfile($id: ID!) @api(name: \"userset\") {\n        user(id: $id) {\n            id\n            username\n            firstName\n            cellphones\n            telephones\n            email\n            enabled\n            properties\n        }\n    }\n    \n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;