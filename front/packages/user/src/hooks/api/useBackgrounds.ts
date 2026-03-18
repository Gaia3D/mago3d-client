import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { BackgroundsDocument, LayerBackground } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useRecoilState } from "recoil";
import { backgroundsState, SelectedBackgroundState } from "@/recoils/Layer";

export const useBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useRecoilState(backgroundsState);
  const [selectedBackground, setSelectedBackground] = useRecoilState(SelectedBackgroundState);

  const { data } = useQuery<{ backgrounds: LayerBackground[] }>(BackgroundsDocument);

  useEffect(() => {
    if (!Array.isArray(data?.backgrounds)) return;

    const vworldToken = import.meta.env.VITE_VWORLD_TOKEN ?? "";
    const backgrounds = data.backgrounds.map(bg => ({
      ...bg,
      url: bg.url?.map(u => u?.replace("{VWorldToken}", vworldToken) ?? u),
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
