import React, { useState, FC, useCallback, useEffect } from 'react';
import { TreeGroup } from "./TreeGroup.tsx";
import { layersetGraphqlFetcher } from "@/api/queryClient.ts";
import {
    Maybe,
    Query, UserLayerAsset, UserLayerGroup,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { GET_USERLAYERGROUPS } from "@/graphql/layerset/Query.ts";
import {useRecoilState, useRecoilValueLoadable, useSetRecoilState} from "recoil";
import {layersState, UserLayerGroupState} from "@/recoils/Layer.ts";
import {debounce} from "@mui/material";
import {currentUserProfileSelector} from "@/recoils/Auth.ts";

interface TreeContainerProps {
    searchTerm: string;
}

export const TreeContainer: FC<TreeContainerProps> = ({ searchTerm }) => {

    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);
    const [filteredGroups, setFilteredGroups] = useState<Maybe<UserLayerGroup>[]>([]);
    const {contents} = useRecoilValueLoadable(currentUserProfileSelector);
    const userId = contents.id;


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
                    const flatLayerGroup = userGroups.flatMap(group => group?.assets ?? []);
                    setLayers(flatLayerGroup);
                });
        }
    }, [setUserLayerGroups, userLayerGroups.length, ]);

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
            const flatLayerGroup = updatedGroups.flatMap((group: Maybe<UserLayerGroup>) => group?.assets ?? []);
            debouncedSetLayers(flatLayerGroup);
            return updatedGroups;
        });
    }, [setUserLayerGroups]);

    const moveLayerGroup = useCallback((dragIndex: number, hoverIndex: number) => {
        setUserLayerGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const [removed] = updatedGroups.splice(dragIndex, 1);
            updatedGroups.splice(hoverIndex, 0, removed);
            const flatLayerGroup = updatedGroups.flatMap(group => group?.assets ?? []);
            debouncedSetLayers(flatLayerGroup);
            return updatedGroups;
        });
    }, [setUserLayerGroups]);

    const toggleGroupCollapsed = (groupId: string) => {
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

    return (
        <>
            <ul className="layer-list">                
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
