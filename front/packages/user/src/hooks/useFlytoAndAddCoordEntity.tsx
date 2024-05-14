import { Coordinate, CoordinateType } from "@/api/Coordinate";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import * as Cesium from "cesium";

export const useFlytoAndAddCoordEntity = (type:CoordinateType) => {
  const {globeController} = useGlobeController();

  const getLabelText = (coordinate: Coordinate, type:CoordinateType) => {
    switch(type){
      case "DD":
        return `${coordinate.toString()}`;
      case "DM":
        return `${coordinate.toDMString()}`;
      case "DMS":
        return `${coordinate.toDMSString()}`;
      case "MGRS":
        return `${coordinate.toMGRS()}`;
      case "GARS":
        return `${coordinate.toGars()}`;
      case "UTM":
        return `${coordinate.toUTMString()}`;
    }
  }

  const clearEntity = () => {
    globeController.toolDataSource.entities.removeAll();
  }

  const flyTo = (coordinate: Coordinate | null) => {
    const {toolDataSource} = globeController;
    if (!coordinate) {
      alert("입력하신 좌표가 올바르지 않습니다.");
      return;
    }
    const cartesian = coordinate.toCartesian3();
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    cartographic.height = 10000;

    
    globeController.flyTo(Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height));
    toolDataSource.entities.removeAll();
    toolDataSource.entities.add({
      position: cartesian,
      point: {
        pixelSize: 20,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: getLabelText(coordinate, type),
        font: "18px sans-serif",
        fillColor: Cesium.Color.WHITE,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        pixelOffset: new Cesium.Cartesian2(0, -25),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
  }
  return {flyTo, clearEntity};
}