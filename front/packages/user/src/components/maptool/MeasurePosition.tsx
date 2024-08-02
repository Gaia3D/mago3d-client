import { MeasurePositionOpenState, ToolStatus, ToolStatusState } from "@/recoils/Tool";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import  * as Cesium from "cesium";

const color = Cesium.Color.RED;
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

export const MeasurePosition = () => {
    const el = document.querySelector("#map");
    const [open, setOpen] = useRecoilState(MeasurePositionOpenState);
    const [unit, setUnit] = useState("m");
    const [result, setResult] = useState({ lat: 0, lon: 0, height: 0 });
    const {globeController} = useGlobeController();
    const setSelectedTool = useSetRecoilState<ToolStatus>(ToolStatusState);

    const getUnitHeight = (distance:number) => `${Math.round(distance / getUnitFactor(unit) * 100) / 100} ${unit}`;
    const init = () => {
        const { toolDataSource } = globeController;
        toolDataSource.entities.removeAll();
        setResult({ lat: 0, lon: 0, height: 0 });
    }

    useEffect(() => {
        const { handler, toolDataSource } = globeController;
        init();

        if (open) {
            if (!handler) return;

            handler.setInputAction((movement: any) => {
                const cartesian = globeController.pickPosition(movement.position);
                if ( !cartesian ) return;

                const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                const lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(6));
                const lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(6));
                const height = parseFloat(getUnitHeight(parseFloat(cartographic.height.toFixed(2))));

                setResult({ lat, lon, height });

                toolDataSource.entities.add({
                    position: cartesian,
                    point: {
                        show: true,
                        pixelSize: 5,
                        color: color,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY
                    },
                    label: {
                        text: `Lat: ${lat}\nLon: ${lon}\nHeight: ${height} ${unit}`,
                        show: true,
                        font: '14px monospace',
                        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        pixelOffset: new Cesium.Cartesian2(-15, 0),
                        fillColor: color,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        outlineWidth: 0,
                        outlineColor: color
                    }
                });
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        } else {
            handler?.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    }, [open, globeController, unit]);


    const node = (
        <div className="dialog-distance darkMode">
            <div className="dialog-title">
                <h3>위치측정</h3>
                {/*<button className="close floatRight" onClick={()=>{setOpen(false); setSelectedTool(null);}}></button>*/}
            </div>
            <div className="dialog-content">
                <div>
                    <span className="dialog-result-text">거리단위 </span>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="m">m (미터)</option>
                        <option value="km">km (킬로미터)</option>
                        <option value="nmi">nmi (해리)</option>
                        <option value="in">in (인치)</option>
                        <option value="ft">ft (피트)</option>
                        <option value="yd">yd (야드)</option>
                        <option value="mi">mi (마일)</option>
                    </select>
                </div>
                <div>
                    <span className="dialog-result-text">위도: </span>
                    <span className="dialog-result-value">{result.lat}</span>
                </div>
                <div>
                    <span className="dialog-result-text">경도: </span>
                    <span className="dialog-result-value">{result.lon}</span>
                </div>
                <div>
                <span className="dialog-result-text">고도: </span>
                    <span className="dialog-result-value">{result.height} {unit}</span>
                </div>
            </div>
            <div className="darkMode-btn">
                <button type="button" className="cancel" onClick={init}><a>초기화</a></button>
            </div>
        </div>
    );
    return el && open ? ReactDOM.createPortal(node, el) : null;
}
