import {useEffect} from "react";
import * as Cesium from "cesium";
import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";

const LayerPreview3dTile = ({asset}:{asset:LayerAsset}) => {
    
    useEffect(() => {
        const viewer = new Cesium.Viewer('preview-layer', {
            geocoder: false,
            homeButton: false,
            baseLayerPicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            animation: false,
            timeline: false,
            fullscreenButton: false,
            shouldAnimate: true,
            infoBox: false,
            selectionIndicator: false,
        });

        viewer.imageryLayers.removeAll();
        // 운영환경에서는 배경지도를 WMS로 설정
        if (import.meta.env.MODE === 'production' && import.meta.env.VITE_BASE_LAYER_NAME) {
            const baseImageryProvider = getWmsLayerImageProvider(import.meta.env.VITE_BASE_LAYER_NAME);
            viewer.imageryLayers.addImageryProvider(baseImageryProvider);
        } else {
            // 개발환경에서는 OSM으로 설정
            const osmImageryProvider = new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' });
            viewer.imageryLayers.addImageryProvider(osmImageryProvider);
        }

        const tilesPrimitives = new Cesium.PrimitiveCollection();
        viewer?.scene.primitives.add(tilesPrimitives);

        const {properties} = asset;
        const {resource} = properties;
        Cesium.Cesium3DTileset.fromUrl(resource)
          .then((model) => {
              tilesPrimitives.add(model);
              viewer.flyTo(model, {duration: 0.1});
          });

        return () => {
            viewer.destroy();
        }
    }, [])
    return (
        <div className="preview-layer" id="preview-layer"></div>
    )
}

export default LayerPreview3dTile;