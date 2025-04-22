import {LayerAttribute} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

export interface ProcessedFeature {
    id: string;
    name: string;
    properties: LayerAttribute[];
}
