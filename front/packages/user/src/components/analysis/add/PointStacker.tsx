import { useAnalSpace } from "@/hooks/useAnalSpace";
import { LIKE_POINT_LAYER_NAMES } from "../AdditionalSpace";
import { SubmitHandler, useForm } from "react-hook-form";
import * as Cesium from "cesium";
import { useEffect } from "react";
import { useAnalResult } from "@/hooks/useAnalResult";
import { ResultLayerDataType } from "@/recoils/Analysis";
import AnalHelp from "../AnalInfo";

type Payload = {
  data: string;
}
const PointStacker = () => {
  const { register, handleSubmit, formState: { errors}} = useForm<Payload>();
  const {getConner, globeController} = useAnalSpace('statistics:FrozenArea');
  const {pointStacker} = useAnalResult();

  useEffect(() => {
    return () => {
      /* const {viewer} = globeController;
  
      if(!viewer || !stackerLayer) return;

      const scene = viewer.scene;
      const imageryLayers = scene.imageryLayers;

      if (stackerLayer) {
        imageryLayers.remove(stackerLayer, true);
        stackerLayer = undefined;
      } */
    }
  }, []);

  const onSubmit: SubmitHandler<Payload> = (data) => {
    const {bboxLowerCorner, bboxUpperCorner} = getConner();
    
    pointStacker(
      data.data, 
      {
        layerName: '포인트 클러스터',
        changable: false,
        type: ResultLayerDataType.Imagery,
        isCustom: false
      },
      bboxLowerCorner, 
      bboxUpperCorner
    );
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="analysisContent width-88">
      <label htmlFor="data">포인트 레이어
         <span className="bullet-essential">*</span>
         <AnalHelp analName="PointStacker" propName="data"/>
      </label>
      <select 
        id="data" 
        {...register("data")} 
      >
        {
          LIKE_POINT_LAYER_NAMES.map((name, idx) => {
            return (
              <option value={name} key={idx}>{name}</option>
            )
          })
        }
      </select>
      <div className="btn marginTop-5">
        <button type="submit" className="btn-apply">분석</button>
      </div>
    </div>
    </form>
  )
}

export default PointStacker;