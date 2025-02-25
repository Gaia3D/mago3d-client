const Legend = () => {
	return (
		<div className="pop-layer-legend">
			<div className="pop-layer-legend-content">
				<p>산사태위험지도</p>
				<div className="pop-layer-legend-img-wrap">
					<img
						src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:산사태위험도`}
						alt="산사태위험지도"/>
				</div>
			</div>
			<div className="pop-layer-legend-content">
				<p>토석류피해예측지도</p>
				<div className="pop-layer-legend-img-wrap">
				<img
					src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:debris_flow`}
					alt="토석류피해예측지도"/>
				</div>
			</div>
		</div>
	);
};
export default Legend;