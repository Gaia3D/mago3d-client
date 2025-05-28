import { GraphQLAssetService } from './graphql/AssetService.graphql';
import { RestAssetService } from './rest/AssetService.rest';

const API_MODE = import.meta.env.VITE_API_MODE ?? 'graphql';

export const ApiProvider = {
  asset: API_MODE === 'graphql' ? GraphQLAssetService : RestAssetService,
  // layer: ...
};
