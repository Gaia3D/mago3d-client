import React from 'react';
import StyleList from "@src/components/layerset/layer/style/StyleList";
import StyleForm from "@src/components/layerset/layer/style/StyleForm";
import {useRecoilValue} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";

const StylePanel = () => {

  const selectedLayerStyle = useRecoilValue(selectedLayerStyleState);

  return (selectedLayerStyle ? <StyleForm/> : <StyleList/>);
};

export default StylePanel;