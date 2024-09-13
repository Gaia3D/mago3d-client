import gql from "graphql-tag";

gql`
    mutation LayersetCreateGroup($input: CreateGroupInput!) @api(name: layerset) {
        createGroup(input: $input) {
            id
        }
    }

    mutation LayersetUpdateGroup($id:ID!, $input: UpdateGroupInput!) @api(name: layerset) {
        updateGroup (
            id: $id
            input: $input
        )
        {
            id
            name
            description
            enabled
            access
            published
            createdAt
            createdBy
            updatedAt
            updatedBy
        }
    }

    mutation LayersetDeleteGroup($id: ID!) @api(name: layerset) {
        deleteGroup (
            ids: [$id]
        )
    }


    mutation LayersetLocateGroup($id:ID!, $input: LocateGroupInput!) @api(name: layerset) {
        locateGroup (
            id: $id
            input: $input
        )
        {
            id
        }
    }

    mutation LayersetCreateAsset($input: CreateAssetInput!) @api(name: layerset) {
        createAsset(input: $input) {
            id
            name
            description
            enabled
            access
            status
            createdAt
            createdBy
            updatedAt
            updatedBy
            properties
        }
    }
    
    mutation LayersetAppendUserLayer ($input :AppendUserLayerInput!) @api(name: layerset) {
        appendUserLayer (
            input: $input
        )
    }

    mutation LayersetUpdateAsset($id:ID!, $input: UpdateAssetInput!) @api(name: layerset) {
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

    mutation LayersetDeleteAsset($ids:ID!) @api(name: layerset) {
        deleteAsset (
            ids: [$ids]
        )
    }

    mutation LayersetLocateAsset($input: LocateAssetInput!) @api(name: layerset) {
        locateAsset (input: $input) {
            id
        }
    }

    mutation LayersetReloadRemoteAsset($layerKey:String!) @api(name: layerset) {
        reloadRemoteAsset (
            layerKey: $layerKey
        )
    }
`

export const CREATE_LAYERGROUP = gql`
    mutation CREATE_LAYERGROUP($input:CreateGroupInput!) @api(name: layerset) {
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

export const RELOAD_REMOTE_ASSET = gql`
    mutation RELOAD_REMOTE_ASSET($layerKey:String!) {
        reloadRemoteAsset (
            layerKey: $layerKey
        )
    }
`;