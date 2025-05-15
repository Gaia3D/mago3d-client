import * as Cesium from "cesium";
import {RuleStyleInput, LayerStyle, StyleType} from "@mnd/shared/src/types/layerset/gql/graphql";
import {PreviewMode} from "@src/types/Layer";
import reactSvg from '../../assets/images/react.svg';

export function applyStyledEntities(
  viewer: Cesium.Viewer,
  entities: Cesium.Entity[],
  styles: LayerStyle[],
  previewMode: PreviewMode
) {
  viewer.entities.removeAll();

  const now = Cesium.JulianDate.now();
  let targets;

  if (previewMode === PreviewMode.Single) {
    targets = [entities[0]];
  } else if (previewMode === PreviewMode.All) {
    targets = entities;
  }

  targets.forEach(entity => {
    ensureEntityPosition(entity);

    for (const style of styles) {
      const { context, type } = style;
      const labelShow = !!context.label;
      const labelKey = context.labelAttribute ?? "";
      const labelText =
        labelKey && entity?.properties?.[labelKey] != null
          ? String(entity.properties[labelKey])
          : "속성 없음";
      const strokeColor = Cesium.Color.fromCssColorString(context.strokeColor || "#000000")
        .withAlpha(context.strokeOpacity ?? 1);
      const strokeWidth = context.strokeWidth ?? 1;

      // labelText 기준 fillColor 동적 결정
      let finalFillColor = context.fillColor ?? "#ffffff";

      // rules가 존재할 경우 조건별로 매핑
      if (Array.isArray(context.rules)) {
        const rules = context.rules as RuleStyleInput[]; // 타입 안정화 위해 명시
        const attributeKey = context.attribute ?? "";
        console.log("attributeKey", attributeKey);
        const attributeText =
          attributeKey && entity?.properties?.[attributeKey] != null
            ? String(entity.properties[attributeKey])
            : "속성 없음";
        if (context.attributeType === "String") {
          const matchedRule = rules.find(r => r.rule.eq === attributeText);
          if (matchedRule?.style?.point?.fillColor) {
            finalFillColor = matchedRule.style.point.fillColor;
          }
        }

        if (context.attributeType === "Number") {
          const numericValue = parseFloat(attributeText);
          const matchedRule = rules.find(r => {
            const ge = parseFloat(r.rule.ge ?? r.rule.gt ?? "-Infinity");
            const lt = parseFloat(r.rule.lt ?? r.rule.le ?? "Infinity");
            return !isNaN(numericValue) && numericValue >= ge && numericValue < lt;
          });
          if (matchedRule?.style?.point?.fillColor) {
            finalFillColor = matchedRule.style.point.fillColor;
          }
        }
      }

      const fillColor = Cesium.Color.fromCssColorString(finalFillColor).withAlpha(context.fillOpacity ?? 1);

      if (type === StyleType.Point && entity.position) {
        const fontSize = context.labelFontSize ?? 8;
        const fontType = context.labelFontType ?? "sans-serif";
        const labelFontColor = Cesium.Color.fromCssColorString(context.labelFontColor || "#000000");
        const labelBorder = context.labelBorder ?? false;
        const labelBorderColor = Cesium.Color.fromCssColorString(context.strokeBorderColor || "#ffffff");

        let labelYOffset = 0;

        if (context.pointType !== "icon") {
          labelYOffset = fontSize + strokeWidth;
        } else {
          const iconSize = 20;
          const scale = context.scale ?? 1;
          labelYOffset = iconSize * scale * 1.5 + fontSize;
        }

        const commonLabel = labelShow ? {
          label: new Cesium.LabelGraphics({
            text: labelText,
            font: `${fontSize}px ${fontType}`,
            fillColor: labelFontColor,
            outlineWidth: labelBorder ? 1.5 : 0,
            outlineColor: labelBorderColor,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -labelYOffset),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          })
        } : {};

        if (context.pointType !== "icon") {
          viewer.entities.add({
            position: entity.position,
            point: new Cesium.PointGraphics({
              pixelSize: context.size,
              color: fillColor,
              outlineColor: strokeColor,
              outlineWidth: strokeWidth,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
            }),
            ...commonLabel
          });
        } else {
          viewer.entities.add({
            position: entity.position,
            billboard: new Cesium.BillboardGraphics({
              image: context.symbol ?? reactSvg,
              scale: context.scale,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            }),
            ...commonLabel
          });
        }
      }
      if ((type === StyleType.Line || type === StyleType.Polygon) && entity.polygon?.hierarchy) {
        const hierarchy = entity.polygon.hierarchy.getValue(now);
        if (!hierarchy?.positions?.length) continue;
        const positions = [...hierarchy.positions];
        if (!Cesium.Cartesian3.equals(positions[0], positions[positions.length - 1])) {
          positions.push(positions[0]);
        }

        const material = context.strokeType === "dash" ?
          new Cesium.PolylineDashMaterialProperty({
            color: strokeColor,
          }) :
          strokeColor

        viewer.entities.add({
          polyline: new Cesium.PolylineGraphics({
            positions,
            width: strokeWidth,
            material,
            clampToGround: true,
          }),
        });
      }

      if (type === StyleType.Polygon && entity.polygon?.hierarchy) {
        const hierarchy = entity.polygon.hierarchy.getValue(now);
        if (!hierarchy?.positions?.length) continue;

        // polygon 본체
        viewer.entities.add({
          polygon: new Cesium.PolygonGraphics({
            hierarchy,
            material: fillColor,
            outline: false,
            height: 0,
          }),
        });
      }
    }
  });
}

function ensureEntityPosition(entity: Cesium.Entity): void {
  if (entity.position) return; // 이미 있으면 패스

  const now = Cesium.JulianDate.now();

  // 폴리곤 중심
  if (entity.polygon?.hierarchy) {
    const hierarchy = entity.polygon.hierarchy.getValue(now);
    if (hierarchy?.positions?.length > 0) {
      const center = Cesium.BoundingSphere.fromPoints(hierarchy.positions).center;
      entity.position = new Cesium.ConstantPositionProperty(center);
    }
  }

  // 폴리라인 시작점
  if (!entity.position && entity.polyline?.positions) {
    const positions = entity.polyline.positions.getValue(now);
    if (positions?.length > 0) {
      entity.position = new Cesium.ConstantPositionProperty(positions[0]);
    }
  }
}