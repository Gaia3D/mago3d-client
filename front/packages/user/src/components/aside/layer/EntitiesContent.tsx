import React, { useEffect, useState, useCallback } from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import { CustomDataSource } from "cesium";
import * as Cesium from "cesium";

interface CustomDataSourceExtended extends CustomDataSource {
    boundingSphere?: Cesium.BoundingSphere;
    _primitives?: {
        _primitives?: Array<{
            boundingSphere?: Cesium.BoundingSphere;
        }>;
    };
}

const EntitiesContent = () => {
    const { globeController, initialized } = useGlobeController();
    const {
        viewer,
        eventDataSource,
        analysisDataSource,
        mapnoteDataSource,
        timeseriesDataSource,
        toolDataSource,
    } = globeController;
    const [dsCol, setDsCol] = useState<CustomDataSourceExtended[]>([]);

    const getDataSourceCollection = useCallback(() => {
        if (!viewer) return;
        const dataSources = viewer.dataSources;
        
        // 초기 설정에서 만든 data source 는 제외하기 위함
        const excludedDataSources = [
            eventDataSource,
            analysisDataSource,
            mapnoteDataSource,
            timeseriesDataSource,
            toolDataSource,
        ];

        const customDataSources: CustomDataSourceExtended[] = [];
        for (let i = 0; i < dataSources.length; i++) {
            const ds = dataSources.get(i) as CustomDataSourceExtended;
            if (!excludedDataSources.includes(ds)) {
                customDataSources.push(ds);
            }
        }
        setDsCol(customDataSources);
    }, [viewer, eventDataSource, analysisDataSource, mapnoteDataSource, timeseriesDataSource, toolDataSource]);

    useEffect(() => {
        getDataSourceCollection();
    }, [getDataSourceCollection]);

    const toggleVisibility = (ds: CustomDataSourceExtended) => {
        ds.show = !ds.show;
        setDsCol(prevArr => [...prevArr]);
    };

    const flyTo = async (ds: CustomDataSourceExtended) => {
        if (!viewer) return;
        const hpr = new Cesium.HeadingPitchRange(0.0, -90.0, 0.0);
        try {
            await viewer.flyTo(ds, { offset: hpr, duration: 2 });
        } catch {
            const boundingSphere = ds.boundingSphere || ds._primitives?._primitives?.[1]?.boundingSphere;
            if (boundingSphere) {
                viewer.camera.flyToBoundingSphere(boundingSphere, { offset: hpr, duration: 2 });
            }
        }
    };

    const removePrimitive = (ds: CustomDataSourceExtended) => {
        if (!viewer) return;
        viewer.dataSources.remove(ds);
        setDsCol(prevDsCol => prevDsCol.filter(data => data !== ds));
    };

    return (
        <div>
            {dsCol.map((ds, index) => (
                <div className="entity-row" key={`${ds.name}-${index}`}>
                    <span className="entity-icon"></span>
                    <span className="entity-name">{ds.name}</span>
                    <div className="entity-buttons">
                        <button className={`${ds.show? 'visible' : 'not-visible'}`} onClick={() => toggleVisibility(ds)}></button>
                        <button className="map-view" onClick={() => flyTo(ds)}></button>
                        <button className="delete" onClick={() => removePrimitive(ds)}></button>
                    </div>
                </div>

            ))}
        </div>
    );
};

export default EntitiesContent;
