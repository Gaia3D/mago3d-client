import React from 'react';
import {
    LayersetGroupBasicFragment,
    LayersetGroupListWithAssetDocument,
    LayersetUpdateGroupDocument
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useMutation} from "@apollo/client";
import {TreeNodeProps} from "@/components/aside/layer/TreeNode.tsx";

const GroupNode = ({node, params}: TreeNodeProps) => {
    // console.log(node);
    // console.log(params);
    const group = node.data as LayersetGroupBasicFragment;

    const [updateMutation] = useMutation(LayersetUpdateGroupDocument, {
        refetchQueries: [LayersetGroupListWithAssetDocument]
    });

    const toggleCollapse = () => {
        return updateMutation({
            variables: {
                id: group.id,
                input: {
                    collapsed: !group.collapsed
                }
            }
        });
    }

    return (
        <div className="group-node-container" onClick={toggleCollapse}>
            <div className="group-node">
                <div className="group-icon">G</div>
                <div className="group-name">{node.text}</div>
            </div>
        </div>
    )
}
export default GroupNode;