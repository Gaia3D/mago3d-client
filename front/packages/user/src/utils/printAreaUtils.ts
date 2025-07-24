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

export const buildWfsUrl = (
  layerName: string,
  searchKey?: string,
  searchValue?: string
): string => {
  const baseUrl = import.meta.env.VITE_GEOSERVER_WFS_SERVICE_URL;
  const params = new URLSearchParams({
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typeName: layerName,
    outputFormat: "application/json",
  });

  if (searchKey && searchValue) {
    params.append("CQL_FILTER", `${searchKey} LIKE '%${searchValue}%'`);
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