import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { remoteAssetDataState } from '../recoils/layerStyle';
import { buildRemoteHref } from '../utils/url';
import { ApiProvider } from '../api/ApiProvider';

export const useRemoteAsset = (originalHref: string) => {
  const setRemoteAsset = useSetRecoilState(remoteAssetDataState);
  const href = buildRemoteHref(originalHref);

  useEffect(() => {
    ApiProvider.asset.getAsset(href).then(setRemoteAsset);
  }, [href, setRemoteAsset]);
};
