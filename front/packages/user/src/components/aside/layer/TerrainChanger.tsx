import React, {useEffect} from 'react';
import {
    Query,
} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {useRecoilState, useSetRecoilState} from "recoil";
import { TerrainUrlState} from "@/recoils/Terrain.ts";
import {GET_TERRAINS} from "@mnd/shared/src/types/layerset/Query.ts";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {newTerrainCountState} from "@/recoils/MainMenuState.tsx";
import {terrainState} from "@/recoils/Layer.ts";
import * as Cesium from "cesium";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {OptionsState} from "@/recoils/Tool.ts";

const TerrainChanger = () => {
    const [terrainUrl, setTerrainUrl] = useRecoilState<string>(TerrainUrlState);
    const [newTerrainCount, setNewTerrainCount] = useRecoilState(newTerrainCountState);
    const [userTerrains, setUserTerrains] = useRecoilState(terrainState);
    const [options, setOptions] = useRecoilState(OptionsState);
    const { globeController, initialized } = useGlobeController();

    useEffect(() => {
        if (userTerrains.length === 0 || newTerrainCount > 0) {
            layersetGraphqlFetcher<Query>(GET_TERRAINS)
                .then((result) => {
                    if (result.terrains.length === 0) return;
                    const {terrains} = result;
                    // const defaultTerrain = {
                    //     id: "-1",
                    //     name: "Default Terrain",
                    //     properties: {
                    //         resource: '/tilesets/terrain'
                    //     },
                    //     selected: false
                    // }
                    // console.log(terrains)
                    // setUserTerrains([defaultTerrain, ...terrains]);
                    setUserTerrains(terrains);
                });
        }
    }, [userTerrains, setUserTerrains, newTerrainCount]);

    const changeTerrainByUrl = async (url: string, id: string) => {
        const { viewer } = globeController;
        if (!viewer) return;
        setTerrainUrl(url);
        localStorage.setItem('TERRAIN_URL', url);
        if (!options.isTerrain) {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        } else {
            viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_API_URL + url);
        }
    }

    return (
        <>
            <ul className="layer">
                <li className="selected"><span className="text">Terrain</span></li>
            </ul>
            <select
                onChange={(e) => {
                    const eValue = e.target.value
                    const {url, id} = JSON.parse(eValue);
                    changeTerrainByUrl(url, id);
                }}
                name="terrain"
                id="terrain"
                style={{backgroundColor: "white"}}
                value={JSON.stringify({
                    url: terrainUrl,
                    id: userTerrains.find(t => t && t.properties.resource === terrainUrl)?.id
                })}
            >
                {userTerrains.map(terrain => {
                    if (!terrain) return;
                    return (
                        <option
                            key={terrain.id}
                            value={JSON.stringify({url: terrain.properties.resource, id: terrain.id})}
                        >
                            {terrain.name}
                        </option>
                    )
                })}
            </select>
        </>
    );
};

export default TerrainChanger;