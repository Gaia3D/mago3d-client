import React, {useEffect, useState} from "react";
import {
    layerMenuState
} from "@/recoils/Layer";
import { useRecoilState } from "recoil";
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import {DndProvider} from "react-dnd";
import {getBackendOptions, MultiBackend} from "@minoru/react-dnd-treeview";
import {TreeContainer} from "@/components/aside/layer/tree/TreeContainer.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";
import TerrainChanger from "@/components/aside/layer/TerrainChanger.tsx";

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
                    {
                        (() => {
                            switch (layerMenu) {
                                case "tileset":
                                    return (
                                        <div className="layer-scroll">
                                            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                                                <TreeContainer searchTerm={debouncedSearch} />
                                            </DndProvider>
                                        </div>
                                    );
                                case "primitives":
                                    return <div>Primitives Content</div>;
                                case "entities":
                                    return <div>Entities Content</div>;
                                default:
                                    return null;
                            }
                        })()
                    }
                </div>
            </div>
        </div>
    );
};
