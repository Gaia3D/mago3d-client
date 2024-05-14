import { MeasureAngleOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";

export const MeasureAngle = () => {
  const open = useRecoilValue(MeasureAngleOpenState);
  const {globeController} = useGlobeController();
  const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);

  const init = () => {
    const { toolDataSource } = globeController;
    toolDataSource.entities.removeAll();
  }

  useEffect(() => {
    const { handler, toolDataSource } = globeController;
    init();
    if (open) {
      if (!handler) return;
      const cartesians:Cesium.Cartesian3[] = [];
      const postProcess = () => {
        toolDataSource.entities.values.forEach((entity) => {
          if (entity.id === "guidePoint") {
            entity.position = new Cesium.ConstantPositionProperty(new Cesium.Cartesian3(0, 0, 0));
          }
          if (entity.id === "length" && entity.polyline) {
            const cloneCartesians = cartesians.map(cartesian => cartesian.clone());
            entity.polyline.positions = new Cesium.ConstantProperty(cloneCartesians);
          }
          if (entity.id === "angle" && entity.polyline) {
            const cloneCartesians = [cartesians[1], cartesians[2]];
            entity.polyline.positions = new Cesium.ConstantProperty(cloneCartesians);
          }
        });
        
        cartesians.length = 0;
      }

      const addClickPoint = (cartesian: Cesium.Cartesian3) => {
        toolDataSource.entities.add({
          position: cartesian,
          point: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            pixelSize: 10,
            color: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.fromCssColorString('#FF015F'),
            outlineWidth: 2,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          }
        });
      }

      const guideEntity = toolDataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0, 0),
        point: {
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          pixelSize: 10,
          color: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.fromCssColorString('#FF015F'),
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: "guidePoint",
      });

      handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const cartesian = globeController.pickPosition(movement.endPosition);
        if ( !cartesian || cartesians.length === 0) return;

        if (cartesians.length === 1) {
          cartesians.push(cartesian);
        }

        cartesians.pop();
        cartesians.push(cartesian);

        const distanceEntity = toolDataSource.entities.getById("length");
        if (cartesians.length === 2 && distanceEntity && distanceEntity.polyline ) {
          distanceEntity.polyline.positions = new Cesium.CallbackProperty(() =>[cartesians[0], cartesians[1]], false);
        } else if (cartesians.length === 3) {
          const angleEntity = toolDataSource.entities.getOrCreateEntity("angle");
          angleEntity.polyline = new Cesium.PolylineGraphics({
            positions: new Cesium.CallbackProperty(() => [cartesians[1], cartesians[2]], false),
            width: new Cesium.ConstantProperty(2),
            material: new Cesium.ColorMaterialProperty((Cesium.Color.fromCssColorString('#FF015F'))),
            clampToGround: new Cesium.ConstantProperty(true),
          });

          const startPoint = cartesians[0];
          const endPoint1 = cartesians[1];
          const endPoint2 = cartesians[2];
          const difference1 = Cesium.Cartesian3.subtract(endPoint1, startPoint, new Cesium.Cartesian3());
          Cesium.Cartesian3.normalize(difference1, difference1);

          const difference2 = Cesium.Cartesian3.subtract(endPoint1, endPoint2, new Cesium.Cartesian3());
          Cesium.Cartesian3.normalize(difference2, difference2);

          const angle = Cesium.Math.toDegrees(Cesium.Cartesian3.angleBetween(difference1, difference2));
          const angleLabelDistanceEntity = toolDataSource.entities.getOrCreateEntity("angleLabel");
          angleLabelDistanceEntity.position = new Cesium.ConstantPositionProperty(cartesians[1]);
          angleLabelDistanceEntity.label = new Cesium.LabelGraphics({
            text: new Cesium.ConstantProperty(angle.toFixed(2)+'\u00B0'),
            showBackground: true,
            font: '16px sans-serif YELLOW',
            backgroundColor: Cesium.Color.fromCssColorString('#fff').withAlpha(1),
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.fromCssColorString('#FF015F'),
          });
        }

        guideEntity.position = new Cesium.ConstantPositionProperty(cartesian);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = globeController.pickPosition(clicked.position);
        if (!cartesian) return;
        if (cartesians.length === 0) {
          const removes = toolDataSource.entities.values.filter(entity => {
            return entity.id !== "guidePoint" && entity.id !== "areaLabel" && entity.id !== "length" && entity.id !== "area" && entity.id !== "angle";
          });
          removes.forEach(entity => toolDataSource.entities.remove(entity));
        }
        cartesians.push(cartesian);

        if(cartesians.length === 1) {
          const distanceEntity = toolDataSource.entities.getOrCreateEntity("length");
          distanceEntity.polyline = new Cesium.PolylineGraphics({
            positions: new Cesium.CallbackProperty(() => cartesians, false),
            width: new Cesium.ConstantProperty(2),
            material: new Cesium.ColorMaterialProperty((Cesium.Color.fromCssColorString('#FF015F'))),
            clampToGround: new Cesium.ConstantProperty(true),
          });

          const angleDistanceEntity = toolDataSource.entities.getOrCreateEntity("angle");
          toolDataSource.entities.remove(angleDistanceEntity);
        }

        addClickPoint(cartesian);

        if (cartesians.length === 4) {
          postProcess();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 
    } else {
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

      setSelectedTool(null);
    }
  }, [open]);
  
  return null;
}