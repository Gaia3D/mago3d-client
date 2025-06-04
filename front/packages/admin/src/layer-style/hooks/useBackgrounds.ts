import {useEffect, useState} from "react";
import {ApiProvider} from "@src/layer-style/api/ApiProvider";
import {LayerBackground} from "@mnd/shared/src/types/layerset/gql/graphql";

export const useBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useState<LayerBackground[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ApiProvider.layer.getBackgrounds()
      .then(setBackgrounds)
      .catch(setError);
  }, []);

  return { backgrounds, error }
}