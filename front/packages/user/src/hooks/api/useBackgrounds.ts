import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { BackgroundsDocument, LayerBackground } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useRecoilState } from "recoil";
import { backgroundsState, CurrentLayerMapState } from "@/recoils/Layer";

export const useBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useRecoilState(backgroundsState);
  const [currentMap, setCurrentMap] = useRecoilState(CurrentLayerMapState);

  const { data } = useQuery<{ backgrounds: LayerBackground[] }>(BackgroundsDocument);

  useEffect(() => {
    if (!Array.isArray(data?.backgrounds)) return;

    setBackgrounds(data.backgrounds);

    const localBackgroundId = localStorage.getItem("BACKGROUND_MAP_ID");
    const initBackground = localBackgroundId
      ? data.backgrounds.find(bg => bg.id === localBackgroundId)
      : data.backgrounds[0];

    if (initBackground) {
      setCurrentMap(initBackground);
    }
  }, [data]);

  return { backgrounds, currentMap };
};
