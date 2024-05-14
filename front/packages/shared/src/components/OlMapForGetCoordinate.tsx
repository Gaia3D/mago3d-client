import { useCallback, useEffect, useRef } from "react";
import { Map, MapBrowserEvent, View } from "ol";
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import "ol/ol.css";
import { Coordinate } from "ol/coordinate";
import Feature from 'ol/Feature.js';
import {Vector as VectorSource} from 'ol/source.js';
import {Vector as VectorLayer} from 'ol/layer.js';
import Point from 'ol/geom/Point.js';

const OlMapForGetCoordinate = ({className, on, callback}:{className:string, on:boolean, callback:((coordinate:Coordinate)=>void)}) => {
    const olmapRef = useRef<Map | null>(null);
    const getCoordinate = useCallback((evt: MapBrowserEvent<any>) => {
        if (!on) return;
        iconFeatureRef.current.setGeometry(new Point(evt.coordinate));
        callback(evt.coordinate);

    }, [on]); 

    const iconFeatureRef = useRef<Feature>(new Feature({
        geometry: new Point([0, 0]),
    }));

    const vectorSourceRef = useRef<VectorSource>(new VectorSource({
        features: [iconFeatureRef.current],
    }));
      
    const vectorLayerRef = useRef<VectorLayer<VectorSource>>(new VectorLayer({
        source: vectorSourceRef.current,
    }));
    
    useEffect(() => {
        olmapRef.current = new Map({
            target: 'olmap',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                vectorLayerRef.current
            ],
            view: new View({
                projection: 'EPSG:4326',
                center: [0, 0],
                zoom: 2,
            })
        });
    }, []);

    useEffect(() => {
        if (!olmapRef.current) return;
        const map = olmapRef.current;
        map.on('singleclick', getCoordinate);

        return () => {
            map.un('singleclick', getCoordinate);
        }

    }, [olmapRef.current, on]);
    
    return (
        <div className={className} id="olmap"></div>
    )

}

export default OlMapForGetCoordinate;