import React, {useEffect} from 'react';
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import {useRecoilState} from "recoil";
import {TerrainUrlState} from "@/recoils/Terrain.ts";
import {newTerrainCountState} from "@/recoils/MainMenuState.tsx";
import {terrainState} from "@/recoils/Layer.ts";
import {OptionsState} from "@/recoils/Tool.ts";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import {layersetGraphqlFetcher} from "@/api/queryClient.ts";
import {Query} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {GET_TERRAINS} from "@mnd/shared/src/types/layerset/Query.ts";
import * as Cesium from "cesium";

const AsideTerrains: React.FC<AsideDisplayProps>  = ({display}) => {

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
                    setUserTerrains(terrains);
                });
        }
    }, [userTerrains, setUserTerrains, newTerrainCount]);

    const changeTerrain = async (terrainId: string) => {
        const selectedTerrain = userTerrains.find(terrain => terrain?.id === terrainId);
        const selectedUrl = selectedTerrain?.properties.resource
        if (!selectedUrl) return;

        const { viewer } = globeController;
        if (!viewer) return;

        setGlobalTerrainUrl(selectedUrl);
        if (!options.isTerrain) {
            viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        } else {
            viewer.terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(import.meta.env.VITE_API_URL + selectedUrl);
        }
    }

    const changeDefaultTerrain = () => {
        const { viewer } = globeController;
        if (!viewer) return;
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider();
        setGlobalTerrainUrl('')
    }

    const setGlobalTerrainUrl = (url: string) => {
        setTerrainUrl(url);
        localStorage.setItem('TERRAIN_URL', url);
    }

    return (
        <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
            <input type="checkbox" id="toggleButton"/>
            <div className="side-bar">
                <div className="side-bar-header">
                    <SideCloseButton/>
                </div>
                <div className="content--wrapper">
                    <div className="terrain-scroll">
                        <ul className="layer-list terrain-list">
                            <li onClick={changeDefaultTerrain} className={terrainUrl === '' ? 'selected' : ''}>
                                <span className="type type-terrain"></span>
                                <span className="name">Ellipsoid Terrain (Default)</span>
                            </li>
                            {userTerrains.map(terrain => {
                                if (!terrain) return;
                                const liTerrainUrl = terrain?.properties.resource
                                return (
                                    <li
                                        className={terrainUrl === liTerrainUrl ? 'selected' : ''}
                                        key={terrain.id}
                                        onClick={() => changeTerrain(terrain.id)}
                                    >
                                        <span className="type type-terrain"></span>
                                        <span className="name">{terrain.name}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AsideTerrains;