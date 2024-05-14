import { Coordinate } from "@/api/Coordinate";
import { useEffect, useState } from "react";
import { useGlobeController } from "./providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { set } from "ol/transform";

const Footer = () => {
  const [height, setHeight] = useState(0);
  const [coordinates, setCoordinates] = useState(new Coordinate(0, 0));
  const [lastLegendUpdate, setLastLegendUpdate] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [distanceLabel, setDistanceLabel] = useState<string | undefined>(undefined);

  const {globeController, initialized} = useGlobeController();

  const distances = [
    1, 2, 3, 5,
    10, 20, 30, 50,
    100, 200, 300, 500,
    1000, 2000, 3000, 5000,
    10000, 20000, 30000, 50000,
    100000, 200000, 300000, 500000,
    1000000, 2000000, 3000000, 5000000,
    10000000, 20000000, 30000000, 50000000];

  const mouseMoveEventHandle = (scene:Cesium.Scene) => {
    const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    handler.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      const cartesian = scene.pickPosition(movement.endPosition);
      if (!cartesian) return;
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      setHeight(height);
      setCoordinates(new Coordinate(longitude, latitude));
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  useEffect(() => {
    if (!initialized) return;
    const { viewer } = globeController;
    const scene = viewer?.scene;
    if (!scene) return;

    mouseMoveEventHandle(scene);

    const geodesic = new Cesium.EllipsoidGeodesic();
    scene.postRender.addEventListener(function () {
      const now = Cesium.getTimestamp();
      if (now < lastLegendUpdate + 250) {
          return;
      }

      setLastLegendUpdate(now);

      // Find the distance between two pixels at the bottom center of the screen.
      const width = scene.canvas.clientWidth;
      const height = scene.canvas.clientHeight;

      const left = scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
      const right = scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));

      const globe = scene.globe;
      if (left === undefined || right === undefined || globe === undefined) return;

      const leftPosition = globe.pick(left, scene);
      const rightPosition = globe.pick(right, scene);

      if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
          setBarWidth(0);
          setDistanceLabel(undefined);
      }
      else
      {
        const leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
        const rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);
  
        geodesic.setEndPoints(leftCartographic, rightCartographic);
        const pixelDistance = geodesic.surfaceDistance;
  
          // Find the first distance that makes the scale bar less than 100 pixels.
          const maxBarWidth = 100;
          let distance;
          for (let i = distances.length - 1; !Cesium.defined(distance) && i >= 0; --i) {
              if (distances[i] / pixelDistance < maxBarWidth) {
                  distance = distances[i];
              }
          }
  
          if (Cesium.defined(distance)) {
              let label;
              if (distance >= 1000) {
                  label = (distance / 1000).toString() + ' km';
              } else {
                  label = distance.toString() + ' m';
              }
              setBarWidth((distance / pixelDistance) | 0);
              setDistanceLabel(label);
          } else {
            setBarWidth(0);
            setDistanceLabel(undefined);
          }
      }
    });
  }, [globeController, initialized]);
  return (
    <div id="footer">
      {
        distanceLabel && barWidth > 0 && (
          <div className="distance-legend">
            <div className="distance-legend-label">{distanceLabel}</div>
            <div className="distance-legend-scale-bar" style={{width: `${barWidth}px`, left: `${5 + (125 - barWidth) / 2}px`}}></div>
          </div>
        )
      }
      <div>
        <span><label>고도</label><span id="positionAlt">{height}m</span></span>
        <span><label>DD</label><span id="positionDD">{coordinates.toString()}</span></span>
        <span><label>DM</label><span id="positionDM">{coordinates.toDMString()}</span></span>
        <span><label>DMS</label><span id="positionDMS">{coordinates.toDMSString()}</span></span>
      </div>
    </div>
  )
}


export default Footer;