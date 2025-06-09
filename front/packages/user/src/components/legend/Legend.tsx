import React from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import { Maybe, UserLayerGroup } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {SelectedBackgroundState, UserLayerGroupState} from "@/recoils/Layer.ts";
import AttributeLegend from "@/components/legend/AttributeLegend.tsx";
import RasterLegend from "@/components/legend/RasterLegend.tsx";

const Legend = () => {
	const [userLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);
	const selectedBackground = useRecoilValue(SelectedBackgroundState);

	return (
		<div className="pop-layer-legend">
			<div className="legend-container">
				{userLayerGroups.map((group) =>
					group?.assets.map((asset) => {
						if (!asset.visible || !asset.styles) return null;
						const assetName = asset.name ?? "";
						const styles = asset.styles;

						const defaultStyle = styles.find(style => style?.defaultStatus);
						const isUsableDefault = defaultStyle &&
							(!defaultStyle.backgroundId || defaultStyle.backgroundId === selectedBackground.id);

						let selectedStyle = null;

						if (isUsableDefault) {
							selectedStyle = defaultStyle;
						} else {
							selectedStyle =
								styles.find(style => style?.backgroundId === selectedBackground.id) ??
								styles.find(style => !style?.backgroundId);
						}

						if (!selectedStyle || !selectedStyle.context) return null;

						const { attribute, rules, entries, type } = selectedStyle.context;
						const styleId = selectedStyle.id ?? "";

						if (attribute && rules?.length > 0) {
							return AttributeLegend(assetName, attribute, rules, styleId);
						}

						if (entries && entries.length > 0) {
							return RasterLegend(assetName, type, entries, styleId);
						}

						return null;
					})
				)}
			</div>
		</div>
	);
};

export default Legend;
