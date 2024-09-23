import {DndProvider} from "react-dnd";
import {getBackendOptions, MultiBackend, NodeModel, Tree} from "@minoru/react-dnd-treeview";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {produce} from "immer";
import {classifyAssetTypeClassNameByLayerAssetType, getPublishStatusName} from "@src/api/Data";
import {useNavigate} from "react-router-dom";
import {
  LayerAccess,
  LayerAsset,
  LayerAssetType,
  LayersetAssetBasicFragment,
  LayersetAssetBasicFragmentDoc,
  LayersetDeleteAssetDocument,
  LayersetDeleteGroupDocument,
  LayersetGroupBasicFragment,
  LayersetGroupBasicFragmentDoc,
  LayersetGroupListWithAssetDocument,
  LayersetGroupListWithAssetQuery,
  LayersetLocateAssetDocument,
  LayersetLocateGroupDocument,
  LayersetUpdateAssetDocument,
  LayersetUpdateGroupDocument,
  LocateOption
} from "@src/generated/gql/layerset/graphql";
import {useFragment} from "@src/generated/gql/userset";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import CreatePopup from "../group/CreatePopup";
import {FragmentType} from "@src/generated/gql/layerset";
import {RenderParams} from "@minoru/react-dnd-treeview/dist/types";
import {useTranslation} from "react-i18next";

