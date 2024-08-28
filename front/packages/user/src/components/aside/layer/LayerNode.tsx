import React from 'react';
import {
    LayersetAssetBasicFragment, LayersetDeleteAssetDocument,
    LayersetGroupListWithAssetDocument,
    LayersetUpdateAssetDocument
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {TreeNodeProps} from "@/components/aside/layer/TreeNode.tsx";
import {useMutation} from "@apollo/client";
import {LayerAsset} from "@/types/layerset/gql/graphql.ts";

const nodeModelIdToString = (id: string | number): string => {
    return typeof id === 'string' ? id : id.toString();
}

const LayerNode = ({node, params }: TreeNodeProps) => {
    const asset = node.data as LayersetAssetBasicFragment;
    // console.log("layer node");
    // console.log(asset);
    // console.log("layer node");

    const [updateAssetMutation] = useMutation(LayersetUpdateAssetDocument, {
        refetchQueries: [LayersetGroupListWithAssetDocument]
    });

    const [deleteAssetMutation] = useMutation(LayersetDeleteAssetDocument, {
        refetchQueries: [LayersetGroupListWithAssetDocument]
    });

    const toggleVisible = () => {
        return updateAssetMutation({
            variables: {
                id: asset.id,
                input: {
                    visible: !asset.visible
                }
            }
        });
    };

    const toggleEnable = () => {
        return updateAssetMutation({
            variables: {
                id: asset.id,
                input: {
                    enabled: !asset.enabled
                }
            }
        });
    };

    const deleteLayer = () => {
        if (!confirm('레이어를 삭제하시겠습니까?')) return;
        return deleteAssetMutation({
            variables: {ids: nodeModelIdToString(node.id)}
        });
    }

    return (
        <div className="layer-node-container">
            <span className="type type-3d"></span>
            <span className="layer-name">{node.text}</span>
            <div className="layer-button">
                <button type="button" className="layer-funtion-button not-visible"></button>
                {/*<label className="switch">*/}
                {/*    <input type="checkbox" onChange={toggleVisible} checked={(node.data as LayerAsset).visible ?? false}/>*/}
                {/*    <span className="slider"></span>*/}
                {/*</label>*/}
                <button type="button" className="layer-funtion-button map-view"></button>
                <button onClick={deleteLayer} type="button" className="layer-funtion-button delete"></button>
            </div>
        </div>
    )
}


export default LayerNode;