import React, {useRef, useState} from 'react';
import {useRecoilState} from "recoil";
import {CurrentLayerMapState, LayerMapArrState, LayerMapType} from "@/recoils/Layer.ts";

const MapSelector = () => {

    const [currentLayerMap, setCurrentLayerMap] = useRecoilState(CurrentLayerMapState);
    const [layerMapArr, setLayerMapArr] = useRecoilState(LayerMapArrState);
    const mapRef = useRef<HTMLDivElement>(null);

    const switchMap = (map: LayerMapType) => {
        setCurrentLayerMap(map);
        localStorage.setItem('RIPA_MAP', JSON.stringify(map));
    }

    const toggleMapSelector = () => {
        mapRef.current?.classList.toggle("expand");
    }

    return (
        <div onClick={toggleMapSelector} ref={mapRef} className="background-map">
            <div className="background-map-select">
                <div className="map-wrapper">
                    <button type="button" className="map-type">
                        <img className="selected" src={`/images/${currentLayerMap.image}`} alt={`${currentLayerMap.name} image`}/>
                        <span className="map-text">Now</span>
                    </button>
                </div>
            </div>
            <div className="background-map-select-layer">
            {
                    layerMapArr.map(map => (
                        <div key={map.name} className="map-wrapper">
                            <button onClick={() => switchMap(map)} type="button" className="map-type">
                                <img className={map.name===currentLayerMap.name?"selected":""} src={`/images/${map.image}`} alt={`${map.name} image`}/>
                                <span className="map-text">{map.name}</span>
                        </button>
                    </div>
                ))
            }
            </div>
        </div>
    );
};

export default MapSelector;