import { useState, FC, useCallback, useEffect } from 'react';
import { TreeGroup } from "./TreeGroup.tsx";
import { layersetGraphqlFetcher } from "@/api/queryClient.ts";
import {
    Maybe,
    Query, UserLayerAsset, UserLayerGroup,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { GET_USERLAYERGROUPS } from "@/graphql/layerset/Query.ts";
import { useRecoilState, useSetRecoilState } from "recoil";
import { layersState, UserLayerGroupState } from "@/recoils/Layer.ts";

interface TreeContainerProps {
    searchTerm: string;
}

export const TreeContainer: FC<TreeContainerProps> = ({ searchTerm }) => {
    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);
    const [filteredGroups, setFilteredGroups] = useState<Maybe<UserLayerGroup>[]>([]);

    // Fetch user layer groups if not already fetched
    useEffect(() => {
        if (userLayerGroups.length === 0) {
            layersetGraphqlFetcher<Query>(GET_USERLAYERGROUPS)
                .then((result) => {
                    const { userGroups } = result;
                    setUserLayerGroups(userGroups);
                });
        }
    }, []);

    useEffect(() => {
        if (userLayerGroups.length <= 0) return;

        const tempLayers = userLayerGroups.flatMap(group => group?.assets ?? []);
        setLayers(tempLayers);
    }, [userLayerGroups]);

    useEffect(() => {
        if (userLayerGroups.length === 0) return;

        if (!searchTerm) {
            setFilteredGroups(userLayerGroups);
        } else {
            // 공백 제거 및 소문자 변환
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
    }, []);

    const moveLayerGroup = useCallback((dragIndex: number, hoverIndex: number) => {
        setUserLayerGroups((prevGroups) => {
            const updatedGroups = [...prevGroups];
            const [removed] = updatedGroups.splice(dragIndex, 1);
            updatedGroups.splice(hoverIndex, 0, removed);
            return updatedGroups;
        });
    }, []);

    return (
        <div>
            {filteredGroups.map((group, index) => {
                if (!group) return null;
                return (
                    <TreeGroup
                        key={group.groupId}
                        group={group}
                        groupIndex={index}
                        moveItem={moveLayer}
                        moveGroup={moveLayerGroup}
                    />
                );
            })}
        </div>
    );
};
