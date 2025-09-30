import { useEffect, useState } from "react";
import { Feature } from "geojson";

export const useGeoJsonLoader = (layerUrl: string) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!layerUrl) return;

    const controller = new AbortController();

    const fetchGeoJson = async () => {
      try {
        setLoading(true);
        const res = await fetch(layerUrl, { signal: controller.signal });
        if (!res.ok) throw new Error("bad response");
        const json = await res.json();
        setFeatures(json.features ?? []);
      } catch (err) {
        if (!controller.signal.aborted) console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoJson();
    return () => controller.abort();
  }, [layerUrl]);

  return { features, loading };
};
