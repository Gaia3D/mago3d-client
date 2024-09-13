import React, { useEffect, useState, useCallback } from 'react';
import { useGlobeController } from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from 'cesium';
import { PrimitiveCollection, Model } from "cesium";

interface PrimitiveCollectionExtended extends PrimitiveCollection {
    boundingSphere?: Cesium.BoundingSphere;
    _primitives?: Model[];
}

const PrimitivesContent = () => {
    const { globeController, initialized } = useGlobeController();
    const { propPrimitives } = globeController;

    const [priArr, setPriArr] = useState<Model[]>([]);

    const removePrimitive = useCallback((model: Model) => {
        if (!propPrimitives) return;
        propPrimitives.remove(model);
        setPriArr(prevArr => prevArr.filter(p => p !== model));
    }, [propPrimitives]);

    useEffect(() => {
        if (propPrimitives) {
            const primitives = (propPrimitives as PrimitiveCollectionExtended)._primitives || [];
            setPriArr(primitives);
        }
    }, [propPrimitives]);

    const flyTo = async (model: Model) => {
        const { viewer } = globeController;
        if (!viewer) return;

        const boundingSphere = model.boundingSphere || Cesium.BoundingSphere.fromBoundingSpheres(model.boundingSphere);
        if (boundingSphere) {
            const hpr = new Cesium.HeadingPitchRange(0.0, -90.0, 0.0);
            viewer.camera.flyToBoundingSphere(boundingSphere, {
                offset: hpr,
                duration: 2,
            });
        } else {
            console.error("Model does not have a bounding sphere.");
        }
    }

    const toggleVisibility = useCallback((model: Model) => {
        model.show = !model.show;
        setPriArr(prevArr => [...prevArr]);
    }, []);

    return (
        <div>
            {priArr.map((prop: Model, index: number) => (
                <div className="entity-row" key={`${prop.id}-${index}`}>
                    <span className="entity-icon"></span>
                    <span className="entity-name">{prop.id}</span>
                    <div className="entity-buttons">
                        <button className={`${prop.show? 'visible' : 'not-visible'}`} onClick={() => toggleVisibility(prop)}></button>
                        <button className="map-view" onClick={() => flyTo(prop)}></button>
                        <button className="delete" onClick={() => removePrimitive(prop)}></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PrimitivesContent;
