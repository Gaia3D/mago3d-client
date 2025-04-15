import {useEffect} from "react";
import * as Cesium from "cesium";
import {LayerAsset} from "@src/generated/gql/layerset/graphql";
import {getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";
import {createCesiumViewer} from "@src/utils/createCesiumViewer";

const LayerPreview3dTile = ({asset}:{asset:LayerAsset}) => {
    
    useEffect(() => {
        const viewer = createCesiumViewer("preview-layer");

        const tilesPrimitives = new Cesium.PrimitiveCollection();
        viewer?.scene.primitives.add(tilesPrimitives);

        const {properties} = asset;
        const {resource} = properties;
        Cesium.Cesium3DTileset.fromUrl(import.meta.env.VITE_API_URL + resource)
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