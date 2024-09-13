import {gql} from "graphql-tag";

gql`
    mutation UsersetJoinUser($input:JoinUserInput!) @api(name: "userset") {
        joinUser (input: $input) {
            __typename
            ... on User {
                username
            }
            ... on Error {
                message
            }
        }
    }
    
    mutation UsersetUpdateUser($id:ID!, $input:UpdateUserInput!) @api(name: "userset") {
        updateUser (id: $id,input: $input) {
            id
        }
    }

    mutation UsersetUpdatePassword($id:ID!, $oldPassword:String!, $newPassword:String!) @api(name: "userset") {
        updateUserPassword (
            id: $id,
            oldPassword: $oldPassword
            newPassword: $newPassword
        )
    }

    mutation UsersetResetUserPassword($input:ResetUserPasswordInput!) @api(name: "userset") {
        resetUserPassword (input: $input) {
            ... on User {
                username
            }
            ... on Error {
                message
            }
        }
    }
`