import React, {useEffect, useState} from 'react';
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from 'cesium';
import {PrimitiveCollection, Model} from "cesium";


interface PrimitiveCollectionExtended extends PrimitiveCollection {
    boundingSphere?: Cesium.BoundingSphere;
    _primitives?: Model[];
}

const PrimitivesContent = () => {
    const { globeController, initialized } = useGlobeController();
    const { propPrimitives } = globeController;

    const [priArr, setPriArr] = useState<Model[]>([]);

    const removePrimitive = (model: Model) => {
        if (!propPrimitives) return;
        propPrimitives.remove(model);
        setPriArr(prevArr => prevArr.filter(p => p !== model)); // 상태에서 제거
    };

    useEffect(() => {
        if (propPrimitives) {
            const primitives = (propPrimitives as PrimitiveCollectionExtended)._primitives || [];
            setPriArr(primitives);
        }
    }, [propPrimitives.length]);

    const flyTo = async (model : Model) => {
        const {viewer} = globeController;
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

    const toggleVisibility = (model : Model) => {
        model.show = !model.show;
    }

    return (
        <div>
            {
                priArr.map((prop: Model, index: number) => (
                    <div key={`${prop.id}-${index}`}>
                        <span>{prop.id}</span>
                        <button onClick={() => toggleVisibility(prop)}>view</button>
                        <button onClick={() => flyTo(prop)}>fly</button>
                        <button onClick={() => removePrimitive(prop)}>del</button>
                    </div>
                ))
            }
        </div>
    );
};

export default PrimitivesContent;
