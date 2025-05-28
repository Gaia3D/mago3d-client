import React, { useEffect } from 'react';
import { useRecoilValue } from "recoil";
import { useRemoteAsset } from "../hooks/useRemoteAsset";
import {selectedAssetState} from "@src/layer-style/recoils/layerStyle";

const LayerStyle = () => {
  const asset = useRecoilValue(selectedAssetState);
  const { href } = asset.properties.layer.resource;

  // 원본 Asset 데이터 요청 & remoteAssetDataState 전역 상태에 저장
  useRemoteAsset(href);

  useEffect(() => {
    console.log("selectedAsset", asset);
  }, [asset]);

  return <div> {/* UI */} </div>;
};

export default LayerStyle;
