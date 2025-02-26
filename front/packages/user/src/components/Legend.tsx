const Legend = () => {
	return (
		<div className="pop-layer-legend">
			<div className="pop-layer-legend-content">
				<p>산사태위험지도</p>
				<div className="pop-layer-legend-wrap">
					{/*<img
						src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:산사태위험도`}
						alt="산사태위험지도"/>*/}
					<div className="legend-item">
						<div className="color-box red"></div>
						<span>1등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box yellow"></div>
						<span>2등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box light-green"></div>
						<span>3등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box sky-blue"></div>
						<span>4등급</span>
					</div>
					<div className="legend-item">
						<div className="color-box blue"></div>
						<span>5등급</span>
					</div>
				</div>
			</div>
			<div className="pop-layer-legend-content">
				<p>토석류피해예측지도</p>
				<div className="pop-layer-legend-wrap">
					{/*<img
						src={`${import.meta.env.VITE_GEOSERVER_WMS_SERVICE_URL}REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=mago3d:debris_flow`}
						alt="토석류피해예측지도"/>*/}
					<div className="legend-item">
						<div className="color-box brown"></div>
						<span>위험지역</span>
					</div>
					<div className="legend-item">
						<div className="color-box bright-yellow"></div>
						<span>예측 지역</span>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Legend;