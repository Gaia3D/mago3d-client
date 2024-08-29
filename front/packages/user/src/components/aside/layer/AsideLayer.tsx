import { FC, RefObject, createRef, useEffect, useRef, useState } from "react";
import { layersetGraphqlFetcher } from "@/api/queryClient";
import { GET_USERLAYERGROUPS } from "@/graphql/layerset/Query";
import {
    Maybe,
    Query,
    UserLayerAsset,
    UserLayerGroup,
    Mutation,
    CreateUserGroupInput,
    LayerAssetType, RemoteQueryVariables, RemoteDocument, LayersetDeleteAssetDocument
} from "@mnd/shared/src/types/layerset/gql/graphql";
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
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from "cesium";
import {useLazyQuery, useMutation as apolloUseMutation} from "@apollo/client";
import {DatasetProcessLogDocument} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {useMutation} from "@tanstack/react-query";

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

export const AsideLayers: React.FC<AsideDisplayProps>  = ({display}) => {
    const {initialized, globeController} = useGlobeController();
    const {mutateAsync: saveUserLayerMutateAsync} = useMutation({
        mutationFn:({input}:{input:CreateUserGroupInput[]}) => layersetGraphqlFetcher<Mutation>(SAVE_USERLAYER, {input})
    });
    const {mutateAsync: restoreUserLayerMutateAsync} = useMutation({
        mutationFn:() => layersetGraphqlFetcher<Mutation>(RESTORE_USERLAYER)
    });
    const [deleteAssetMutation] = apolloUseMutation(LayersetDeleteAssetDocument);

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
    const [getRemoteData, { data: remoteData }] = useLazyQuery(RemoteDocument);
    const [remoteType, setRemoteType] = useState('');



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
        console.log(assets);


        setLayers(produce((draft) => {
            draft.length = 0;
            draft.push(...assets);
        }));
    }

    useEffect(() => {
        if (remoteData) {
            if (!initialized) return;
            const viewer = globeController?.viewer;
            if (!viewer) return;

            if (remoteType === LayerAssetType.Raster) {
                const { latLonBoundingBox } = remoteData.remote.coverage;
                viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(latLonBoundingBox.minx, latLonBoundingBox.miny, latLonBoundingBox.maxx, latLonBoundingBox.maxy),
                    duration: 2,
                });
            } else if (remoteType === LayerAssetType.Vector) {
                const { latLonBoundingBox } = remoteData.remote.featureType;
                viewer.camera.flyTo({
                    destination: Cesium.Rectangle.fromDegrees(latLonBoundingBox.minx, latLonBoundingBox.miny, latLonBoundingBox.maxx, latLonBoundingBox.maxy),
                    duration: 2,
                });
            }
        }
    }, [remoteData, initialized, remoteType]);

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

    function extractPath(url: string): string {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    }

    const flyToLayer = (node:NodeModel) => {
        const asset = node.data;
        const layerType = asset?.type;
        const viewer = globeController?.viewer;
        if (!viewer) return;
        setRemoteType(layerType);

        switch (layerType) {
            case LayerAssetType.Tiles3D: {
                const model = Cesium.Cesium3DTileset.fromUrl(asset?.properties.resource);
                viewer.flyTo(model, {duration: 2});
                return;
            }
            case LayerAssetType.Raster:
            case LayerAssetType.Vector: {
                const { properties } = asset;
                const { layer } = properties;
                const { resource } = layer;

                let variables: RemoteQueryVariables = { href : resource.href };

                if (import.meta.env.MODE === 'production') {
                    const path = extractPath(resource.href);

                    const { protocol, hostname, port } = window.location;

                    // 포트가 있는 경우 콜론과 함께 포트 번호를 추가
                    const portPart = port ? `:${port}` : '';

                    // 전체 URL 구성
                    const href = `${protocol}//${hostname}${portPart}${path}`;
                    variables =  { href };
                }
                getRemoteData({
                    variables: variables
                });
                return
            }
            case LayerAssetType.Layergroup: {
                const {properties} = asset;
                const {layerGroup} = properties;
                const {minx, maxx, miny, maxy} = layerGroup.bounds;
                const extent = Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy);
                viewer.camera.flyTo({
                    destination: extent,
                    duration: 2,
                });
                return;
            }
            case LayerAssetType.Cog:
            default: {
                alert("허용되지 않는 형태입니다.");
                return;
            }

        }

    }



    const deleteLayer = (node: NodeModel) => {
        if (!confirm('레이어를 삭제하시겠습니까?')) return;

        try {
            return deleteAssetMutation({
                variables: { ids: node.data.assetId }
            })
            .then(() => {
                alert('레이어가 성공적으로 삭제되었습니다.');
                setTreeData((prevTreeData) => {
                    const newTreeData = prevTreeData.filter((treeNode) => treeNode.id !== node.id);
                    return newTreeData;
                });
                setLayersFromNodeModels((prevTreeData) => prevTreeData.filter((treeNode) => treeNode.id !== node.id));
            });
        } catch (error) {
            console.error(error);
            alert('레이어 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

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
                        <li className="selected"><span className="text">Terrain</span></li>
                    </ul>
                    <ul className="layer-list">
                        <li className="terrain-li">
                            <span className="type type-terrain"></span>
                            <span className="name">Ellipsoid Terrain (Default)</span>
                        </li>
                    </ul>
                    <ul className="layer">
                        <li className="selected"><span className="text">Tileset</span></li>
                        <li><span className="text">Primitives</span></li>
                        <li><span className="text">Entities</span></li>
                        <li className="button-area">
                            <div className="layer-button">
                                <button type="button" onClick={toggleLayer} className={`layer-funtion-button ${!visibleAll ? 'visible' :'not-visible'}`}></button>
                                <button type="button" onClick={restoreToDefault} className="layer-funtion-button">R</button>
                                <button type="button" onClick={saveState} className="layer-funtion-button">S</button>
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
                                                    <div className="group-node-container" onClick={() => {
                                                        toggleCollapse(node, isOpen)
                                                    }}>
                                                        <div className="group-node">
                                                            <div className="group-icon">G</div>
                                                            <div className="group-name">{node.text}</div>
                                                        </div>
                                                    </div>
                                                )
                                                : (
                                                    <div className="layer-node-container" key={node.id}>
                                                        <span className="type type-3d"></span>
                                                        <span className="layer-name">{node.text}</span>
                                                        <div className="layer-button">
                                                            <button type="button"
                                                                    onClick={() => {
                                                                        toggleVisibleEventHandle(node)
                                                                    }}
                                                                    className={`layer-funtion-button ${(node.data as UserLayerAsset).visible ? 'visible' : 'not-visible'}`}></button>
                                                            {/*<label className="switch">*/}
                                                            {/*    <input type="checkbox" onChange={toggleVisible} checked={(node.data as LayerAsset).visible ?? false}/>*/}
                                                            {/*    <span className="slider"></span>*/}
                                                            {/*</label>*/}
                                                            <button type="button"
                                                                    onClick={() => {
                                                                        flyToLayer(node)
                                                                    }}
                                                                    className="layer-funtion-button map-view"></button>
                                                            <button type="button"
                                                                    onClick={() => {
                                                                        deleteLayer(node)
                                                                    }}
                                                                    className="layer-funtion-button delete"></button>
                                                        </div>
                                                    </div>
                                                )
                                        }
                                </>
                                )
                                }}
                                onDrop={handleDrop}
                            />
                        </DndProvider>
                    </div>
                </div>
            </div>
        </div>
    );
};
