import { MeasureComplexOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";

const labelDefualt = {
  text: '',
  font: 'bold 20px sans-serif',
  fillColor: Cesium.Color.YELLOW,
  outlineColor : Cesium.Color.BLACK,
  outlineWidth : 5,
  style: Cesium.LabelStyle.FILL_AND_OUTLINE,
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
}
//$('#componentDistanceZenith').text(`천정각 : ${(90 - angle).toFixed(2)} º`);
//$('#componentDistanceElevation').text(`고도각 : ${angle.toFixed(2)} º`);
//$('#componentDistanceStraight').text(`직선거리 : ${straightDistance.toFixed(2)} m`);
//$('#componentDistanceHorizon').text(`수평거리 : ${horizonDistance.toFixed(2)} m`);
//$('#componentDistanceHeight').text(`수직거리 : ${height.toFixed(2)} m`);
type MeasureComplexResult = {
  zenith: string;
  elevation: string;
  straight: string;
  horizon: string;
  height: string;
}

const defaultResult: MeasureComplexResult = {
  zenith: '',
  elevation: '',
  straight: '',
  horizon: '',
  height: '',
}

export const MeasureComplex = () => {
  const el = document.querySelector("#map");
  const [open, setOpen] = useRecoilState(MeasureComplexOpenState);
  const [result, setResult] = useState<MeasureComplexResult>(defaultResult);
  const {globeController} = useGlobeController();
  const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);

  const init = () => {
    const { toolDataSource, toolPrimitives } = globeController;
    toolDataSource.entities.removeAll();
    toolPrimitives.removeAll();
    setResult(defaultResult);
  }

  useEffect(() => {
    const { handler, toolDataSource, toolPrimitives } = globeController;
    init();
    if (open) {
      if (!handler) return;
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
      const cartesians:Cesium.Cartesian3[] = [];
      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) =>{
          if (cartesians.length > 0) return;

          const cartesian = globeController.pickPosition(clicked.position);
          if (!cartesian) return;

          const removes = toolDataSource.entities.values.filter(entity => {
            return entity.id !== "angleLabel" && entity.id !== "horizontalDistanceLabel" && entity.id !== "straightDistanceLabel" && entity.id !== "heightDistanceLabel";
          });
          removes.forEach(entity => toolDataSource.entities.remove(entity));
          toolPrimitives.removeAll();
          
          const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
          const tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height);

          cartesians.push(tempPosition);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
        const cartesian = globeController.pickPosition(movement.endPosition);
        if(cartesian != null) {
          if (cartesians.length === 0) {
            //$('.drawTooltip').show();
            //$('.drawTooltip').html("<li>새로운 점을 추가하려면 마우스 왼쪽 버튼을 클릭하세요.</li>");
          }
          else {              
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude), cartographic.height);

            const firstPoint = cartesians[0];
            const firstCartographic = Cesium.Cartographic.fromCartesian(firstPoint);
            const heightPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(firstCartographic.longitude),Cesium.Math.toDegrees(firstCartographic.latitude), cartographic.height);
            const height = cartographic.height - firstCartographic.height;
            const heightLabelPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(firstCartographic.longitude),
                                    Cesium.Math.toDegrees(firstCartographic.latitude), firstCartographic.height + height / 2);

            const horizonDistance = Math.abs(Cesium.Cartesian3.distance(heightPosition, tempPosition));
            const horizonDistancePosition = Cesium.Cartesian3.midpoint(heightPosition, tempPosition, new Cesium.Cartesian3());
            const straightDistance = Math.abs(Cesium.Cartesian3.distance(tempPosition, firstPoint));
            const straightDistancePosition = Cesium.Cartesian3.midpoint(tempPosition, firstPoint, new Cesium.Cartesian3());

            if(cartesians.length === 1) {
              cartesians.push(heightPosition);
              cartesians.push(tempPosition);
              cartesians.push(firstPoint);

              //각도
              const angleLabelEntity = toolDataSource.entities.getOrCreateEntity('angleLabel');
              angleLabelEntity.position = new Cesium.ConstantPositionProperty(firstPoint);
              angleLabelEntity.label = new Cesium.LabelGraphics(labelDefualt);
              angleLabelEntity.label.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(0, 25));
              //수평거리
              const horizontalDistanceLabelEntity = toolDataSource.entities.getOrCreateEntity('horizontalDistanceLabel');
              horizontalDistanceLabelEntity.label = new Cesium.LabelGraphics(labelDefualt);
              horizontalDistanceLabelEntity.label.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(0, -30));
              //수직거리
              const straightDistanceLabelEntity = toolDataSource.entities.getOrCreateEntity('straightDistanceLabel');
              straightDistanceLabelEntity.label = new Cesium.LabelGraphics(labelDefualt);
              straightDistanceLabelEntity.label.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(0, -10));
              //높이
              const heightLabelEntity = toolDataSource.entities.getOrCreateEntity('heightDistanceLabel');
              heightLabelEntity.label = new Cesium.LabelGraphics(labelDefualt);
              heightLabelEntity.label.pixelOffset = new Cesium.ConstantProperty(new Cesium.Cartesian2(-50, 0));
            } else {
              cartesians[1] = heightPosition;
              cartesians[2] = tempPosition;
                //guideEntity.position = tempPosition;

              const startPoint = firstPoint.clone();
              const endPoint = tempPosition.clone();

              const difference = Cesium.Cartesian3.subtract(endPoint, startPoint, new Cesium.Cartesian3());
              Cesium.Cartesian3.normalize(difference, difference);

              const surfaceNormal = Cesium.Cartesian3.normalize(startPoint, new Cesium.Cartesian3());
              const dotProduct = Cesium.Cartesian3.dot(difference, surfaceNormal);
              const angle = 90 - Cesium.Math.toDegrees(Math.acos(dotProduct));

              const angleLabelEntity = toolDataSource.entities.getOrCreateEntity('angleLabel');
              if (angleLabelEntity.label) angleLabelEntity.label.text = new Cesium.ConstantProperty(angle.toFixed(2)+'\u00B0');

              const horizontalDistanceLabelEntity = toolDataSource.entities.getOrCreateEntity('horizontalDistanceLabel');
              horizontalDistanceLabelEntity.position = new Cesium.ConstantPositionProperty(horizonDistancePosition);
              if (horizontalDistanceLabelEntity.label) horizontalDistanceLabelEntity.label.text = new Cesium.ConstantProperty(horizonDistance.toFixed(2) + 'm');

              const straightDistanceLabelEntity = toolDataSource.entities.getOrCreateEntity('straightDistanceLabel');
              straightDistanceLabelEntity.position = new Cesium.ConstantPositionProperty(straightDistancePosition);
              if (straightDistanceLabelEntity.label) straightDistanceLabelEntity.label.text = new Cesium.ConstantProperty(straightDistance.toFixed(2) + 'm');

              const heightLabelEntity = toolDataSource.entities.getOrCreateEntity('heightDistanceLabel');
              heightLabelEntity.position = new Cesium.ConstantPositionProperty(heightLabelPosition);
              if (heightLabelEntity.label) heightLabelEntity.label.text = new Cesium.ConstantProperty(height.toFixed(2) + 'm');

              //$('#componentDistanceZenith').text(`천정각 : ${(90 - angle).toFixed(2)} º`);
              //$('#componentDistanceElevation').text(`고도각 : `);
              //$('#componentDistanceStraight').text(`직선거리 : ${straightDistance.toFixed(2)} m`);
              //$('#componentDistanceHorizon').text(`수평거리 : ${horizonDistance.toFixed(2)} m`);
              //$('#componentDistanceHeight').text(`수직거리 : ${height.toFixed(2)} m`);

              setResult({
                zenith: `${(90 - angle).toFixed(2)} º`,
                elevation: `${angle.toFixed(2)} º`,
                straight: `${straightDistance.toFixed(2)} m`,
                horizon: `${horizonDistance.toFixed(2)} m`,
                height: `${height.toFixed(2)} m`,
              });
            }

            toolPrimitives.removeAll();
            toolPrimitives.add(
              new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                  geometry: new Cesium.PolylineGeometry({
                    positions: cartesians.slice(0,3),
                    width: 3.0,
                    colors: [Cesium.Color.DEEPSKYBLUE, Cesium.Color.CHARTREUSE],
                    colorsPerVertex: false
                  }),
                }),
                appearance: new Cesium.PolylineColorAppearance({
                  translucent : false,
                }),
                depthFailAppearance: new Cesium.PolylineColorAppearance({
                  translucent : true,
                }),
              })
            );

            toolPrimitives.add(
              new Cesium.Primitive({
                geometryInstances: new Cesium.GeometryInstance({
                  geometry: new Cesium.PolylineGeometry({
                    positions: cartesians.slice(2,4),
                    width: 3.0
                  }),
                }),
                appearance: new Cesium.PolylineMaterialAppearance({
                  material: new Cesium.Material({
                    fabric: {
                      type: 'PolylineDash',
                      uniforms: {
                        color: Cesium.Color.GOLD
                      }
                    }
                  }),
                }),
                depthFailAppearance: new Cesium.PolylineMaterialAppearance({
                  material: new Cesium.Material({
                    fabric: {
                      type: 'PolylineDash',
                      uniforms: {
                        color: Cesium.Color.GOLD.withAlpha(0.5)
                      }
                    }
                  }),
                }),
              })
            );
            //$('.drawTooltip').show();
            // $('.drawTooltip').html("<li>연속으로 측정하시려면 마우스 왼쪽 버튼을 클릭하세요.</li><li>측정을 종료하려면 마우스 오른쪽 버튼을 클릭하세요.</li>");
          }
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction((clicked: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        if (cartesians.length < 2) {
          return;
        }  
        cartesians.length = 0;
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    } else {
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      handler?.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
  }, [open]);
  const node = (
    <div className="dialog-distance darkMode">
      <div className="dialog-title">
        <h3>복합거리 측정</h3>
        <button className="close floatRight" onClick={()=>{setOpen(false);setSelectedTool(null)}}></button>						
      </div>
      <div className="dialog-result-02">
        <span className="dialog-result-text">천정각</span> <span className="dialog-result-value">{result.zenith}</span>
        <span className="dialog-result-text">고도각</span> <span className="dialog-result-value">{result.elevation}</span>
        <span className="dialog-result-text">직선거리</span> <span className="dialog-result-value">{result.straight}</span>
        <span className="dialog-result-text">수평거리</span> <span className="dialog-result-value">{result.horizon}</span>
        <span className="dialog-result-text">수직거리</span> <span className="dialog-result-value">{result.height}</span>
      </div>
      <div className="darkMode-btn">
        <button type="button" className="cancel" onClick={init}><a>초기화</a></button>
      </div>
    </div>
  )
  return el && open ? ReactDOM.createPortal(node, el) : null;
}