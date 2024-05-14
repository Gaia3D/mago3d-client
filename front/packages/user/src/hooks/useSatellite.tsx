import { useState } from "react";

interface Satellite {
  label: string;
  value: string;
}

export const useSatellite = () => {
  const dummy = [
    { label: "KOMPSAT3", value: "1100000000" },
    { label: "KOMPSAT3A", value: "2600000000" },
    { label: "WorldView-2", value: "2700000000" },
    { label: "WorldView-3", value: "2800000000" },
    { label: "Pleades", value: "2900000000" },
    { label: "국방지도", value: "3000000000" },
    { label: "생산 위성 영상", value: "3100000000" },
  ];

  const [data, setData] = useState<Satellite[]>(dummy);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const doFetch = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/layers");
      const data = (await response.json()) as Satellite[];
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, doFetch };
};
