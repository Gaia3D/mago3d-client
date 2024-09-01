import React, {useEffect, useState} from "react";
import {
    layerMenuState
} from "@/recoils/Layer";
import { useRecoilState } from "recoil";
import {AsideDisplayProps} from "@/components/aside/AsidePanel.tsx";
import SideCloseButton from "@/components/SideCloseButton.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import LayerTilesetContent from "@/components/aside/layer/LayerTilesetContent.tsx";
import {DndProvider} from "react-dnd";
import {getBackendOptions, MultiBackend} from "@minoru/react-dnd-treeview";
import {TreeContainer} from "@/components/aside/layer/tree/TreeContainer.tsx";
import {useDebounce} from "@/hooks/useDebounce.ts";

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
                    <ul className="layer">
                        <li className="selected"><span className="text">Terrain</span></li>
                    </ul>
                    <ul className="layer-list">
                        <li className="terrain-li">
                            <span className="type type-terrain"></span>
                            <span className="name">Ellipsoid Terrain (Default)</span>
                        </li>
                    </ul>
                    <ul className="layer">
                        <li className={`${layerMenu === 'tileset' ? 'selected': ''}`} onClick={() => setLayerMenu('tileset')}><span className="text">Tileset</span></li>
                        <li className={`${layerMenu === 'primitives' ? 'selected': ''}`} onClick={() => setLayerMenu('primitives')}><span className="text">Primitives</span></li>
                        <li className={`${layerMenu === 'entities' ? 'selected': ''}`} onClick={() => setLayerMenu('entities')}><span className="text">Entities</span></li>
                    </ul>
                    {
                        (() => {
                            switch (layerMenu) {
                                case "tileset":
                                    // return <LayerTilesetContent />;
                                    return (
                                        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                                                <TreeContainer searchTerm={debouncedSearch} />
                                            </div>
                                        </DndProvider>
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
