import React, {useEffect} from 'react';
import {
    Maybe,
    Query,
    TerrainAsset,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {TerrainIdState, TerrainUrlState, UserTerrainGroupsState, UserTerrainState} from "@/recoils/Terrain.ts";
import {GET_TERRAINS} from "@mnd/shared/src/types/layerset/Query.ts";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from "cesium";

const TerrainChanger = () => {
    const userTerrainGroups = useRecoilValue<Maybe<TerrainAsset>[]>(UserTerrainGroupsState);
    const setTerrainUrl = useSetRecoilState<string>(TerrainUrlState);
    const [userTerrains, setUserTerrains] = useRecoilState<Maybe<TerrainAsset>[]>(UserTerrainState);
    const [terrainId, setTerrainId] = useRecoilState<string>(TerrainIdState);
    const { globeController } = useGlobeController();
    const { viewer } = globeController;

    useEffect(() => {
        if (userTerrains.length === 0) {
            layersetGraphqlFetcher<Query>(GET_TERRAINS)
                .then((result) => {
                    result.terrains.forEach((item) => {
                        if(item?.id === terrainId) {
                            item.selected = true;
                        }
                    })
                    const {terrains} = result;
                    setUserTerrains(terrains);
                });
        }
    }, [userTerrainGroups]);

    const changeTerrainByUrl = (url: string, id: string) => {
        setTerrainUrl(import.meta.env.VITE_API_URL+url);
        setTerrainId(id);
    }

    const changeDefaultTerrain = () => {
        if (!viewer) return;
        const terrainUrl = import.meta.env.VITE_TERRAIN_SERVER_URL;
        if (!terrainUrl) {
          viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        } else {
          setTerrainUrl(terrainUrl);
        }
        //setTerrainUrl(import.meta.env.VITE_TERRAIN_SERVER_URL);
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