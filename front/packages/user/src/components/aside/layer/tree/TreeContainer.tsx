import {useState, FC, useCallback, useEffect} from 'react';
import {TreeGroup} from "./TreeGroup.tsx";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {
    Maybe,
    Query, UserLayerAsset, UserLayerGroup,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {GET_USERLAYERGROUPS} from "@/graphql/layerset/Query.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {layersState, UserLayerGroupState} from "@/recoils/Layer.ts";

export const TreeContainer: FC = () => {

    const [userLayerGroups, setUserLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
    const setLayers = useSetRecoilState<UserLayerAsset[]>(layersState);

    useEffect(() => {
        if (userLayerGroups.length === 0) {
            layersetGraphqlFetcher<Query>(GET_USERLAYERGROUPS)
                .then((result) => {
                    const {userGroups} = result;
                    setUserLayerGroups(userGroups);
                });
        }
    }, []);

    useEffect(() => {
        if (userLayerGroups.length <= 0) return;

        const tempLayers = userLayerGroups.flatMap(group => group?.assets ?? []);
        setLayers(tempLayers);
    }, [userLayerGroups]);

    const moveLayer = useCallback((dragGroupIndex: number, dragItemIndex: number, hoverGroupIndex: number, hoverItemIndex: number) => {
        setUserLayerGroups((prevGroups) => {
            const updatedGroups = JSON.parse(JSON.stringify(prevGroups)); // 깊은 복사

            const dragItem = updatedGroups[dragGroupIndex]?.assets[dragItemIndex];

            if (!dragItem) return [];

            updatedGroups[dragGroupIndex]?.assets.splice(dragItemIndex, 1);
            updatedGroups[hoverGroupIndex]?.assets.splice(hoverItemIndex, 0, dragItem);

            return updatedGroups;
        })
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
            {userLayerGroups.map((group, index) => {
                if (!group) return;
                return (
                    <TreeGroup
                        key={group.groupId}
                        group={group}
                        groupIndex={index}
                        moveItem={moveLayer}
                        moveGroup={moveLayerGroup}
                    />
                )
            })}
        </div>
    );
};
