import React, {useRef} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {backgroundsState, SelectedBackgroundState} from "@/recoils/Layer.ts";
import {LayerBackground} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

const MapSelector = () => {

  const backgrounds = useRecoilValue(backgroundsState);
  const [selectedBackground, setSelectedBackground] = useRecoilState(SelectedBackgroundState);
  const mapRef = useRef<HTMLDivElement>(null);

  const switchMap = (map: LayerBackground) => {
      setSelectedBackground(map);
      localStorage.setItem('BACKGROUND_MAP_ID', map.id);
  }

  const toggleMapSelector = () => {
      mapRef.current?.classList.toggle("expand");
  }

  return (
      <div onClick={toggleMapSelector} ref={mapRef} className="map-selector-container background-map">
          <button type="button" className="map-type-current">
              <span className={`span-img ${selectedBackground.image}`}></span>
              {/*<img className="selected" src={`/images/${selectedBackground.image}`} alt={`${selectedBackground.name} image`}/>*/}
          </button>
          <div className="pop-layer background-map-select-layer">
              {
                backgrounds.map(map => (
                      <div key={map.name} className="map-wrapper">
                          <button onClick={() => switchMap(map)} type="button" className="map-type">
                              <span className={`span-img ${map.image} ${map.name===selectedBackground.name?"selected":""}`}></span>
                              {/*<img className={map.name===selectedBackground.name?"selected":""} src={`/images/${map.image}.png`} alt={`${map.name} image`}/>*/}
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