const LayerList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mutationOptions = {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  };

  const [updateGroupMutation] = useMutation(LayersetUpdateGroupDocument, mutationOptions);
  const [updateAssetMutation] = useMutation(LayersetUpdateAssetDocument, mutationOptions);
  const [locateGroupMutation] = useMutation(LayersetLocateGroupDocument, mutationOptions);
  const [locateAssetMutation] = useMutation(LayersetLocateAssetDocument, mutationOptions);

  const {data} = useSuspenseQuery(LayersetGroupListWithAssetDocument)

  const [onCreate, setOnCreate] = useState<boolean>(false);
  const [initialOpen, setInitialOpen] = useState<string[] | number[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [enable, setEnable] = useState(false);
  const [treeData, setTreeData] = useState<NodeModel[]>([]);

  const treeRef = useRef(null);
  const prevCollapsedRef = useRef(collapsed);

  useEffect(() => {
    const nodeModels = layerGroupsToNodeModels(data);

    const initOpen = nodeModels
      .filter((node: NodeModel) => !node.parent)
      //.map((group) => useFragment(LayersetGroupBasicFragmentDoc, group))
      .filter((group) => !group.data.collapsed)
      .map((group) => group.id);
    setInitialOpen(initOpen);
    setTreeData(nodeModels);

    if (prevCollapsedRef.current !== collapsed) {
      const tree = treeRef.current;
      if (collapsed) {
        tree.closeAll();
      } else {
        tree.openAll();
      }
      treeData
        .filter((node: NodeModel) => !node.parent)
        .forEach((node: NodeModel) => {
          updateGroup(node.data.id, {collapsed});
        });
      prevCollapsedRef.current = collapsed;
    }

  }, [data, collapsed]);

  const handleDrop = (newTree: NodeModel[], options) => {
    const {dragSource, dropTarget} = options;
    console.info('dragSource', dragSource);
    console.info('dropTarget', dropTarget);

    if (!dragSource) return;

    //LOCATE_GROUP
    if (dropTarget === undefined && dragSource.parent === 0) {
      const groups = newTree.filter((node: NodeModel) => !node.parent);
      const idx = groups.findIndex((group: NodeModel) => group.id === dragSource.id);
      const offsetGroup = groups[idx === 0 ? idx + 1 : idx - 1];
      const offsetGroupId = offsetGroup.data.id;
      const locateOption = idx === 0 ? LocateOption.Before : LocateOption.After;

      locateGroupMutation({
        variables: {
          id: dragSource.data.id,
          input: {target: nodeModelIdToString(offsetGroupId), option: locateOption}
        }
      });

    } else if (dropTarget) {
      if (dropTarget.id === dragSource.parent) {
        //같은 그룹 내에서 위치 변경
        const group = newTree.find((node: NodeModel) => node.id === dragSource.parent && !node.parent);
        const siblings = newTree.filter((node: NodeModel) => node.parent === dropTarget.id);
        //console.info(siblings);
        const idx = siblings.findIndex((node: NodeModel) => node.id === dragSource.id);
        //console.info(idx);
        let a = idx === 0 ? idx + 1 : idx - 1;
        if (a < 0) a = 0;
        if (a >= siblings.length) a = siblings.length - 1;
        const offsetAsset = siblings[a];
        //console.info(offsetAsset);
        const offsetAssetId = offsetAsset.data.id;
        //console.info(offsetAssetId);
        const locateOption = idx === 0 ? LocateOption.Before : LocateOption.After;
        //console.info(locateOption);
        locateAssetMutation({
          variables: {
            input:
              {
                target: {
                  groupId: nodeModelIdToString(group.data.id),
                  id: nodeModelIdToString(offsetAssetId)
                },
                source: {
                  groupId: nodeModelIdToString(group.data.id),
                  id: nodeModelIdToString(dragSource.data.id)
                },
                option: locateOption
              }
          }
        });
      } else {
        const siblings = newTree.filter((node: NodeModel) => node.parent === dropTarget.id);
        const idx = siblings.findIndex((node: NodeModel) => node.id === dragSource.id);
        //const offsetAsset = siblings[idx === 0 ? idx + 1 : idx - 1];
        let a = idx === 0 ? idx + 1 : idx - 1;
        if (a < 0) a = 0;
        if (a >= siblings.length) a = siblings.length - 1;
        const offsetAsset = siblings[a];
        const offsetAssetId = offsetAsset.data.id;
        const locateOption = idx === 0 ? LocateOption.Before : LocateOption.After;

        const offsetAssetGroup = newTree.find((node: NodeModel) => node.id === offsetAsset.parent);
        const dragSourceGroup = newTree.find((node: NodeModel) => node.id === dragSource.parent);

        locateAssetMutation({
          variables: {
            input:
              {
                target: {
                  //groupId: nodeModelIdToString(offsetAssetGroup.data.id),
                  id: nodeModelIdToString(offsetAssetGroup.data.id),
                },
                source: {
                  groupId: nodeModelIdToString(dragSourceGroup.data.id),
                  id: nodeModelIdToString(dragSource.data.id)
                },
                option: locateOption
              }
          }
        });

        /*
        const originalGroup = newTree.find((node: NodeModel) => node.id === dragSource.parent);
        const locateOption = LocateOption.LastChild;

        locateGroupMutation({
          variables: {
            input:
              {
                target: {
                  groupId: 0,
                  id: nodeModelIdToString(dropTarget.data.id)
                },
                source: {
                  groupId: nodeModelIdToString(originalGroup.data.id),
                  id: nodeModelIdToString(dragSource.data.id)
                },
                option: locateOption
              }
          }
        });
         */
      }
    }

    setTreeData(newTree);
  };

  const updateGroup = (id: string | number, input) => {
    return updateGroupMutation({
      variables: {id: nodeModelIdToString(id), input}
    });
  }

  const updateAsset = (id: string | number, input) => {
    return updateAssetMutation({
      variables: {id: nodeModelIdToString(id), input}
    });
  }

  const toggleVisibleAll = () => {
    setTreeData(produce((draft) => {
      for (let i = 0, len = draft.length; i < len; i++) {
        if (!draft[i].parent) continue;

        const data = (draft[i].data as LayerAsset);
        data.visible = !visible;
        updateAsset(data.id, {visible: !visible});
      }
    }));
    setVisible(!visible);
  }

  const toggleEnableAll = () => {
    setTreeData(produce((draft) => {
      for (let i = 0, len = draft.length; i < len; i++) {
        if (!draft[i].parent) continue;

        const data = (draft[i].data as LayerAsset);
        data.enabled = !enable;
        updateAsset(data.id, {enabled: !enable});
      }
    }));
    setEnable(!enable);
  }

  return (
    <Suspense fallback>
      <div className="contents">
        <h2>{t("layer-management")}</h2>
        <div className="layer-button mar-tm20 mar-b10">
          <button type="button" className="btn-basic" onClick={() => setOnCreate(true)}>{t("add-group")}</button>
          <button type="button" className="btn-basic" onClick={() => setCollapsed(!collapsed)}>{collapsed ? t("all-expand") : t("all-fold")}</button>
          <button type="button" className="btn-basic" onClick={toggleVisibleAll}>{!visible ? t("all-on") : t("all-off")}</button>
          <button type="button" className="btn-basic" onClick={toggleEnableAll}>{!enable ? t("all-available") : t("all-unavailable")}</button>
        </div>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <div style={{maxHeight:"600px", overflowY:"auto", paddingRight:"10px", width: "100%"}}>
            <Tree
              ref={treeRef}
              tree={treeData}
              rootId={0}
              classes={{container: 'layer-list',}}
              initialOpen={initialOpen}
              sort={false}
              canDrop={(tree, {dragSource, dropTargetId, dropTarget}) => {
                if (!dragSource) return;

                if (
                  (dragSource.parent === 0 && dropTarget === undefined)
                  || (dragSource?.parent === dropTargetId)
                  || (dragSource.parent && !dropTarget?.parent)
                ) {
                  return true;
                } else if (
                  (dragSource.parent === 0 && dropTarget?.parent === 0)
                ) {
                  return false;
                }
              }}
              render={(node, params) => {
                return <TreeNode node={node} params={params}/>
              }}
              onDrop={handleDrop}
              /* onDragEnd={handleDragEnd} */
            />
          </div>
        </DndProvider>
      </div>
      {
        onCreate && <CreatePopup onClose={() => setOnCreate(false)}/>
      }
    </Suspense>
  )
}

