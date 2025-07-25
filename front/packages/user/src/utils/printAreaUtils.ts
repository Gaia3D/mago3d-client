import { AssetFilterInput } from "@mnd/shared/src/types/layerset/gql/graphql.ts";

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

interface BuildWfsOptions {
  layerName: string;
  page?: number;
  size?: number;
  searchKey?: string;
  searchValue?: string | number;
  criteria?: "eq" | "contains";
  hitsOnly?: boolean;
}

export const buildWfsUrl = ({
  layerName,
  page = 0,
  size = 10,
  searchKey,
  searchValue,
  criteria = "eq",
  hitsOnly = false,
}: BuildWfsOptions): string => {
  const baseUrl = import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL;

  const params = new URLSearchParams({
    service: "WFS",
    version: hitsOnly ? "1.1.0" : "2.0.0",
    request: "GetFeature",
    typeName: layerName,
    outputFormat: "application/json",
  });

  if (hitsOnly) {
    params.append("resultType", "hits");
  } else {
    params.append("startIndex", `${page * size}`);
    params.append("count", `${size}`);
  }

  if (searchKey && searchValue !== undefined && searchValue !== "") {
    const safeValue = String(searchValue).replace(/'/g, "''"); // 작은 따옴표 이스케이프
    const cql =
      criteria === "eq"
        ? `${searchKey} = '${safeValue}'`
        : `${searchKey} LIKE '%${safeValue}%'`;

    params.append("CQL_FILTER", cql);
  }

  return `${baseUrl}?${params.toString()}`;
};

const captureScreen = () => {
  // // viewer create 시점에 다음 옵션을 넣으면 사용가능
  // contextOptions: {
  //   webgl: {
  //     preserveDrawingBuffer: true
  //   }
  // },
  // const target = document.body;
  //
  // html2canvas(target, {
  //   allowTaint: false,
  //   useCORS: true,
  //   backgroundColor: null, // 투명 배경 (필요시 제거)
  //   scale: 2, // 고해상도 캡처
  // }).then((canvas) => {
  //   canvas.toBlob((blob) => {
  //     if (!blob) return;
  //
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `screenshot-${Date.now()}.png`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   });
  // });
};