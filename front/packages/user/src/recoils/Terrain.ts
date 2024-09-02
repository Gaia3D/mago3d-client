import {atom} from "recoil";
import {NodeModel} from "@minoru/react-dnd-treeview";
import {Maybe, TerrainAsset} from "../../../../../../mnd-milmap/front/packages/shared/src/types/layerset/gql/graphql.ts";

export const TerrainNodeModelsState = atom<NodeModel[]>({
    key: 'TerrainNodeModelsState',
    default: []
});

export const UserTerrainState = atom<Maybe<TerrainAsset>[]>({
    key: 'UserTerrainState',
    default: []
});

export const UserTerrainGroupsState = atom<Maybe<TerrainAsset>[]>({
    key: 'UserTerrainGroupsState',
    default: []
});

export const TerrainUrlState = atom<string>({
    key: 'TerrainUrlState',
    default: ''
});

export const TerrainIdState = atom<string>({
    key: 'TerrainIdState',
    default: ''
});