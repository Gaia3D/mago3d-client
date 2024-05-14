import { getCenter, getThumbnailFullPath } from "@/api/Mapnote";
import { bbsGraphqlFetcher } from "@/api/queryClient";
import { cartographicToWkt, isFalsy } from "@/api/util";
import { CREATE_MAP_NOTE } from "@/graphql/bbs/Mutation";
import { GET_FIRSTSYMBOL, GET_SYMBOLGROUPS } from "@/graphql/bbs/Query";
import { DrawEndFuncProps, DrawType, useAnalGeometryDraw } from "@/hooks/useAnalGeometryDraw";
import { CreateMapNoteInput, Query, Symbol as SymbolType } from "@mnd/shared/src/types/bbs-gen-type";
import { DefaultError, useMutation, useQuery } from "@tanstack/react-query";
import { Geometry, feature, featureCollection } from "@turf/turf";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { parseFromWK } from "wkt-parser-helper";
import StyledDropzone, { UploadedFile } from "./Dropzone";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CoordinateFromReadCoordinateState, CurrentSymbolId, CurrentSymbolThumbnailState, IsSymbolDefineState } from "@/recoils/Mapnote";
import { useRefetchMapNote } from "@/hooks/useMapNote";
import { popupState } from "../MapPopup";
import * as Cesium from "cesium";

