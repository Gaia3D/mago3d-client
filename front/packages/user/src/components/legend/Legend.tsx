import React from "react";
import { useRecoilState } from "recoil";
import {Maybe, UserLayerGroup} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import { UserLayerGroupState } from "@/recoils/Layer.ts";
import AttributeLegend from "@/components/legend/AttributeLegend.tsx";
import RasterLegend from "@/components/legend/RasterLegend.tsx";

const Legend = () => {
	const [userLayerGroups] = useRecoilState<Maybe<UserLayerGroup>[]>(UserLayerGroupState);

	return (
		<div className="pop-layer-legend">
			<div className="legend-container">
				{userLayerGroups.map((group) =>
					group?.assets.map((asset) => {
						if (!asset.visible || !asset.styles) return null;
						const assetName = asset.name ?? "";

						return asset.styles.map((style) => {
							const styleId = style?.id ?? "";
							const context = style?.context;
							if (!context) return null;

							const { attribute, rules, entries, type } = context;

							if (attribute && rules?.length > 0) {
								return AttributeLegend(assetName, attribute, rules, styleId);
							}

							if (entries && entries.length > 0) {
								return RasterLegend(assetName, type, entries, styleId);
							}

							return null;
						});
					})
				)}
			</div>
		</div>
	);
};

export default Legend;
