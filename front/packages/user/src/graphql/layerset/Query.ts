import gql from "graphql-tag";

export const GET_USERLAYERGROUPS = gql `
    query GET_USERLAYERGROUPS{
    userGroups
    (
    filter: {
        parentId: {
            isNull: true
        }
    })
    {
        groupId
        name
        description
        collapsed
        order
        parent {
            groupId
            name
            description
            collapsed
            order
        }
        children {
            groupId
            name
            description
            collapsed
            order
            assets {
                assetId
                type
                name
                order
                visible
                # properties
            }
        }
        assets {
            assetId
            type
            name
            order
            visible
            properties
            createdBy
        }
    }
}
`

export const GET_LAYERGROUPS = gql `
    query GET_LAYERGROUPS{
        groups(
            filter: { }
        )
        {
            id
            name
            description
            enabled
            published
            collapsed
            access
            order
            assets {
                id
                name
                description
                type
                enabled
                visible
                order
                access
                createdAt
                updatedAt
                logs {
                    id
                    assetId
                    type
                    content
                }
            }
        }
    }
`;

export const GET_ASSET = gql `
    query GET_ASSET($id: ID!){
        asset(
            id : $id
        )
        {
            id
            name
            description
            type
            enabled
            visible
            access
            createdBy
            createdAt
            updatedBy
            updatedAt
            properties
        }
    }
`;