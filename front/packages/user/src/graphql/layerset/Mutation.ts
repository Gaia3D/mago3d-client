import gql from "graphql-tag";

export const CREATE_LAYERGROUP = gql`
    mutation CREATE_LAYERGROUP($input:CreateGroupInput!) {
        createGroup (
            input: $input
        )
        {
            id
            name
            description
            enabled
            published
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }
`;

export const UPDATE_LAYERGROUP = gql`
    mutation UPDATE_LAYERGROUP($id:ID!, $input: UpdateGroupInput!) {
        updateGroup (
            id: $id
            input: $input
        )
        {
            id
            name
            description
            enabled
            published
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }
`;

export const DELETE_LAYERGROUP = gql`
    mutation DELETE_LAYERGROUP($id:ID!) {
        deleteGroup (
            ids: [$id]
        )
    }
`;

export const CREATE_LAYERASSET = gql`
    mutation CREATE_LAYERASSET($input:CreateAssetInput!) {
        createAsset (
            input: $input
        )
        {
            id
            name
        }
    }
`;

export const UPDATE_LAYERASSET = gql`
    mutation UPDATE_LAYERASSET($id:ID!, $input: UpdateAssetInput!) {
        updateAsset (
            id: $id
            input: $input
        )
        {
            id
            name
            description
            order
            type
            enabled
            visible
            access
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }
`;

export const LOCATE_GROUP = gql`
    mutation LOCATE_GROUP($id:ID!, $input: LocateGroupInput!) {
        locateGroup (
            id: $id
            input: $input
        )
        {
            id
        }
    }
`;

export const LOCATE_ASSET = gql`
    mutation LOCATE_ASSET($input: LocateAssetInput!) {
        locateAsset (
            input: $input
        )
        {
            id
        }
    }
`;

export const DELETE_ASSET = gql`
    mutation DELETE_ASSET($ids:ID!) {
        deleteAsset (
            ids: [$ids]
        )
    }
`;

export const RESTORE_USERLAYER = gql`
    mutation RESTORE_USERLAYER {
        saveUserLayer  
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
                    createdBy
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
`;

export const SAVE_USERLAYER = gql`
    mutation SAVE_USERLAYER($input: [CreateUserGroupInput]!) {
        saveUserLayer (
            input: $input
        ) 
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
            }
        }
    }
`;