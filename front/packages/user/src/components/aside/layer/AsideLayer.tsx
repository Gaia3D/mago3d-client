import React, {useEffect, useState} from "react";
import {
    layerMenuState
} from "@/recoils/Layer";
import { useRecoilState } from "recoil";
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";
import TerrainChanger from "@/components/aside/layer/TerrainChanger.tsx";
import PrimitivesContent from "@/components/aside/layer/PrimitivesContent.tsx";
import EntitiesContent from "@/components/aside/layer/EntitiesContent.tsx";
import TilesetContent from "@/components/aside/layer/TilesetContent.tsx";

export const AsideLayers: React.FC<AsideDisplayProps>  = ({display}) => {
    const [layerMenu, setLayerMenu] = useRecoilState(layerMenuState);
    const [searchTerm, setSearchTerm] = useState('');

    const debouncedSearch = useDebounce(searchTerm, 300);

    return (
        <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
            <input type="checkbox" id="toggleButton"/>
            <div className="side-bar">
                <div className="side-bar-header">
                    <SideCloseButton />
                    <SearchInput value={searchTerm} change={setSearchTerm} />
                </div>
                <div className="content--wrapper">
                    <TerrainChanger />
                    <ul className="layer">
                        <li className={`${layerMenu === 'tileset' ? 'selected': ''}`} onClick={() => setLayerMenu('tileset')}><span className="text">Tileset</span></li>
                        <li className={`${layerMenu === 'primitives' ? 'selected': ''}`} onClick={() => setLayerMenu('primitives')}><span className="text">Primitives</span></li>
                        <li className={`${layerMenu === 'entities' ? 'selected': ''}`} onClick={() => setLayerMenu('entities')}><span className="text">Entities</span></li>
                    </ul>
                    <div className="layer-scroll">
                        {
                            (() => {
                                switch (layerMenu) {
                                    case "tileset":
                                        return <TilesetContent searchTerm={debouncedSearch} />;
                                    case "primitives":
                                        return <PrimitivesContent />;
                                    case "entities":
                                        return <EntitiesContent />;
                                    default:
                                        return null;
                                }
                            })()
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
