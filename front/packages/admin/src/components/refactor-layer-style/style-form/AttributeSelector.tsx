import React from 'react';
import {useRecoilValue} from "recoil";
import {remoteAssetDataState} from "@src/recoils/LayerStyle";

const AttributeSelector = () => {
  const remoteAsset = useRecoilValue(remoteAssetDataState);
  const assetName = remoteAsset?.featureType?.nativeName;



  return (
    <div>
      
    </div>
  );
};

export default AttributeSelector;