import * as Cesium from "cesium";

export const getWmsLayer = (layers: string, show = true) => {
	return new Cesium.ImageryLayer(
		getWmsLayerImageProvider(layers),
		{
			show,
		},
	);
};


export const getWmsLayerImageProvider = (layers: string, show = true) => {
	return new Cesium.WebMapServiceImageryProvider({
		url: import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL,
		layers,
		minimumLevel: 0,
		parameters: {
			service: "WMS",
			version: "1.1.1",
			request: "GetMap",
			transparent: "true",
			format: "image/png",
			tiled: true,
		},
	})
};