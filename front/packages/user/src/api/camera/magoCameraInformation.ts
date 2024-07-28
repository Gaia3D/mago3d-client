import * as Cesium from 'cesium';

let compassInformationEvent: Cesium.Event.RemoveCallback | undefined = undefined;
let cameraInformationEvent: Cesium.Event.RemoveCallback | undefined = undefined;

type CompassCallback = (heading: number) => void;
type CameraCallback = (longitude: number, latitude: number, height: number, heading: number) => void;

export const onCompassInformation = (viewer: Cesium.Viewer, callback: CompassCallback) => {
  if (!compassInformationEvent) {
    compassInformationEvent = () => {
      const camera = viewer.camera;
      const heading = Cesium.Math.toDegrees(camera.heading);
      if (callback) {
        callback(heading);
      }
    };
  }
  viewer.clock.onTick.addEventListener(compassInformationEvent);
}

export const onCameraInformation = (viewer: Cesium.Viewer, callback: CameraCallback) => {
  if (!cameraInformationEvent) {
    cameraInformationEvent = () => {
      const camera = viewer.camera;
      const cartographic = Cesium.Cartographic.fromCartesian(camera.positionWC);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      const heading = Cesium.Math.toDegrees(camera.heading);
      if (callback) {
        callback(longitude, latitude, height, heading);
      }
    };
  }
  viewer.clock.onTick.addEventListener(cameraInformationEvent);
}

export const offCompassInformation = (viewer: Cesium.Viewer) => {
  if (compassInformationEvent) {
    viewer.clock.onTick.removeEventListener(compassInformationEvent);
    compassInformationEvent = undefined;
  }
}

export const offCameraInformation = (viewer: Cesium.Viewer) => {
  if (cameraInformationEvent) {
    viewer.clock.onTick.removeEventListener(cameraInformationEvent);
    cameraInformationEvent = undefined;
  }
}
