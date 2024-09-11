import React, {useEffect, useState} from 'react';
import {
    Maybe,
    Query,
    TerrainAsset,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import {TerrainIdState, TerrainUrlState} from "@/recoils/Terrain.ts";
import {GET_TERRAINS} from "@mnd/shared/src/types/layerset/Query.ts";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {newTerrainCountState} from "@/recoils/MainMenuState.tsx";
import {terrainState} from "@/recoils/Layer.ts";

const TerrainChanger = () => {
    const setTerrainUrl = useSetRecoilState<string>(TerrainUrlState);
    const [newTerrainCount, setNewTerrainCount] = useRecoilState(newTerrainCountState);
    const [userTerrains, setUserTerrains] = useRecoilState(terrainState);
    const [terrainId, setTerrainId] = useRecoilState<string>(TerrainIdState);

    useEffect(() => {
        if (userTerrains.length === 0 || newTerrainCount > 0) {
            layersetGraphqlFetcher<Query>(GET_TERRAINS)
                .then((result) => {
                    if (result.terrains.length === 0) return;
                    result.terrains.forEach((item) => {
                        if(item?.id === terrainId) {
                            item.selected = true;
                        }
                    })
                    const {terrains} = result;
                    setUserTerrains(terrains);
                });
        }
    }, [userTerrains, setUserTerrains, terrainId, newTerrainCount]);

    const changeTerrainByUrl = (url: string, id: string) => {
        setTerrainUrl(import.meta.env.VITE_API_URL+url);
        setTerrainId(id);
    }

    const changeDefaultTerrain = () => {
        setTerrainUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
        setTerrainId('');
    }

    return (
        <>
            <ul className="layer">
                <li className="selected"><span className="text">Terrain</span></li>
            </ul>
            <select
                onChange={(e) => {
                    const eValue = e.target.value
                    if (eValue === '') {
                        changeDefaultTerrain();
                        return;
                    }
                    const { url, id } = JSON.parse(eValue);
                    changeTerrainByUrl(url, id);
                }}
                name="terrain"
                id="terrain"
                style={{backgroundColor: "white"}}
            >
                <option value=''>Default Terrain</option>
                {userTerrains.map(terrain => {
                    if (!terrain) return;
                    return (
                        <option
                            key={terrain.id}
                            value={JSON.stringify({ url: terrain.properties.resource, id: terrain.id })}
                            selected={terrain.selected ? true : undefined}
                        >{terrain.name}</option>
                    )
                })}
            </select>
        </>
    );
};

export default TerrainChanger;