export const MapNoteCreateView = () => {
  const refetch = useRefetchMapNote();
  const setPopup = useSetRecoilState(popupState);
  const [coordinateFromReadCoordinate, setCoordinateFromReadCoordinate] = useRecoilState(CoordinateFromReadCoordinateState);
  const { register, handleSubmit, formState: { errors }, resetField} = useForm<CreateMapNoteInput>();
	const [isSymbolDefine, setIsSymbolDefine] = useRecoilState(IsSymbolDefineState);
  const [currentSymbolId, setCurrentSymbolId] = useRecoilState<number>(CurrentSymbolId);
	const [currentSymbolThumbnail, setCurrentSymbolThumbnail] = useRecoilState<string>(CurrentSymbolThumbnailState);
	const [inputWkt, setInputWkt] = useState<string | undefined>(undefined);
	const uploadedFilesState = useState<UploadedFile[]>([]);
	const [uploadedFiles] = uploadedFilesState;
	const resetUploadFileState = useState<boolean>(false);
	const [,setResetUploadFileState] = resetUploadFileState;
	const {mutateAsync:createMapNote} = useMutation({
    mutationFn: (input:CreateMapNoteInput)=> {
        return bbsGraphqlFetcher(CREATE_MAP_NOTE, {input});
    }
	});
  
  useEffect(() => {
		const {analysisDataSource} = globeController;
		const id = resultEntityIds[0];
		if (!id) return;

		const entity = analysisDataSource.entities.getById(id);
		if( entity && entity.billboard ) entity.billboard.image = new Cesium.ConstantProperty(currentSymbolThumbnail) ;
	}, [currentSymbolThumbnail]);
	
  useEffect(() => {
    if (!coordinateFromReadCoordinate) return;
    const {analysisDataSource} = globeController;
    const {x, y} = coordinateFromReadCoordinate;
    const cartesian = Cesium.Cartesian3.fromDegrees(x, y);
    const wkt = cartographicToWkt(Cesium.Cartographic.fromCartesian(cartesian));
    const drawType = DrawType.Point;
    const resultEntity = analysisDataSource.entities.add({
      position: cartesian
    });
    
    drawEnd({cartesians: cartesian, resultEntity, wkt, drawType});
    setCoordinateFromReadCoordinate(null);
  }, [coordinateFromReadCoordinate]);

	const drawEnd = useCallback((props:DrawEndFuncProps) => {
    const {cartesians, resultEntity, wkt, drawType} = props;
    if (!cartesians) return;

    if (Array.isArray(cartesians)) {
        const center = getCenter(cartesians, drawType);
        resultEntity.position = new Cesium.ConstantPositionProperty(center);
    } 
    if (resultEntity.point) resultEntity.point.show = new Cesium.ConstantProperty(false);
    resultEntity.billboard = new Cesium.BillboardGraphics({
        image: currentSymbolThumbnail,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e6, 0.1),
        show: true,
    });
        
    setInputWkt(wkt ?? undefined);
  }, [currentSymbolThumbnail]);
    
  const {clearCropShape, globeController, drawType, toggleDrawType, resultEntityIds} = useAnalGeometryDraw({drawEnd, restrictArea: false});
  const { data: firstSymbolGroupId } = useQuery<Query, DefaultError, string>({
      queryKey: ['symbolGroups'],
      queryFn: () => bbsGraphqlFetcher(GET_SYMBOLGROUPS),
      select: (data) => data.symbolGroups?.[0].id as string,
  });

  const { data: symbol } = useQuery<Query, DefaultError, SymbolType>({
    queryKey: ['symbol', firstSymbolGroupId],
    queryFn: () => bbsGraphqlFetcher(GET_FIRSTSYMBOL, {id: firstSymbolGroupId}),
    select: (data) => data?.symbols?.items[0],
    enabled: !isFalsy(firstSymbolGroupId) ,
  });
  
  useEffect(() => {
    if (!symbol) return;
    const symbolFileId = symbol?.files[0]?.id;
    const symbolId = symbol?.id;
    if (currentSymbolId === 0) setCurrentSymbolId(Number(symbolId) ?? 0);
    setCurrentSymbolThumbnail(getThumbnailFullPath(symbolFileId ?? 0));
  }, [symbol]);
  
  const onSubmit: SubmitHandler<CreateMapNoteInput> = (data) => {
    if (!confirm('등록하시겠습니까?')) return;
    if (!inputWkt) {
        alert('지점을 지도상에 그려주세요.');
        return;
    }
    const camera = globeController?.viewer?.camera;

    if (!camera) {
        alert('카메라 정보를 가져올 수 없습니다.');
        return;
    }
    const {heading, pitch, roll, positionCartographic} = camera;
    data.symbolId = [currentSymbolId.toString()];
    data.uploadId = uploadedFiles.map((file) => file.dbId);
    data.drawGeometry = featureCollection([feature(parseFromWK(inputWkt) as Geometry)]);
    data.cameraPosition = featureCollection([feature(parseFromWK(cartographicToWkt(positionCartographic)) as Geometry)]);
    data.orientation = {heading, pitch, roll}

    createMapNote(data)
        .then((result) => {
            refetch();
            reset();
            alert('등록되었습니다.');
    })
        .catch((error) => {
      alert('등록에 실패했습니다.');
    });
  }
  
  const reset = () => {
      clearCropShape();
      resetField('title');
      setInputWkt(undefined);
      setResetUploadFileState(true);
  }
  
  return (
    <div className="dialog-registerPoint darkMode">
      <div className="dialog-title">
          <h3>지점등록</h3>
          <button className="close floatRight" onClick={()=>setPopup(null)}></button>						
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="dialog-content">
              <ul className="pointer">
                  <li className={`dot ${drawType === DrawType.Point && 'on'}`} onClick={()=>{toggleDrawType(DrawType.Point)}}><a href="#">점</a></li>
                  <li className={`line ${drawType === DrawType.Line && 'on'}`} onClick={()=>{toggleDrawType(DrawType.Line)}}><a href="#">선</a></li>
                  <li className={`polygon ${drawType === DrawType.Box && 'on'}`} onClick={()=>{toggleDrawType(DrawType.Box)}}><a href="#">면</a></li>
              </ul>	
              <input type="text" className="width-100 marginTop-20" placeholder="지점명"
                  {...register("title", {
                          required: '지점명을 입력해주세요.'
                  })} />
              <input type="text" className="width-100" readOnly defaultValue={inputWkt} placeholder="POINT(127.917155 36.726391)" />
              <label className="symbol-image">
                  {
                          currentSymbolThumbnail && <img src={currentSymbolThumbnail} />
                  }
                  <button type="button" className="btn-small" onClick={()=>setIsSymbolDefine(!isSymbolDefine)}>심볼변경</button>  
              </label>
              <textarea placeholder="설명" {...register("content")} ></textarea>
              <StyledDropzone uploadedFilesState={uploadedFilesState} reset={resetUploadFileState} acceptFile={{"image/*": [".png",".jpg",".jpeg",".bmp"]}}/>
          </div>     					
          <div className="darkMode-btn">
              <button type="submit" className="register"><a>등록</a></button>
              <button type="button" className="cancel" onClick={reset}><a>초기화</a></button>
          </div>
      </form>
    </div>
  )
}