import { GraphQLAssetService } from './graphql/AssetService.graphql';
import { RestAssetService } from './rest/AssetService.rest';
import {GraphQLLayerService} from "@src/layer-style/api/graphql/LayerService.graphql";

const API_MODE = import.meta.env.VITE_API_MODE ?? 'graphql';

export const ApiProvider = {
  asset: API_MODE === 'graphql' ? GraphQLAssetService : RestAssetService,
  layer: GraphQLLayerService, // restapi service 를 만들면 위처럼 변경
};
