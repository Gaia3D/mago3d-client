import {atom} from "recoil";
import {NodeModel} from "@minoru/react-dnd-treeview";
import {Maybe, TerrainAsset} from "../../../../../../mnd-milmap/front/packages/shared/src/types/layerset/gql/graphql.ts";

export const TerrainUrlState = atom<string>({
    key: 'TerrainUrlState',
    default: ''
});

export const TerrainIdState = atom<string>({
    key: 'TerrainIdState',
    default: ''
});