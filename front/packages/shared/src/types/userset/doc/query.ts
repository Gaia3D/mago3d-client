import {gql} from "graphql-tag";

gql`
    query UsersetUserGroups @api(name: "userset") {
        userGroups {
            items {
                id
                name
            }
        }
    }
    
    query UsersetProfile($id: ID!) @api(name: "userset") {
        user(id: $id) {
            id
            username
            firstName
            cellphones
            telephones
            email
            enabled
            properties
        }
    }
    
`