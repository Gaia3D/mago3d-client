import {
    ApplyLayerStyleDocument, CreateLayerStyleDocument,
    CreateStyleInput, DeleteLayerStyleDocument,
    LayerAsset,
    LayersetAssetDocument, RemoteDocument, RemoteQueryVariables, UpdateLayerStyleDocument
} from "@src/generated/gql/layerset/graphql";
import {useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {SubmitHandler, useForm} from "react-hook-form";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {getWmsLayer, getWmsLayerImageProvider} from "@src/components/layerset/utils/utils";

const LayerPreviewHybrid = ({asset}:{asset:LayerAsset}) => {

    const {properties} = asset;
    const {layerGroup} = properties;

    const {register, handleSubmit, reset} = useForm<CreateStyleInput>();

    const [ applyStyle ] = useMutation(ApplyLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 적용되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ createStyle ] = useMutation(CreateLayerStyleDocument, {
        onCompleted: (data) => {
            //console.info(data);
            const {id} = asset;
            applyStyle({ variables: { id: id, styleId: data.createStyle.id } });
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ updateStyle ] = useMutation(UpdateLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 적용되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const [ deleteStyle ] = useMutation(DeleteLayerStyleDocument, {
        refetchQueries: [LayersetAssetDocument],
        onCompleted: (data) => {
            //console.info(data);
            alert("스타일이 삭제되었습니다.");
        },
        onError: (error) => {
            console.error(error);
            alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
        }
    });

    const defaultStyles = asset.styles?.filter(style => style.defaultStatus);
    const defaultStyle = defaultStyles?.[0];

    const [styleName, setStyleName] = useState<string>(defaultStyle?.name ?? "");
    const [opacity, setOpacity] = useState<number>(defaultStyle?.context?.opacity ?? 1);
    const viewerRef = useRef<Cesium.Viewer | null>(null);
    const imageLayerRef = useRef<Cesium.ImageryLayer | null>(null);

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