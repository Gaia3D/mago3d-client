import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { useAnalPointEntity } from "@/hooks/useAnalPointEntity";
import { useAnalResult } from "@/hooks/useAnalResult";
import { ResultLayerDataType, ResultLayerStepType } from "@/recoils/Analysis";
import { Geometry, Position } from "@turf/turf";
import * as Cesium from "cesium";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { parseFromWK } from "wkt-parser-helper";
import AnalHelp from "../AnalInfo";

type RangeDomePayload = {
  observerPoint: string;
  radius: number;
}
const RangeDome = () => {
  const analKorName = '화망분석'
  const {initialized, globeController} = useGlobeController();
  //const [resultEntityIds, setResultEntityIds] = useState<string[]>([]);
  const {setloading, getOrCreateDataSource, setResultLayers} = useAnalResult();
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const { register, handleSubmit, formState: { errors}, setValue, getValues, trigger} = useForm<RangeDomePayload>({
    defaultValues: {
      radius: 1000,
    }
  });
  const [observerPoint, setObserverPoint] = useState<string | null>(null);
  const [observerEntityId, setObserverEntityId] = useState<string | null>(null);
  const {radius} = getValues();

  useEffect(() => {
    return () => {
      const {analysisDataSource} = globeController;
      analysisDataSource.entities.removeAll();
    }
  }, []);

  useAnalPointEntity({
    dependency: isDrawing,
    guideText: '관측자 지점을 선택하세요.',
    
    callback(cartesian3:Cesium.Cartesian3) {
      const {analysisDataSource} = globeController;
      analysisDataSource.entities.removeAll();
      const observerEntity = analysisDataSource.entities.add({
        position: cartesian3,
        label: {
          text: '관측자 지점',
          showBackground: true,
          font: '16px sans-serif',
          backgroundColor: Cesium.Color.fromCssColorString('#000000').withAlpha(0.7),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
      });
      const carto = Cesium.Cartographic.fromCartesian(cartesian3);
      setObserverPoint(`POINT(${Cesium.Math.toDegrees(carto.longitude)} ${Cesium.Math.toDegrees(carto.latitude)})`);
      setObserverEntityId(observerEntity.id);
      setIsDrawing(false);
    },
  });
  
  const clearPoint = () => {
    setObserverPoint(null);
    const {analysisDataSource} = globeController
    if (observerEntityId) analysisDataSource.entities.removeById(observerEntityId);
    setObserverEntityId(null);
  }
  
  const toggleIsDrawing = () => {
    setIsDrawing(!isDrawing);
  }
  const onSubmit: SubmitHandler<RangeDomePayload> = (data) => {
    if (observerPoint === null) {
      alert('관측자 지점을 선택해주세요.');
      return;
    }
    const {analysisDataSource, viewer} = globeController;

    if (!viewer) return;

    setResultLayers(produce((draft) => {
      draft[analKorName] = {
        layerName: analKorName,
        changable: false,
        step: ResultLayerStepType.SIMPLIFY,
        type: ResultLayerDataType.Entity,
        isCustom: true,
      };
    }));

    const point = parseFromWK(observerPoint) as Geometry;
    const {coordinates} = point;
    const clicked = Cesium.Cartesian3.fromDegrees((coordinates as Position)[0], (coordinates as Position)[1]);
    
    const dataSource = getOrCreateDataSource(analKorName);
    dataSource.entities.removeAll();

    const ellipsoid = viewer.scene.globe.ellipsoid;
		const pos = ellipsoid.cartesianToCartographic(clicked);

    const {radius} = data;
    dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees((coordinates as Position)[0], (coordinates as Position)[1], pos.height),
      ellipsoid : {
        radii : new Cesium.Cartesian3(radius, radius, radius),
        material : Cesium.Color.RED.withAlpha(0.5),
        outline : true,
        outlineColor : Cesium.Color.BLACK,
      }
    })

  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="analysisContent width-88">
        <label htmlFor="radius">반경(m) 
          <span className="bullet-essential">*</span>
          <AnalHelp analName="RangeDome" propName="radius"/>
        </label>
        <input type="number" id="radius"
          {...register("radius", {required: '반경을 입력해주세요.'})}
          value={radius}
          onChange={(e) => {
            console.info('e.target.value', e.target.value);
            setValue('radius', Number(e.target.value));
            trigger('radius');
          }}
        />
        <label>관측지점 <AnalHelp analName="RangeDome" propName="observerPoint"/></label>
        <div className="btn-div">
          <button className={`drawBtn ${isDrawing ? 'isDrawing':''}`} type="button" onClick={toggleIsDrawing}>위치선택</button>
        </div>
        {
          observerPoint ? (
            <>
            <label>관측자 좌표</label>
              <div className="btn-div">
                <div className="coordinate-txt">{observerPoint}</div>
                <button className="btn-coordinate-delete" type="button" onClick={clearPoint}>X</button>
              </div>
            </>
          ) : null
        }
        <div className="btn clearBoth">
        <button type="submit" className="btn-apply">분석</button>
        </div>
      </div>
    </form>
  )
}   

export default RangeDome;