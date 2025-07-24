import { useEffect, useState } from "react";
import { Feature } from "geojson";

export const useGeoJsonLoader = (layerUrl: string) => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (!layerUrl) return;

    const controller = new AbortController();

    const fetchGeoJson = async () => {
      try {
        const res = await fetch(layerUrl, { signal: controller.signal });
        if (!res.ok) throw new Error("bad response");
        const json = await res.json();
        setFeatures(json.features ?? []);
      } catch (err) {
        if (!controller.signal.aborted) console.error(err);
      }
    };

    fetchGeoJson();
    return () => controller.abort();
  }, [layerUrl]);

  return features;
};
