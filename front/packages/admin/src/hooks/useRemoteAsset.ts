import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { RemoteDocument, RemoteQueryVariables } from "@mnd/shared/src/types/layerset/gql/graphql";
import { useSetRecoilState } from "recoil";
import { remoteAssetDataState } from "@src/recoils/LayerStyle";

export const extractPath = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
};

export const buildRemoteHref = (originalHref: string): string => {
  if (import.meta.env.MODE !== "production") return originalHref;
  const path = extractPath(originalHref);
  const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : "";
  return `${protocol}//${hostname}${portPart}${path}`;
};

export const useRemoteAsset = (originalHref: string) => {
  const setRemoteAsset = useSetRecoilState(remoteAssetDataState);
  const href = buildRemoteHref(originalHref);
  const variables: RemoteQueryVariables = { href };

  const { data } = useQuery(RemoteDocument, { variables });

  useEffect(() => {
    if (data?.remote) {
      setRemoteAsset(data.remote);
    }
  }, [data, setRemoteAsset]);
};
