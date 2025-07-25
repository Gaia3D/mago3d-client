import React, {useEffect, useRef} from "react";
import {Feature, GeoJsonProperties, Geometry} from "geojson";
import {useGlobeController} from "@/components/providers/GlobeControllerProvider.tsx";
import * as Cesium from "cesium";
import {Rectangle} from "cesium";
import {download} from "@mnd/shared";
import {createEntityFromGeometry} from "@/utils/cesium/createEntityFromGeometry.ts";

interface Props {
  features: Feature<Geometry, GeoJsonProperties>[];
  searchKey?: string;
  refCallback?: (node: HTMLDivElement | null) => void;
}

const FeatureList = ({ features, searchKey, refCallback }: Props) => {
  const { globeController } = useGlobeController();
  const viewer = globeController?.viewer;

  const highlightRef = useRef<Cesium.Entity | null>(null);

  useEffect(() => {
    return () => {
      if (viewer && highlightRef.current) {
        viewer.entities.remove(highlightRef.current);
        highlightRef.current = null;
      }
    };
  }, [viewer]);

  const flyToFeature = (feature: Feature<Geometry, GeoJsonProperties>) => {
    if (!viewer || !feature.bbox) {
      alert("bbox 정보 없음");
      return;
    }

    const [minLon, minLat, maxLon, maxLat] = feature.bbox;
    const padding = 0.2;  // 20% 패딩
    const lonPad = (maxLon - minLon) * padding;
    const latPad = (maxLat - minLat) * padding;

    const padded = Rectangle.fromDegrees(
      minLon - lonPad,
      minLat - latPad,
      maxLon + lonPad,
      maxLat + latPad
    );

    if (highlightRef.current) {
      viewer.entities.remove(highlightRef.current);
    }

    viewer.camera.flyTo({
      destination: padded,
      duration: 0,
      complete: () => {
        const entity = createEntityFromGeometry(feature.geometry);
        if (entity) {
          const added = viewer.entities.add(entity);
          highlightRef.current = added;
        }
      },
    });
  };

  const captureCesium = () => {
    if (!viewer) return;
    const scene = viewer.scene;

    viewer.resolutionScale = 2.0;

    const takeScreenshot = () => {
      scene.postRender.removeEventListener(takeScreenshot);
      scene.requestRender(); // 캡처 전에 명시적 렌더 요청

      scene?.canvas.toBlob((blob) => {
        if (!blob) return;
        download(blob, `snapshot-${Date.now()}.png`);
        viewer.resolutionScale = 1.0;
      });
    };

    scene.postRender.addEventListener(takeScreenshot);
  };

  if (!viewer || features.length === 0) return null;

  return (
    <div className="feature-list">
      {features.map((f, i) => {
        const isLast = features.length - 1 === i;
        return (
          <div
            key={`${f.id}-${i}`}
            className="feature-item"
            ref={isLast ? refCallback : undefined}
          >
            <div className="feature-id ellipsis">
              <span>
                {f.properties?.id ?? f.id}
              </span>
              {searchKey && (
                <span className="feature-key">
                ({f.properties?.[searchKey ?? ""] ?? f.id})
              </span>
              )}
            </div>
            <div className="feature-actions">
              <button className="fly-to" onClick={() => flyToFeature(f)}></button>
              <button onClick={() => captureCesium()}></button>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default FeatureList;
