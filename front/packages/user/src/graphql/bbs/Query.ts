import gql from "graphql-tag";

export const GET_SYMBOLGROUPS = gql `
    query GET_SYMBOLGROUPS {
    symbolGroups (
        filter: {
            access : {
                eq : Public
            }
        }
    )
    {
        id
        name
        
    }
}
`
export const GET_FIRSTSYMBOL = gql `
    query GET_FIRSTSYMBOL($id: ID!) {
    symbols (
        filter: {
            groupId : {
                eq : $id
            }
        }
        pageable: {
            page: 0
            size: 1
        }
    )
    {
        items {
            id
            name
            files {
                id
                filename
                contentType
                download
                thumbnail {
                    filename
                    contentType
                    contentSize
                    download
                }
                width
                height
            }
        }
    }
}
`

export const GET_SYMBOLS = gql `
    query GET_SYMBOLS($id: ID!, $pageable: SymbolPageable) {
    symbols (
        filter: {
            groupId : {
                eq : $id
            }
        }
        pageable: $pageable
    )
    {
        items {
            id
            name
            files {
                id
                filename
                contentType
                download
                thumbnail {
                    filename
                    contentType
                    contentSize
                    download
                }
                width
                height
            }
        }
        pageInfo {
            totalPages
            totalItems
            page
            size
            hasNextPage
            hasPreviousPage
        }
    }
}
`

export const GET_MAPNOTES = gql `
    query GET_MAPNOTES($filter: MapNoteFilterInput, $pageable: MapNotePageable) {
    mapNotes (
        filter: $filter
        pageable: $pageable
    )
    {
        items {
            id
            title
            content
            drawGeometry
            geometryType
            cameraPosition
            orientation
            files {
                id
                filename
                contentType
                download
            }
            symbols {
                id
                name
                files {
                    id
                    filename
                    contentType
                    download
                    thumbnail {
                        filename
                        contentType
                        contentSize
                        download
                    }
                    width
                    height
                }
            }
        }
        pageInfo {
            totalItems
            totalPages
            page
            size
        }
    }
}
`

export const GET_MAPNOTES_ALL = gql `
    query GET_MAPNOTES_ALL {
    mapNotes (
        filter: {
            
        }
        pageable: {
            page: 0
            size: 100000
        }
    )
    {
        items {
            id
            title
            content
            drawGeometry
            geometryType
            cameraPosition
            orientation
            files {
                id
                filename
                contentType
                download
            }
            symbols {
                id
                name
                files {
                    id
                    filename
                    contentType
                    download
                    thumbnail {
                        filename
                        contentType
                        contentSize
                        download
                    }
                    width
                    height
                }
            }
        }
    }
}
`