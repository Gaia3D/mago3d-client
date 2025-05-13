interface Rule {
	rule: {
		gt: string | null;
		ge: string | null;
		lt: string | null;
		le: string | null;
		eq: string | null;
	};
	style: {
		polygon: {
			fillColor: string;
			strokeColor: string;
			strokeWidth: number;
		};
	};
	alias: string;
}

interface AttributeLegendProps {
	name: string;
	unit: string;
	attribute: string;
	rules: Rule[];
}

const LegendContent: React.FC<{ attributeData: AttributeLegendProps }> = ({ attributeData }) => {
	return (
		<div className="pop-layer-legend-content">
			<p>{attributeData.name}
				{attributeData.unit && (
					<span className="legend-unit">({attributeData.unit})</span>
				)}
			</p>
			<div className="pop-layer-legend-wrap">
				{attributeData.rules.map((ruleItem, index) => (
					<div className="legend-item" key={index}>
						<div
							className="color-box"
							style={{
								backgroundColor: ruleItem.style.polygon.fillColor,
								border: `1px solid ${ruleItem.style.polygon.strokeColor}`,
							}}
						/>
						<span>{ruleItem.alias}</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default LegendContent;
