import { useEffect, useState } from "react";

export const useLoadWaterGeojson = () => {
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection>();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("./geojson/water.geojson");
        if (!res.ok) throw new Error("Failed to fetch geojson");
        setGeojson(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return geojson;
};
