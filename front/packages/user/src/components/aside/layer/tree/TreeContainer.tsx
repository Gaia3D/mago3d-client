import React, { useState, FC, useCallback, useEffect, useRef } from 'react';
import { TreeGroup } from "./TreeGroup.tsx";
import { layersetGraphqlFetcher } from "@/api/queryClient.ts";
import {
    CreateUserGroupInput,
    Maybe, Mutation,
    Query, UserLayerAsset, UserLayerGroup,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { GET_USERLAYERGROUPS } from "@/graphql/layerset/Query.ts";
import {useRecoilState, useRecoilValue, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {layersState, reRenderLayerState, UserLayerGroupState} from "@/recoils/Layer.ts";
import {debounce} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {RESTORE_USERLAYER, SAVE_USERLAYER} from "@/graphql/layerset/Mutation.ts";
import {layerGroupsToNodemodels, nodeModlesToCreateUserGroupInput} from "@/components/aside/layer/LayerNodeModel.ts";
import {currentUserProfileSelector} from "@/recoils/Auth.ts";
import {useTranslation} from "react-i18next";
import {newLayerCountState} from "@/recoils/MainMenuState.tsx";

interface TreeContainerProps {
    searchTerm: string;
}

export const TreeContainer: FC<TreeContainerProps> = ({ searchTerm }) => {
    const {t} = useTranslation();
    const [newLayerCount, setNewLayerCount] = useRecoilState(newLayerCountState);
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);
    const [filteredGroups, setFilteredGroups] = useState<Maybe<UserLayerGroup>[]>([]);
    const [visibleAll, setVisibleAll] = useState<boolean>(false);
    const prevUserLayerGroupsRef = useRef<Maybe<UserLayerGroup>[]>([]);
    const {contents} = useRecoilValueLoadable(currentUserProfileSelector);
    const userId = contents.id;
    const [reRenderLayer, setReRenderLayer] = useRecoilState<boolean>(reRenderLayerState);

    const { mutateAsync: restoreUserLayerMutateAsync } = useMutation({
        mutationFn: () => layersetGraphqlFetcher<Mutation>(RESTORE_USERLAYER),
        onError: (error) => {
            console.error("Error restoring user layer:", error);
            alert(t("error.layer.restore"));
        },
    });

    const { mutateAsync: saveUserLayerMutateAsync } = useMutation({
        mutationFn: ({ input }: { input: CreateUserGroupInput[] }) => layersetGraphqlFetcher<Mutation>(SAVE_USERLAYER, { input }),
        onError: (error) => {
            console.error("Error saving user layer:", error);
            alert(t("error.layer.save"));
        },
    });

    const debouncedSetLayers = useCallback(
        debounce((layers: UserLayerAsset[]) => {
            setLayers(layers);
        }, 300),
        [setLayers]
    );

    useEffect(() => {
        if (userLayerGroups.length === 0) {
            layersetGraphqlFetcher<Query>(GET_USERLAYERGROUPS)
                .then((result) => {
                    const { userGroups } = result;
                    setUserLayerGroups(userGroups);
                });
        }
    }, [setUserLayerGroups, userLayerGroups.length]);

    useEffect(() => {
        if (newLayerCount !== 0) {
            layersetGraphqlFetcher<Mutation>(RESTORE_USERLAYER)
                .then((result) => {
                    const { saveUserLayer } = result;
                    const filteredGroup = saveUserLayer.find(group => group?.groupId === '0');
                    if (!filteredGroup) return;
                    const newGroup = userLayerGroups.map((prevGroup) => {
                        if (prevGroup?.groupId === '0') {
                            const newAssets = filteredGroup.assets.filter(filteredAsset =>
                                !prevGroup.assets.some(prevAsset => prevAsset.assetId === filteredAsset.assetId)
                            );
                            return {
                                ...prevGroup,
                                assets: [...prevGroup.assets, ...newAssets]
                            };
                        }
                        return prevGroup;
                    });
                    setUserLayerGroups(newGroup);
                    const input = nodeModlesToCreateUserGroupInput(layerGroupsToNodemodels(newGroup));
                    saveUserLayerMutateAsync({ input });
                    const tempLayers = newGroup.flatMap(group => group?.assets ?? []);
                    debouncedSetLayers(tempLayers);
                });
        }
    }, [newLayerCount]);

    useEffect(() => {
        if (userLayerGroups.length <= 0) return;
        if (!reRenderLayer) {
            setReRenderLayer(true);
            return
        }
        if (JSON.stringify(userLayerGroups) !== JSON.stringify(prevUserLayerGroupsRef.current)) {
            const tempLayers = userLayerGroups.flatMap(group => group?.assets ?? []);
            debouncedSetLayers(tempLayers);
            prevUserLayerGroupsRef.current = userLayerGroups;
        }
    }, [userLayerGroups, debouncedSetLayers, setReRenderLayer]);

    useEffect(() => {
        if (userLayerGroups.length === 0) return;

        if (!searchTerm) {
            setFilteredGroups(userLayerGroups);
        } else {
            const normalizedSearchTerm = searchTerm.replace(/\s+/g, '').toLowerCase();

            const filtered = userLayerGroups.map(group => {
                if (!group) return null;

                const filteredAssets = group.assets.filter(asset =>
                    asset.name?.replace(/\s+/g, '').toLowerCase().includes(normalizedSearchTerm)
                );

                return filteredAssets.length > 0 ? { ...group, assets: filteredAssets } : null;
            }).filter(group => group !== null);

            setFilteredGroups(filtered as Maybe<UserLayerGroup>[]);
        }
    }, [userLayerGroups, searchTerm]);

    const moveLayer = useCallback((dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => {
        setUserLayerGroups((prevGroups) => {
            const updatedGroups = JSON.parse(JSON.stringify(prevGroups)); // 깊은 복사

            const dragItem = updatedGroups[dragGroupIndex]?.assets[dragItemIndex];

            if (!dragItem) return [];

            updatedGroups[dragGroupIndex]?.assets.splice(dragItemIndex, 1);
            updatedGroups[hoverGroupIndex]?.assets.splice(hoverItemIndex, 0, dragItem);

            return updatedGroups;
        });
    }, [setUserLayerGroups]);

    const moveLayerGroup = useCallback((dragIndex: number, hoverIndex: number) => {
        setUserLayerGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const [removed] = updatedGroups.splice(dragIndex, 1);
            updatedGroups.splice(hoverIndex, 0, removed);
            return updatedGroups;
        });
    }, [setUserLayerGroups]);

    const toggleGroupCollapsed = (groupId: string) => {
        setReRenderLayer(false);
        setUserLayerGroups((prevGroups) => {
            return prevGroups.map(group => {
                if (!group) return group;
                if (group.groupId === groupId) {
                    return { ...group, collapsed: !group.collapsed };
                }
                return group;
            });
        });
    };

    const restoreToDefault = async () => {
        if (!confirm(t("confirm.layer.restore"))) return;
        const {saveUserLayer} = await restoreUserLayerMutateAsync();
        setUserLayerGroups(saveUserLayer);
    };

    const saveState = async () => {
        if (!confirm(t("confirm.layer.save"))) return;
        const input = nodeModlesToCreateUserGroupInput(layerGroupsToNodemodels(userLayerGroups));
        await saveUserLayerMutateAsync({ input });
    };

    const toggleAllLayer = () => {
        const newVisibleState = !visibleAll;

        setUserLayerGroups(prevGroups =>
            prevGroups.map(group => {
                if (!group) return group;
                return {
                    ...group,
                    assets: group.assets.map(asset => ({ ...asset, visible: newVisibleState }))
                };
            })
        );
        setVisibleAll(newVisibleState);
    };

    return (
        <>
            <ul className="layer-list">
                <button type="button" onClick={toggleAllLayer}
                className={`layer-funtion-button ${!visibleAll ? 'visible' : 'not-visible'}`}></button>
                <button onClick={restoreToDefault} >R</button>
                <button onClick={saveState} >S</button>
                {filteredGroups.map((group, index) => {
                    if (!group) return null;
                    return (
                        <li
                            key={group.groupId}
                            className={`${group.collapsed? 'close-group' : 'open-group'}`}
                        >
                            <TreeGroup
                                group={group}
                                groupIndex={index}
                                moveItem={moveLayer}
                                moveGroup={moveLayerGroup}
                                toggleGroup={toggleGroupCollapsed}
                                userId={userId}
                            />
                        </li>
                    );
                })}
            </ul>
        </>
    );
};
