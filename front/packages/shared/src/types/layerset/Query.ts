import gql from "graphql-tag";

export const GET_TERRAINS = gql `
    query Terrains {
        terrains {
            id
            name
            selected
            properties
        }
    }
    `;