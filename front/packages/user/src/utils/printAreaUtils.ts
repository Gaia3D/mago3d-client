import { AssetFilterInput } from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {Pagination, SearchCondition} from "@/types/PrintArea.ts";
import {Feature} from "geojson";

interface BuildWfsOptions {
  layerName: string;
  searchCondition: SearchCondition;
  pagination?: Pagination;
  hitsOnly?: boolean;
}

export const buildWfsUrl = ({
  layerName,
  searchCondition,
  pagination,
  hitsOnly = false,
}: BuildWfsOptions): string | null => {
  if (!layerName) return null;

  const baseUrl = import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL;
  const params = new URLSearchParams({
    service: "WFS",
    request: "GetFeature",
    typeName: layerName,
    outputFormat: "application/json",
    version: hitsOnly ? "1.1.0" : "2.0.0",
  });

  if (hitsOnly) {
    params.append("resultType", "hits");
  } else {
    if (!pagination) return null;

    const { page, pageSize } = pagination;
    params.append("startIndex", String(page * pageSize));
    params.append("count", String(pageSize));
  }

  const cql = createCqlFilter(searchCondition);
  if (cql) {
    params.append("CQL_FILTER", cql);
  }

  return `${baseUrl}?${params.toString()}`;
};

export const fetchTotalCount = async (
  layerName: string,
  searchCondition: SearchCondition
): Promise<number> => {
  const url = buildWfsUrl({
    layerName,
    searchCondition,
    hitsOnly: true
  });
  if (!url) return 0;

  const res = await fetch(url);
  const text = await res.text();
  const matched = text.match(/numberOfFeatures="(\d+)"/);
  return matched ? Number(matched[1]) : 0;
};

export const fetchFeatures = async (
  layerName: string,
  searchCondition: SearchCondition,
  pagination: Pagination
): Promise<Feature[]> => {
  const url = buildWfsUrl({
    layerName,
    searchCondition,
    pagination,
  });
  if (!url) return [];
  const res = await fetch(url);
  const json = await res.json();
  return json.features ?? [];
};

export const buildFilter = (userId: string): AssetFilterInput => ({
  and: [
    { printable: { eq: true } },
    {
      or: [
        { access: { eq: "Public" } },
        {
          and: [
            { access: { eq: "Private" } },
            { createdBy: { eq: userId } },
          ],
        },
      ],
    },
  ],
});

const escapeSingleQuotes = (value: string): string =>
  value.replace(/'/g, "''");

const createCqlFilter = (condition: SearchCondition): string | null => {
  const { key, keyword, criteria } = condition;
  if (!key || !keyword?.trim()) return null;

  const escaped = escapeSingleQuotes(String(keyword));

  return criteria === "eq"
    ? `${key} = '${escaped}'`
    : `${key} LIKE '%${escaped}%'`;
};