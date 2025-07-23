import {Maybe, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";

export interface AssetService {
  getAsset(href: string): Promise<Maybe<Scalars['JSON']['output']>>;
}
