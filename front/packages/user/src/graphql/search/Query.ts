
import gql from "graphql-tag";

export const BMKPT_SEARCH = gql `
    query BMKPT_SEARCH($filter:BmkptSearchFilter){
        bmkptSearch(
            filter: $filter
        )
        {
            items {
                id
                name
                lat
                lon
            }
        }
    }
`;

export const POI_SEARCH = gql `
    query POI_SEARCH($filter:PoiSearchFilter){
        poiSearch(
            filter: $filter
        )
        {
            items {
                id
                name
                lat
                lon
                addressParcel
                addressRoad
            }
        }
    }
`;

export const ADDRESS_SEARCH = gql `
    query ADDRESS_SEARCH($filter:AddressSearchFilter){
        addressSearch(
            filter: $filter
        )
        {
            items {
                id
                sidoName
                sggName
                emdName
                bldMnnm
                bldSlno
                roadName
                roadAddr
                lat
                lon
            }
        }
    }
`;

export const UNSPT_SEARCH = gql `
    query UNSPT_SEARCH($filter:UnsptSearchFilter){
        unsptSearch(
            filter: $filter
        )
        {
            items {
                id
                name
                lat
                lon
            }
        }
    }
`;


export const TRIPT_SEARCH = gql `
    query TRIPT_SEARCH($filter:TriptSearchFilter){
        triptSearch(
            filter: $filter
        )
        {
            items {
                id
                name
                lat
                lon
            }
        }
    }
`;

export const BOUNDARY_SEARH_SIDO = gql `
    query BOUNDARY_SEARH_SIDO {
      boundarySearch(code: "", size: 20) {
          total
          data {
              id
              code
              name
              minLat
              minLon
              maxLat
              maxLon
              centerLat
              centerLon
          }
      }
    }
`;


export const BOUNDARY_SEARH = gql `
    query BOUNDARY_SEARH($code: String!) {
      boundarySearch(code: $code, size: 500) {
          total
          data {
              id
              code
              name
              minLat
              minLon
              maxLat
              maxLon
              centerLat
              centerLon
          }
      }
    }
`;