import {Dispatch, SetStateAction, useEffect, useState} from "react";
import { Feature } from "geojson";
import { Pagination, SearchCondition } from "@/types/PrintArea";
import {fetchFeatures, fetchTotalCount} from "@/utils/printAreaUtils.ts";

export const usePrintAreaEffect = (
  enabled: boolean,
  layerName: string,
  searchCondition: SearchCondition,
  pagination: Pagination,
  setPagination: Dispatch<SetStateAction<Pagination>>
) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !layerName) return;

    const run = async () => {
      setLoading(true);
      try {
        const total = await fetchTotalCount(layerName, searchCondition);
        setPagination((prev) => ({ ...prev, page: 0, totalCount: total }));
        const list = await fetchFeatures(layerName, searchCondition, { ...pagination, page: 0 });
        setFeatures(list);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [enabled, layerName, searchCondition.key, searchCondition.keyword, searchCondition.criteria]);

  useEffect(() => {
    if (!enabled || !layerName) return;

    const run = async () => {
      setLoading(true);
      try {
        const list = await fetchFeatures(layerName, searchCondition, pagination);
        setFeatures(list);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [enabled, layerName, pagination.page, pagination.pageSize]);

  return { features, loading };
};
