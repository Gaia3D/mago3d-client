import {
    CreateUserGroupInput,
    Maybe,
    UserLayerAsset,
    UserLayerGroup
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {NodeModel} from "@minoru/react-dnd-treeview";

type CustomCreateUserGroupInput = CreateUserGroupInput & {
    linkId? : number;
}

export const getLayersFromNodeModels = (nodeModels:NodeModel[]) => {
    const sortList = nodeModels
        .filter((nodeModel:NodeModel) => nodeModel.parent === 0)
        .map((nodeModel:NodeModel) => nodeModel.id);

    const assets = nodeModels.filter((nodeModel:NodeModel) => nodeModel.parent !== 0)
        .sort((a,b) => sortList.indexOf(a.parent) - sortList.indexOf(b.parent))
        .map((nodeModel:NodeModel) => {
            const asset = nodeModel.data as UserLayerAsset;
            return asset;
        }).reverse();

    return assets;
}

const layerGroupToNodemodel = (groupId:number, layerGroup:UserLayerGroup):NodeModel => {
    const nodeModel = {
        id:groupId,
        text:layerGroup.name ?? '',
        droppable:true,
        parent:0,
        data:layerGroup
    }
    return nodeModel;
}

const layerAssetToNodemodel = (parendtId:number, assetId:number, layerAsset:UserLayerAsset):NodeModel => {
    const nodeModel = {
        id:assetId,
        text:layerAsset.name ?? '',
        droppable:false,
        parent:parendtId,
        data:layerAsset
    }
    return nodeModel;
}

export const layerGroupsToNodemodels = (layerGroups:Maybe<UserLayerGroup>[]):NodeModel[] => {

    const userLayerGroups = layerGroups.filter((layerGroup) => layerGroup !== null) as UserLayerGroup[];

    let index = 0;
    return userLayerGroups.sort((a,b)=>a.order! - b.order!).reduce((nodeModels, layerGroup) => {
        index = index + 1;
        const groupId = index;
        nodeModels.push(layerGroupToNodemodel(groupId, layerGroup));
        layerGroup.assets.forEach((asset:UserLayerAsset) => {
            index = index + 1;
            nodeModels.push(layerAssetToNodemodel(groupId, index, asset));
        });
        return nodeModels;
    }, [] as NodeModel[]);
}

export const nodeModelIdToNumber = (id: string | number):number => {
    return typeof id === 'string' ? Number(id) : id;
}

export const nodeModlesToCreateUserGroupInput = (nodeModels:NodeModel[]):CreateUserGroupInput[] => {
    return [...nodeModels].sort((a,b)=>nodeModelIdToNumber(a.parent) - nodeModelIdToNumber(b.parent)).reduce((createUserGroupInputs, nodeModel) => {
        if (nodeModel.parent === 0) {
            const layerGroup = nodeModel.data as UserLayerGroup;
            const {groupId, collapsed} = layerGroup;
            const createUserGroupInput:CustomCreateUserGroupInput = {
                groupId: groupId,
                collapsed: collapsed,
                assets:[],
                linkId:nodeModelIdToNumber(nodeModel.id)
            }
            createUserGroupInputs.push(createUserGroupInput);
        } else {
            const asset = nodeModel.data as UserLayerAsset;
            const {assetId, visible} = asset;
            const createUserGroupInput = createUserGroupInputs.find((createUserGroupInput) => createUserGroupInput.linkId === nodeModelIdToNumber(nodeModel.parent));
            if (!createUserGroupInput) {
                return createUserGroupInputs;
            }

            if (!createUserGroupInput.assets) createUserGroupInput.assets = [];

            createUserGroupInput.assets.push({
                assetId: assetId,
                visible: visible
            });

        }
        return createUserGroupInputs;
    }, [] as CustomCreateUserGroupInput[]).map((createUserGroupInput) => {
        delete createUserGroupInput.linkId;
        return createUserGroupInput;
    });
}
