import {DndProvider} from "react-dnd";
import {getBackendOptions, MultiBackend, NodeModel, Tree} from "@minoru/react-dnd-treeview";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {produce} from "immer";
import {classifyAssetTypeClassNameByLayerAssetType, getPublishStatusName} from "../../../api/Data";
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

const LayerList = () => {
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
    const initOpen = data.groups
      .map((group) => useFragment(LayersetGroupBasicFragmentDoc, group))
      .filter((group) => !group.collapsed)
      .map((group) => group.id);
    setInitialOpen(initOpen);
    setTreeData(layerGroupsToNodeModels(data));

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
            updateGroup(node.id, {collapsed});
          });
      prevCollapsedRef.current = collapsed;
    }

  }, [data, collapsed]);

  const handleDrop = (newTree: NodeModel[], options) => {
    const {dragSource, dropTarget} = options;

    //LOCATE_GROUP
    if (dropTarget === undefined && dragSource.parent === 0) {
      const groups = newTree.filter((node: NodeModel) => !node.parent);
      const idx = groups.findIndex((group: NodeModel) => group.id === dragSource.id);
      const offsetGroup = groups[idx === 0 ? idx + 1 : idx - 1];
      const offsetGroupId = offsetGroup.id;
      const locateOption = idx === 0 ? LocateOption.Before : LocateOption.After;

      locateGroupMutation({
        variables: {
          id: dragSource.id,
          input: {target: nodeModelIdToString(offsetGroupId), option: locateOption}
        }
      });
    } else if (dropTarget) {
      //같은 그룹 내에서 위치 변경
      const siblings = newTree.filter((node: NodeModel) => node.parent === dropTarget.id);
      const idx = siblings.findIndex((node: NodeModel) => node.id === dragSource.id);
      const offsetAsset = siblings[idx === 0 ? idx + 1 : idx - 1];
      const offsetAssetId = offsetAsset.id;
      const locateOption = idx === 0 ? LocateOption.Before : LocateOption.After;
      locateAssetMutation({
        variables: {
          input:
            {
              target: {
                groupId: nodeModelIdToString(offsetAsset.parent),
                id: nodeModelIdToString(offsetAssetId)
              },
              source: {
                groupId: nodeModelIdToString(dragSource.parent),
                id: nodeModelIdToString(dragSource.id)
              },
              option: locateOption
            }
        }
      });
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
        <h2>레이어 관리</h2>
        <div className="layer-button mar-tm20 mar-b10">
          <button type="button" className="btn-basic" onClick={() => setOnCreate(true)}>그룹 추가</button>
          <button type="button" className="btn-basic" onClick={() => setCollapsed(!collapsed)}>전체 {collapsed ? '펼치기' : '접기'}</button>
          <button type="button" className="btn-basic" onClick={toggleVisibleAll}>전체 {!visible ? '켜기' : '끄기'}</button>
          <button type="button" className="btn-basic" onClick={toggleEnableAll}>전체 {!enable ? '사용가능' : '사용불가'}</button>
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
                if (
                  (dragSource.parent === 0 && dropTarget === undefined)
                  || (dragSource?.parent === dropTargetId)
                ) {
                  return true;
                } else if (
                  (dragSource.parent === 0 && dropTarget.parent === 0)
                ) {
                  return false;
                }
              }}
              render={(node, params) => <TreeNode node={node} params={params}/>}
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
    if (!confirm('레이어를 삭제하시겠습니까?')) return;
    return deleteAssetMutation({
      variables: {ids: nodeModelIdToString(node.id)}
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
        <span className="txt mar-r20">{getPublishStatusName(asset.status)}</span>
        <label className="switch">
            <input type="checkbox" onChange={toggleVisible} checked={(node.data as LayerAsset).visible}/>
            <span className="slider"></span>
        </label>
        <span className="txt mar-r20">{(node.data as LayerAsset).visible ? "켜짐" : "꺼짐"}</span>
        <label className="switch">
            <input type="checkbox" onChange={toggleEnable} checked={(node.data as LayerAsset).enabled}/>
            <span className="slider"></span>
        </label>
        <span className="txt mar-r20">사용</span>
        <button type="button" className={"btn-s-edit"} onClick={deleteLayer}>삭제</button>
      </span>
    </>
  )
}

const GroupNode = ({node, params}: TreeNodeProps) => {
  const group = node.data as LayersetGroupBasicFragment;

  const [updateMutation] = useMutation(LayersetUpdateGroupDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const [deleteMutation] = useMutation(LayersetDeleteGroupDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const deleteGroup = useCallback(() => {
    if (!confirm(`그룹을 삭제하시겠습니까?`)) return;
    deleteMutation({
      variables: {
        id: group.id
      }
    });
  }, [deleteMutation, group]);

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
        <span className="txt mar-r20">{group.access === LayerAccess.Public ? "공개" : "비공개"}</span>
        <label className="switch">
          <input type="checkbox" onChange={toggleEnable} defaultChecked={group.enabled}/>
          <span className="slider"></span>
        </label>
        <span className="txt mar-r20">사용</span>
        <button type="button" className={"btn-s-edit"} onClick={deleteGroup}>삭제</button>
      </span>
    </>
  )
}


const layerGroupToNodeModel = (group: LayersetGroupBasicFragment): NodeModel => {
  return {
    id: group.id,
    text: group.name,
    droppable: true,
    parent: 0,
    data: group,
  };
}

const layerAssetToNodeModel = (parentId: string, asset: LayersetAssetBasicFragment): NodeModel => {
  return {
    id: asset.id,
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
  //그룹 정렬
  const groups = Array.from(data.groups)
    .sort(groupSortByOrder);

  // Tree 노드로 변환
  return groups.reduce((result, current) => {
    const group = useFragment(LayersetGroupBasicFragmentDoc, current);
    result.push(layerGroupToNodeModel(group));

    const children = current.assets
      .map((asset) => useFragment(LayersetAssetBasicFragmentDoc, asset))
      .map((asset) => layerAssetToNodeModel(group.id, asset));
    result.push(...children);
    return result;
  }, [] as NodeModel[]);
}

const nodeModelIdToString = (id: string | number): string => {
  return typeof id === 'string' ? id : id.toString();
}


export default LayerList;