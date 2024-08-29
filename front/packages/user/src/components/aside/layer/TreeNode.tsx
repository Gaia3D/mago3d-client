import React from 'react';
import {NodeModel} from "@minoru/react-dnd-treeview";
import {RenderParams} from "@minoru/react-dnd-treeview/dist/types";
import GroupNode from "@/components/aside/layer/GroupNode.tsx";
import LayerNode from "@/components/aside/layer/LayerNode.tsx";

export type TreeNodeProps = {
    node: NodeModel,
    params: RenderParams
}

const TreeNode = (props: TreeNodeProps) => {
    const {data} = props.node as any;
    const typename = data?.__typename;
    if (typename === 'LayerAsset') {
        return <LayerNode {...props}/>
    } else if (typename === 'LayerGroup') {
        return <GroupNode {...props}/>
    } else {
        console.error('Unknown typename', typename);
    }
}

export default TreeNode;