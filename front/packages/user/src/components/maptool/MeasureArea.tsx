import { MeasureAreaOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";
import { polygon as turfPolygon, area as turfArea, centerOfMass} from "@turf/turf"

const getUnitFactor = (unit: string) => {
  switch(unit) {
    case "m²": return 1;
    case "km²": return 1000000;
    case "yd²": return 0.836127;
    case "mi²": return 2589988.11;
    case "acre": return 4046.865;
    case "ha": return 10000;
    default: return 1;
  }
}

const getPolygon = (cartesians: Cesium.Cartesian3[]) => {
  const lonlats = cartesians.map(cartesian => {
    const carto = Cesium.Cartographic.fromCartesian(cartesian)
    return [Cesium.Math.toDegrees(carto.longitude), Cesium.Math.toDegrees(carto.latitude)];
  });
  lonlats.push(lonlats[0]);
  return turfPolygon([lonlats]);
}

export const MeasureArea = () => {
  const el = document.querySelector("#map");
  const [open, setOpen] = useRecoilState(MeasureAreaOpenState);
  const [unit, setUnit] = useState("m²");
  const [result, setResult] = useState('0 m²');
  const {globeController} = useGlobeController();
  const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);

  const init = () => {
    const { toolDataSource } = globeController;
    toolDataSource.entities.removeAll();
    setResult('');
  }
  const getArea = (cartesians:Cesium.Cartesian3[]) => {
    if (cartesians.length < 3) return 0;
    const polygon = getPolygon(cartesians);
    const area = turfArea(polygon);
    const result = `${Math.round(area / getUnitFactor(unit) * 100) / 100} ${unit}`;
    setResult(result);
    return result;
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
          if (entity.id === "area" && entity.polygon) {
            const cloneCartesians = cartesians.map(cartesian => cartesian.clone());
            entity.polygon.hierarchy =  new Cesium.ConstantProperty(new Cesium.PolygonHierarchy(cloneCartesians));
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
      const areaLabelEntity = toolDataSource.entities.add({
        position: Cesium.Cartesian3.fromDegrees(0,0),
        label: {
          text: 'asdfasdf',
          showBackground: true,
          font: '16px sans-serif YELLOW',
          backgroundColor: Cesium.Color.fromCssColorString('#FFF').withAlpha(1),
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.fromCssColorString('#FF015F'),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        id: "areaLabel",
      });
      handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const cartesian = globeController.pickPosition(movement.endPosition);
        if ( !cartesian || cartesians.length === 0) return;

        if (cartesians.length === 1) {
          cartesians.push(cartesian);
        }

        cartesians.pop();
        cartesians.push(cartesian);

        if (cartesians.length === 3) {
          const areaDistanceEntity = toolDataSource.entities.getOrCreateEntity("area");
          areaDistanceEntity.polygon = new Cesium.PolygonGraphics({
            hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(cartesians), false),
            material: Cesium.Color.fromCssColorString('#FF015F').withAlpha(0.5),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          });
        }

        if (cartesians.length > 2) {
          const center = centerOfMass(getPolygon(cartesians));
          const {coordinates} = center.geometry;
          
          const a = Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1], 2000);
          
          if (areaLabelEntity.label) {
            areaLabelEntity.position = new Cesium.ConstantPositionProperty(a);
            areaLabelEntity.label.text = new Cesium.ConstantProperty(getArea(cartesians));
          }
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

          const areaDistanceEntity = toolDataSource.entities.getOrCreateEntity("area");
          toolDataSource.entities.remove(areaDistanceEntity);
        }

        addClickPoint(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 

      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = globeController.pickPosition(clicked.position);
        if (!cartesian || cartesians.length < 3) return;
        addClickPoint(cartesian);
        postProcess();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      
    } else {
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
  }, [open, unit]);
  const node = (
    <div className="dialog-distance darkMode">
      <div className="dialog-title">
        <h3>면적측정</h3>
        <button className="close floatRight" onClick={()=>{setOpen(false);setSelectedTool(null)}}></button>						
      </div>
      <div className="dialog-content">
        <label> 면적단위</label>
        <select value={unit} onChange={(e)=>setUnit(e.target.value)}>
          <option value="m²">m² (제곱미터)</option>
          <option value="km²">km² (제곱킬로미터)</option>
          <option value="yd²">yd² (제곱야드)</option>
          <option value="mi²">mi² (제곱마일)</option>
          <option value="acre">acre (에이커)</option>
          <option value="ha">ha (헥타르)</option>
        </select>
      </div>
      <div className="dialog-result">
        <span className="dialog-result-text">측정면적 </span>
        <span className="dialog-result-value">{result}</span>
      </div>
      <div className="darkMode-btn">
        <button type="button" className="cancel" onClick={init}><a>초기화</a></button>
      </div>
    </div>
  )
  return el && open ? ReactDOM.createPortal(node, el) : null;
}