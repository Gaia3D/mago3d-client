import { MeasureDistanceOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";
import {useTranslation} from "react-i18next";

const getUnitFactor = (unit: string) => {
  switch(unit) {
    case "m": return 1;
    case "km": return 1000;
    case "nmi": return 1852;
    case "in": return 0.0254;
    case "ft": return 0.3048;
    case "yd": return 0.9144;
    case "mi": return 1609.344;
    default: return 1;
  }
}

export const MeasureDistance = () => {
  const {t} = useTranslation();
  const el = document.querySelector("#map");
  const [open, setOpen] = useRecoilState(MeasureDistanceOpenState);
  const [unit, setUnit] = useState("m");
  const [result, setResult] = useState('0 m');
  const {globeController} = useGlobeController();
  const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);

  const getUnitDistance = (distance:number) => `${Math.round(distance / getUnitFactor(unit) * 100) / 100} ${unit}`;
  const init = () => {
    const { toolDataSource } = globeController;
    toolDataSource.entities.removeAll();
    setResult('');
  }
  useEffect(() => {
    const { handler, toolDataSource } = globeController;
    init();
    if (open) {
      if (!handler) return;
      const cartesians:Cesium.Cartesian3[] = [];

      const getText = (cartesians:Cesium.Cartesian3[]) => {
        if (cartesians.length === 1) return "";

        const distance = cartesians.reduce((acc, cur, idx, arr) => {
          if (idx === 0) return acc;
          const prev = arr[idx - 1];
          return acc + Cesium.Cartesian3.distance(prev, cur);
        }, 0);

        const result = getUnitDistance(distance);
        setResult(result);
        return getUnitDistance(distance);
      }
      const postProcess = () => {
        toolDataSource.entities.values.forEach((entity, index) => {
          if (entity.id === "guidePoint") {
            entity.position = new Cesium.ConstantPositionProperty(new Cesium.Cartesian3(0, 0, 0));
          }

          if (entity.id === "length" && entity.polyline) {
            const cloneCartesians = cartesians.map(cartesian => cartesian.clone());
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
          },
          label: {
            text: getText(cartesians),
            showBackground: true,
            font: '16px sans-serif YELLOW',
            backgroundColor: Cesium.Color.fromCssColorString('#fff').withAlpha(1),
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            style: Cesium.LabelStyle.FILL,
            fillColor: Cesium.Color.fromCssColorString('#FF015F'),
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
        label: {
          text: '',
          showBackground: true,
          font: '16px sans-serif YELLOW',
          backgroundColor: Cesium.Color.fromCssColorString('#fff').withAlpha(1),
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          style: Cesium.LabelStyle.FILL,
          fillColor: Cesium.Color.fromCssColorString('#FF015F'),
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

        guideEntity.position = new Cesium.ConstantPositionProperty(cartesian);
        if(guideEntity.label) guideEntity.label.text = new Cesium.ConstantProperty(getText(cartesians));
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = globeController.pickPosition(clicked.position);
        if (!cartesian) return;
        if (cartesians.length === 0) {
          const removes = toolDataSource.entities.values.filter(entity => {
            return entity.id !== "guidePoint" && entity.id !== "length" && entity.id !== "area" && entity.id !== "angle";
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
        }

        addClickPoint(cartesian);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK); 

      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const cartesian = globeController.pickPosition(clicked.position);
        if (!cartesian) return;
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
      <div className="pop-layer-sub measure">
        <div className="pop-layer-header">
          <h3 className="title">{t("measure.distance")}</h3>
          {/*<div className="close-button"></div>*/}
        </div>
        <div className="pop-layer-content">
          <div className="value-container">
            <label>{t("measure.distance-unit")}</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="m">{t("measure.m")}</option>
              <option value="km">{t("measure.km")}</option>
              <option value="nmi">{t("measure.nmi")}</option>
              <option value="in">{t("measure.in")}</option>
              <option value="ft">{t("measure.ft")}</option>
              <option value="yd">{t("measure.yd")}</option>
              <option value="mi">{t("measure.mi")}</option>
            </select>
          </div>
          <div className="value-container">
            <label>{t("measure.measure-distance")}</label>
            <input type="text" value={result}/>
          </div>
          {/*<button type="button" className="cancel" onClick={init}><a>초기화</a></button>*/}
        </div>
      </div>
)
  return el && open ? ReactDOM.createPortal(node, el) : null;
}