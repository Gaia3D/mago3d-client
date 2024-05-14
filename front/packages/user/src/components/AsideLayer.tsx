import { FC, RefObject, createRef, useEffect, useRef, useState } from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import { layersetGraphqlFetcher } from "@/api/queryClient";
import { GET_USERLAYERGROUPS } from "@/graphql/layerset/Query";
import { Maybe, Query, UserLayerAsset, UserLayerGroup, Mutation, CreateUserGroupInput } from "@mnd/shared/src/types/layerset/gql/graphql";
import { DndProvider } from "react-dnd";
import {
  Tree,
  NodeModel,
  MultiBackend,
  getBackendOptions,
  TreeMethods
} from "@minoru/react-dnd-treeview";
import { produce } from "immer";
import { RESTORE_USERLAYER, SAVE_USERLAYER } from "@/graphql/layerset/Mutation";
import { UserLayerGroupState, NodeModelsState, layersState, visibleToggledLayerIdState, InitialOpenState, visibleToggledLayerIdsState } from "@/recoils/Layer";
import { useRecoilState, useSetRecoilState } from "recoil";
import { AppLoader } from "@mnd/shared";

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

const layerGroupsToNodemodels = (layerGroups:Maybe<UserLayerGroup>[]):NodeModel[] => {

  const userLayerGroups = layerGroups.filter((layerGroup) => layerGroup !== null) as UserLayerGroup[];

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

const nodeModelIdToNumber = (id: string | number):number => {
  return typeof id === 'string' ? Number(id) : id;
}

const nodeModlesToCreateUserGroupInput = (nodeModels:NodeModel[]):CreateUserGroupInput[] => {
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

export const AsideLayer: FC = () => {
  const {mutateAsync: saveUserLayerMutateAsync} = useMutation({
    mutationFn:({input}:{input:CreateUserGroupInput[]}) => layersetGraphqlFetcher<Mutation>(SAVE_USERLAYER, {input})
  });
  const {mutateAsync: restoreUserLayerMutateAsync} = useMutation({
    mutationFn:() => layersetGraphqlFetcher<Mutation>(RESTORE_USERLAYER)
  });
  //const [treeData, setTreeData] = useState<NodeModel[]>([]);
  const [treeData, setTreeData] = useRecoilState<NodeModel[]>(NodeModelsState);
  const a = useRef<RefObject<HTMLDivElement>[]>([]);
  const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
  const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);
  const setVisibleToggledLayerId = useSetRecoilState<string | null>(visibleToggledLayerIdState);
  const setVisibleToggledLayerIds = useSetRecoilState<{ids:string[], visible:boolean} | null>(visibleToggledLayerIdsState);
  //const [initialOpen, setinitialOpen] = useState<string[] | number[]>([]);
  const [visibleAll, setVisibleAll] = useState<boolean>(false);
  const [initialOpen, setinitialOpen] = useRecoilState<number[]>(InitialOpenState);
  const treeRef = useRef<TreeMethods>(null);

  const setNodeModels = (groups:Maybe<UserLayerGroup>[]): NodeModel[] => {
    const initOpen: number[] = [];

    const nodeModels = layerGroupsToNodemodels(groups);
    setTreeData(nodeModels);

    nodeModels.filter((nodeModel:NodeModel) => nodeModel.parent === 0).forEach((nodeModel:NodeModel) => {
      if (!(nodeModel.data as UserLayerGroup).collapsed) {
        initOpen.push(nodeModelIdToNumber(nodeModel.id));
      }
    });
  
    setinitialOpen(initOpen);
    return nodeModels;
  }

  const setLayersFromNodeModels = (nodeModels:NodeModel[]) => {
    const assets = getLayersFromNodeModels(nodeModels);
    setLayers(produce((draft) => {
        draft.length = 0;
        draft.push(...assets);
    }));
  }

  /* const {data, isError, isFetching, refetch} = useQuery<Query>({
      queryKey: ['layerGroups'],
      queryFn: () => layersetGraphqlFetcher<Query>(GET_USERLAYERGROUPS),
      staleTime:Infinity,
      gcTime:1,
      refetchOnWindowFocus:false,
      refetchOnMount:false,
      refetchOnReconnect:true,
      
      //enabled:!loadLayer
  }); */

  useEffect(() => {
    if (userLayerGroups.length === 0) {
      layersetGraphqlFetcher<Query>(GET_USERLAYERGROUPS)
      .then((result) => {
        const {userGroups} = result;
        setUserLayerGroups(userGroups);
        const nodeModels = setNodeModels(userGroups);    
        setLayersFromNodeModels(nodeModels);
      });
    }
  }, [userLayerGroups]);
  
  if (userLayerGroups.length === 0) return null;

  const handleDrop = (newTree: NodeModel[]) => {
    setTreeData(newTree);
    setLayersFromNodeModels(newTree);
  };

  const toggleCollapse = (node:NodeModel, isOpen:boolean) => {
    const id = node.id;
    const tree = treeRef.current;

    if (!tree) return;
    let collapse = false;
    if (isOpen) {
        //tree.close(id);
        collapse = true;
    } else {
        //tree.open(id);
    }

    const assetIdx = treeData.findIndex((node:NodeModel) => node.id === id);
    setTreeData(produce((draft) => {
        (draft[assetIdx].data as UserLayerGroup).collapsed = collapse;
    }));
     
    setinitialOpen(produce((draft) => {
      const a = nodeModelIdToNumber(id);
      if (collapse) {
        draft.splice(draft.indexOf(a), 1);
      } else {
        draft.push(a);
      }
    }));
    //updateGroup(id, {collapsed:isOpen});
  }
  const toggleVisibleEventHandle = (asset:NodeModel) => {
    const assetIdx = treeData.findIndex((node:NodeModel) => node.id === asset.id);
    setTreeData(produce((draft) => {
        const visible = (draft[assetIdx].data as UserLayerAsset).visible;
        (draft[assetIdx].data as UserLayerAsset).visible = !visible;
    }));

    setVisibleToggledLayerId((asset.data as UserLayerAsset).assetId.toString());
  }

  const toggleLayer = () => {
    const layerIds:string[] = [];
    console.info(visibleAll)
    setTreeData(produce((draft) => {
      draft.forEach((nodeModel:NodeModel) => {
        if (nodeModel.parent !== 0) {
          const asset = nodeModel.data as UserLayerAsset;
          layerIds.push(asset.assetId.toString());
          asset.visible = visibleAll;
        }
      });
    }));
    setVisibleToggledLayerIds({ids:layerIds, visible:visibleAll});
    setVisibleAll(!visibleAll);
  };

  const restoreToDefault = async () => {
    if(!confirm('시스템 설정으로 복원하시겠습니까?')) return;

    const result = await restoreUserLayerMutateAsync();
    const {saveUserLayer } = result;

    const nodeModels = setNodeModels(saveUserLayer);
    setLayersFromNodeModels(nodeModels);
  };

  const saveState = async () => {
    if(!confirm('현 설정을 저장하시겠습니까?')) return;
    
    const input = nodeModlesToCreateUserGroupInput(treeData);
    await saveUserLayerMutateAsync({input});
  };

  return (
    <aside className="gray-bg" style={{overflowY:'auto'}}>
      {/* <div className="aside-search width-88 marginTop-20">
        <SearchForm onSearch={onSearch} />
      </div> */}
      <div className="width-88 marginTop-30">
        <button type="button" className={`btn-setup-${visibleAll ? 'on' :'off'}`} onClick={()=>{toggleLayer();}}>
          전체{visibleAll ? '켜기' :'끄기'}
        </button>
        <button type="button" className="btn-setup" onClick={restoreToDefault}>
          시스템 설정으로
        </button>
        <button type="button" className="btn-setup" onClick={saveState}>
          현재 설정저장
        </button>
      </div>
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          ref={treeRef}
          rootId={0}
          sort={false}
          initialOpen={initialOpen}
          dropTargetOffset={5}
          canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
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
          render={(node, { depth, isOpen, onToggle, hasChild }) => {
            const ref = createRef<HTMLDivElement>();
            a.current.push(ref);
            return (
              <>
                  {
                      node.parent === 0 ? (
                        <div ref={ref} onClick={()=>{toggleCollapse(node, isOpen)}} className={`width-88 marginTop-10 ${!isOpen ? 'layerUnselect':'layerSelect'}` }>
                            {node.text}
                        </div>
                      )
                      : (
                          <div ref={ref} className="layerList width-88" key={node.id}>
                            <div className='floatLeft layerList-middle'></div>
                            <div 
                              className={`layerList-${(node.data as UserLayerAsset).visible ? 'on':'off'} floatLeft`}
                              onClick={()=>{toggleVisibleEventHandle(node)}}
                            >
                              {node.text}
                            </div>
                            <div></div>
                          </div>
                      )
                  }
              </>
          )}}
          onDrop={handleDrop}
          />
      </DndProvider>
    </aside>
  );
};