type TreeNodeProps = {
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

const LayerNode = ({node, params }: TreeNodeProps) => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const asset = node.data as LayersetAssetBasicFragment;
  //console.log('asset', asset);

  const [updateAssetMutation] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const [deleteAssetMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const toDetail = useCallback(() => {
    /*
    if (!(node.data as LayerAsset).enabled) {
      alert('사용 불가능한 레이어입니다. (사용 가능으로 변경 후 이용 가능)');
      return;
    }*/
    navigate(`/layerset/layer/detail/${node.id}`);
  }, [node]);

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
    if (!confirm(t("question.layer-delete"))) return;
    return deleteAssetMutation({
      variables: {ids: nodeModelIdToString(asset.id)}
    });
  }

  return (
    <>
      <span style={{cursor: "pointer"}} onClick={toDetail}>{node.text}</span>
      <span className="layer-button" style={{paddingRight: "10px"}}>
        <button type="button"
                className={classifyAssetTypeClassNameByLayerAssetType((node.data as LayerAsset).type) + " mar-r20"}>
              {(node.data as LayerAsset).type === LayerAssetType.Layergroup ? 'HYBRID' : (node.data as LayerAsset).type}
        </button>
        <span className="txt mar-r20">{getPublishStatusName(asset.status, t)}</span>
        <label className="switch">
            <input type="checkbox" onChange={toggleVisible} checked={(node.data as LayerAsset).visible}/>
            <span className="slider"></span>
        </label>
        <span className="txt mar-r20">{(node.data as LayerAsset).visible ? t("on") : t("off")}</span>
        <label className="switch">
            <input type="checkbox" onChange={toggleEnable} checked={(node.data as LayerAsset).enabled}/>
            <span className="slider"></span>
        </label>
        <span className="txt mar-r20">{t("use")}</span>
        <button type="button" className={"btn-s-edit"} onClick={deleteLayer}>{t("delete")}</button>
      </span>
    </>
  )
}

