import { useEffect, useState } from 'react';
import { ApiProvider } from '@src/layer-style/api/ApiProvider';
import { PreviewColumn } from '@mnd/shared/src/types/layerset/gql/graphql';

export const useAttributes = (assetId?: string) => {
  const [attributes, setAttributes] = useState<PreviewColumn[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!assetId) return;

    ApiProvider.layer.getAttribute(assetId)
      .then(setAttributes)
      .catch(setError);
  }, [assetId]);

  return { attributes, error };
};
