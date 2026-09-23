import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { BackgroundsDocument, LayerBackground } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useRecoilState } from "recoil";
import { backgroundsState, SelectedBackgroundState } from "@/recoils/Layer";

// 인증키(?key=)가 필요한 OSM 배경지도 (black / white)
const OSM_KEY_REQUIRED_IMAGES = ["osm_dark", "osm_white"];

const appendOsmKey = (url: string, key: string) => {
  if (!key || /[?&]key=/.test(url)) return url;
  return `${url}${url.includes("?") ? "&" : "?"}key=${encodeURIComponent(key)}`;
};

export const useBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useRecoilState(backgroundsState);
  const [selectedBackground, setSelectedBackground] = useRecoilState(SelectedBackgroundState);

  const { data } = useQuery<{ backgrounds: LayerBackground[] }>(BackgroundsDocument);

  useEffect(() => {
    if (!Array.isArray(data?.backgrounds)) return;

    const vworldToken = import.meta.env.VITE_VWORLD_TOKEN ?? "";
    const osmKey = import.meta.env.VITE_OSM_MAP_KEY ?? "";

    const backgrounds = data.backgrounds.map(bg => ({
      ...bg,
      url: bg.url?.map(u => {
        if (!u) return u;

        const url = u.replace("{VWorldToken}", vworldToken);
        return OSM_KEY_REQUIRED_IMAGES.includes(bg.image) ? appendOsmKey(url, osmKey) : url;
      }),
    }));

    setBackgrounds(backgrounds);

    const localBackgroundId = localStorage.getItem("BACKGROUND_MAP_ID");
    const initBackground = localBackgroundId
      ? backgrounds.find(bg => bg.id === localBackgroundId)
      : backgrounds[0];

    if (initBackground) {
      setSelectedBackground(initBackground);
    }
  }, [data]);

  return { backgrounds, selectedBackground };
};