const GroupNode = ({node, params}: TreeNodeProps) => {
  const { t } = useTranslation();
  const group = node.data as LayersetGroupBasicFragment;

  const [updateMutation] = useMutation(LayersetUpdateGroupDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const [deleteMutation] = useMutation(LayersetDeleteGroupDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const deleteGroup = useCallback(() => {
    if (!confirm(t("question.group-delete"))) return;
    deleteMutation({
      variables: {
        id: group.id
      }
    });
  }, [deleteMutation, group]);

  const toggleCollapse = useCallback(() => {
    return updateMutation({
      variables: {
        id: group.id,
        input: {
          collapsed: !group.collapsed
        }
      }
    });
  }, [updateMutation, group]);

  const toggleAccess = useCallback(() => {
    const access = group.access === LayerAccess.Public ? LayerAccess.Private : LayerAccess.Public;
    return updateMutation({
      variables: {
        id: group.id,
        input: {
          access
        }
      }
    });
  }, [updateMutation, group]);

  const toggleEnable = useCallback(() => {
    const enabled = !group.enabled;
    return updateMutation({
      variables: {
        id: group.id,
        input: {
          enabled
        }
      }
    });
  }, [updateMutation, group]);

  return (
    <>
      <span onClick={toggleCollapse}>{node.text}</span>
      <span className="layer-button" style={{paddingRight:"10px"}}>
        <label className="switch">
          <input type="checkbox" onChange={(e) => {
            toggleAccess()
          }} defaultChecked={group.access === LayerAccess.Public}/>
          <span className="slider"></span>
        </label>
        <span className="txt mar-r20">{group.access === LayerAccess.Public ? t("public") : t("private")}</span>
        <label className="switch">
          <input type="checkbox" onChange={toggleEnable} defaultChecked={group.enabled}/>
          <span className="slider"></span>
        </label>
        <span className="txt mar-r20">{t("use")}</span>
        <button type="button" className={"btn-s-edit"} onClick={deleteGroup}>{t("delete")}</button>
      </span>
    </>
  )
}


const layerGroupToNodeModel = (groupId:number, group: LayersetGroupBasicFragment): NodeModel => {
  return {
    id: groupId,
    text: group.name,
    droppable: true,
    parent: 0,
    data: group,
  };
}

const layerAssetToNodeModel = (parentId: number, assetId:number, asset: LayersetAssetBasicFragment): NodeModel => {
  return {
    id: assetId,
    text: asset.name,
    droppable: false,
    parent: parentId,
    data: asset
  };
}

/**
 * 그룹 정렬
 * @param left
 * @param right
 */
const groupSortByOrder = (left: FragmentType<typeof LayersetGroupBasicFragmentDoc>, right: FragmentType<typeof LayersetGroupBasicFragmentDoc>) => {
  const order1 = useFragment(LayersetGroupBasicFragmentDoc, left).order;
  const order2 = useFragment(LayersetGroupBasicFragmentDoc, right).order;
  return order1 - order2;
}

const layerGroupsToNodeModels = (data: LayersetGroupListWithAssetQuery): NodeModel[] => {

  let index = 0;
  //그룹 정렬
  const groups = Array.from(data.groups)
    .sort(groupSortByOrder);

  // Tree 노드로 변환
  return groups.reduce((result, current) => {
    index = index + 1;
    const groupId = index;
    const group = useFragment(LayersetGroupBasicFragmentDoc, current);
    result.push(layerGroupToNodeModel(groupId, group));

    const children = current.assets
      .map((asset) => useFragment(LayersetAssetBasicFragmentDoc, asset))
      .map((asset) => {
        index = index + 1;
        return layerAssetToNodeModel(groupId, index, asset);
      });
    result.push(...children);
    return result;
  }, [] as NodeModel[]);
}

const nodeModelIdToString = (id: string | number): string => {
  return typeof id === 'string' ? id : id.toString();
}


export default LayerList;