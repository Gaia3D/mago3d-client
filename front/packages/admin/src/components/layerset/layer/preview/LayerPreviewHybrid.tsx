import {
    ApplyLayerStyleDocument, CreateLayerStyleDocument,
    CreateStyleInput, DeleteLayerStyleDocument,
    LayerAsset,
    LayersetAssetDocument, RemoteDocument, RemoteQueryVariables, UpdateLayerStyleDocument
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {getWmsLayer, getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";
import {createCesiumViewer} from "@src/utils/createCesiumViewer";
import {useLayerStyleMutations} from "@src/hooks/useLayerStyleMutation";

const LayerPreviewHybrid = ({asset}:{asset:LayerAsset}) => {

    const {properties} = asset;
    const {layerGroup} = properties;

    const {register, handleSubmit, reset} = useForm<CreateStyleInput>();

    const {
        createStyle,
        updateStyle,
        deleteStyle,
    } = useLayerStyleMutations(asset.id, {
        applyStyle: [LayersetAssetDocument],
        createStyle: [],
        updateStyle: [LayersetAssetDocument],
        deleteStyle: [LayersetAssetDocument],
    });

    const defaultStyles = asset.styles?.filter(style => style.defaultStatus);
    const defaultStyle = defaultStyles?.[0];

    const [styleName, setStyleName] = useState<string>(defaultStyle?.name ?? "");
    const [opacity, setOpacity] = useState<number>(defaultStyle?.context?.opacity ?? 1);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const imageLayerRef = useRef<Cesium.ImageryLayer | null>(null);

    useEffect(() => {
        const viewer = createCesiumViewer("preview-layer");

        const imageLayer = getWmsLayer(layerGroup.workspace.name + ":" + layerGroup.title);
        viewer.imageryLayers.add(imageLayer);
        imageLayerRef.current = imageLayer;

        const {minx, maxx, miny, maxy, crs} = layerGroup.bounds;
        const extent = Cesium.Rectangle.fromDegrees(minx, miny, maxx, maxy);
        viewer.camera.flyTo({
            destination: extent,
            duration: 2,
            complete: () => {
                viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
                viewerRef.current = viewer;
            }
        });

        return () => {
            viewer.destroy();
        }
    }, [asset]);

    useEffect(() => {
        if (!viewerRef.current || !imageLayerRef.current) return;

        imageLayerRef.current.alpha = opacity;

    }, [opacity]);

    useEffect(() => {
        if (!viewerRef.current || !imageLayerRef.current) return;

        if (asset.styles.length > 0) return;
        resetStyle();

    }, [asset]);

    const resetStyle = () => {
        setStyleName("");
        setOpacity(1);
        reset();
    }

    const handleStrokeOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // 입력된 투명도로 opacity 상태를 업데이트합니다.
        setOpacity(Number(event.target.value) / 100);
    };

    const onSubmitStyle: SubmitHandler<CreateStyleInput> = (input) => {
        input.context.raster.opacity /= 100;

        if (!defaultStyle) {
            createStyle({ variables: { input } });
        } else {
            updateStyle({ variables: { id: defaultStyle.id, input } });
        }
    };

    const toDelete = () => {
        if (!confirm(`스타일 [${styleName}]을 삭제하시겠습니까?`)) return;
        deleteStyle({ variables: { id: defaultStyle?.id } });
    }

    return (
      <>
          <div>
              <form onSubmit={handleSubmit(onSubmitStyle)}>
                  <label>스타일명</label>
                  <input type="text" defaultValue={styleName} {...register("name", {
                      required: {
                          value: true,
                          message: "스타일명을 입력해주시기 바랍니다."
                      },
                      value: styleName,
                      onChange: (event) => setStyleName(event.target.value)
                  })}/>
                  <label>투명도</label>
                  <input type="range" min={0} max={100} defaultValue={opacity * 100}
                         {...register("context.raster.opacity", {
                             value: opacity * 100,
                             onChange: handleStrokeOpacityChange
                         })}/>
                  <div className="alg-right">
                      <button type="submit" className="btn-l-save">저장</button>
                      <button type="button" className="btn-l-delete" onClick={toDelete}>삭제</button>
                      <button type="button" className="btn-l-delete" onClick={resetStyle}>초기화</button>                      
                  </div>
              </form>
          </div>
          <div className="preview-layer" id="preview-layer"></div>
      </>
    )
}

export default LayerPreviewHybrid;