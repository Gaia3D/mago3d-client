import gql from "graphql-tag";

export const GET_CATEGORIES = gql `
    query GET_CATEGORIES {
        categories {
            id
            code
            name
            description
            children {
                id
                code
                name
                description
                children {
                    id
                    code
                    name
                    description
                }
            }
        }
    }
`;

export const GET_PRODUCTS = gql `
    query GET_PRODUCTS ($filter:ProductFilterInput!, $page: Int!) {
        products (
            filter:$filter
            pageable: {
              page: $page
            }
        )
        {
          items {
            id
            type
            name
            date
            download
            downloadThumbnail
            downloadThumbnailTransparent
            filename
            bbox
            footprint
          }
          pageInfo {
            totalItems
            totalPages
            page
            size
          }
       }
    }
`;
export const GET_PRODUCT = gql `
    query GET_PRODUCT($id: ID!) {
    product(id: $id) {
      id
      type
      name
      date
      extension
      size
      download
      downloadThumbnail
      downloadThumbnailTransparent
      bbox
      footprint
      enabled
      imageYn
      satellite {
        id
        sensor
        acquisitionDate
        geogcs
        cloud
        multigrayCode
        bandCount
        bitCount
        xPixel
        yPixel
        xResolution
        yResolution
        secureAreaYn
        enabled
      }
      doyeop {
        id
        scaleCode
        doyeopKindCode
        doyeopNum
        doyeopName
        statusCode
        countryCode
        areaName
        paperVer
        digitalVer
        enabled
        printDate
      }
    }
  }
`