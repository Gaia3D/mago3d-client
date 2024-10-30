import * as Cesium from 'cesium';

export const viewRectangleToLonLatRange = (viewRectangle) => {
    const range = {};
    const postiveWest = Cesium.Math.mod(viewRectangle.west, Cesium.Math.TWO_PI);
    const postiveEast = Cesium.Math.mod(viewRectangle.east, Cesium.Math.TWO_PI);
    const width = viewRectangle.width;

    let longitudeMin, longitudeMax;
    if (width > Cesium.Math.THREE_PI_OVER_TWO) {
        longitudeMin = 0.0;
        longitudeMax = Cesium.Math.TWO_PI;
    } else {
        if (postiveEast - postiveWest < width) {
            longitudeMin = postiveWest;
            longitudeMax = postiveWest + width;
        } else {
            longitudeMin = postiveWest;
            longitudeMax = postiveEast;
        }
    }

    range.lon = {
        min: Cesium.Math.toDegrees(longitudeMin),
        max: Cesium.Math.toDegrees(longitudeMax)
    }

    const south = viewRectangle.south;
    const north = viewRectangle.north;
    const height = viewRectangle.height;

    const extendHeight = height > Cesium.Math.PI / 12 ? height / 2 : height / 2;
    let extendedSouth = Cesium.Math.clampToLatitudeRange(south - extendHeight);
    let extendedNorth = Cesium.Math.clampToLatitudeRange(north + extendHeight);
    // extend the bound in high latitude area to make sure it can cover all the visible area
    if (extendedSouth < -Cesium.Math.PI_OVER_THREE) {
        extendedSouth = -Cesium.Math.PI_OVER_TWO;
    }
    if (extendedNorth > Cesium.Math.PI_OVER_THREE) {
        extendedNorth = Cesium.Math.PI_OVER_TWO;
    }

    range.lat = {
        min: Cesium.Math.toDegrees(extendedSouth),
        max: Cesium.Math.toDegrees(extendedNorth)
    }

    return range;
};