import React, {useEffect, useRef, useState} from "react";
import {AsideDisplayProps} from "@/components/AsidePanel.tsx";
import {DatasetAssetListDocument} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {
    LayersetAssetBasicFragment, LayersetAssetBasicFragmentDoc,
    LayersetGroupBasicFragment,
    LayersetGroupBasicFragmentDoc,
    LayersetGroupListWithAssetDocument, LayersetGroupListWithAssetQuery,
    LayersetLocateAssetDocument, LayersetLocateGroupDocument, LayersetUpdateAssetDocument, LayersetUpdateGroupDocument
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {DndProvider, getBackendOptions, MultiBackend, NodeModel, Tree} from "@minoru/react-dnd-treeview";
import {RenderParams} from "@minoru/react-dnd-treeview/dist/types";
import {FragmentType, useFragment} from "@/types/layerset/gql";
import GroupNode from "@/components/aside/layer/GroupNode.tsx";
import TreeNode from "@/components/aside/layer/TreeNode.tsx";

/**
 * 그룹 정렬
 * @param left
 * @param right
 */

const layerGroupToNodeModel = (group: LayersetGroupBasicFragment): NodeModel => {
    return {
        id: group.id,
        text: group.name??'',
        droppable: true,
        parent: 0,
        data: group,
    };
}

const layerAssetToNodeModel = (parentId: string, asset: LayersetAssetBasicFragment): NodeModel => {
    return {
        id: asset.id,
        text: asset.name??'',
        droppable: false,
        parent: parentId,
        data: asset
    };
}

const groupSortByOrder = (left: FragmentType<typeof LayersetGroupBasicFragmentDoc>, right: FragmentType<typeof LayersetGroupBasicFragmentDoc>) => {
    const order1 = useFragment(LayersetGroupBasicFragmentDoc, left).order;
    const order2 = useFragment(LayersetGroupBasicFragmentDoc, right).order;
    return order1 - order2;
}

const layerGroupsToNodeModels = (data: LayersetGroupListWithAssetQuery): NodeModel[] => {
    //그룹 정렬
    const groups = Array.from(data.groups)
        .sort(groupSortByOrder);

    // Tree 노드로 변환
    return groups.reduce((result, current) => {
        const group = useFragment(LayersetGroupBasicFragmentDoc, current);
        if (!group || !current) return result;

        result.push(layerGroupToNodeModel(group));
        const children = current.assets
            .map((asset) => useFragment(LayersetAssetBasicFragmentDoc, asset))
            .map((asset) => layerAssetToNodeModel(group.id, asset));
        result.push(...children);
        return result;
    }, [] as NodeModel[]);
}

export const AsideLayers: React.FC<AsideDisplayProps>  = ({display}) => {

    const mutationOptions = {
        refetchQueries: [LayersetGroupListWithAssetDocument]
    };

    const [updateGroupMutation] = useMutation(LayersetUpdateGroupDocument, mutationOptions);
    const [updateAssetMutation] = useMutation(LayersetUpdateAssetDocument, mutationOptions);
    const [locateGroupMutation] = useMutation(LayersetLocateGroupDocument, mutationOptions);
    const [locateAssetMutation] = useMutation(LayersetLocateAssetDocument, mutationOptions);

    const [treeData, setTreeData] = useState<NodeModel[]>([]);
    const [initialOpen, setInitialOpen] = useState<string[] | number[]>([]);
    const {data} = useSuspenseQuery(LayersetGroupListWithAssetDocument);
    const treeRef = useRef(null);

    useEffect(() => {
        const initOpen = data.groups
            .map((group) => useFragment(LayersetGroupBasicFragmentDoc, group))
            .filter((group) => !group?.collapsed)
            .map((group) => group?.id?? '');
        setInitialOpen(initOpen);
        setTreeData(layerGroupsToNodeModels(data));

    }, [data]);

    console.log(treeData);


  return (
      <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
          <input type="checkbox" id="toggleButton"/>
          <div className="side-bar">
              <div className="side-bar-header">
                  <label htmlFor="toggleButton">
                      <button type="button" className="button side">
                          <div className="description--content">
                              <div className="title">Close sidebar</div>
                          </div>
                      </button>
                  </label>
                  <button type="button" className="button search"></button>
              </div>
              <div className="content--wrapper">
                  <ul className="layer">
                      <li className="selected"><a href="#">Terrain</a></li>
                  </ul>
                  <ul className="layer-list">
                      <li>
                          <span className="type type-terrain"></span>
                          <span className="name">Ellipsoid Terrain (Default)</span>
                      </li>
                  </ul>
                  <ul className="layer">
                      <li className="selected"><a href="#">Tileset</a></li>
                      <li><a href="#">Primitives</a></li>
                      <li><a href="#">Entities</a></li>
                      <li className="button-area">
                          <div className="layer-button">
                              <button type="button" className="layer-funtion-button not-visible"></button>
                              <button type="button" className="layer-funtion-button map-view"></button>
                              <button type="button" className="layer-funtion-button delete"></button>
                          </div>
                      </li>
                  </ul>
                  <div className="layer-scroll">
                      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                          <Tree
                              ref={treeRef}
                              tree={treeData}
                              rootId={0}
                              classes={{container: 'layer-list',}}
                              initialOpen={initialOpen}
                              sort={false}
                              canDrop={(tree, {dragSource, dropTargetId, dropTarget}) => {
                                  if (
                                      (dragSource?.parent === 0 && dropTarget === undefined)
                                      || (dragSource?.parent === dropTargetId)
                                  ) {
                                      return true;
                                  } else if (
                                      (dragSource?.parent === 0 && dropTarget?.parent === 0)
                                  ) {
                                      return false;
                                  }
                              }}
                              render={(node, params) => <TreeNode node={node} params={params}/>}
                              onDrop={()=>{
                                  console.log("drop")}}
                          />
                      </DndProvider>
                  </div>
              </div>
          </div>
      </div>
  );
};
