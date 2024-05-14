import { getCenter, getThumbnailFullPath } from "@/api/Mapnote";
import { bbsGraphqlFetcher } from "@/api/queryClient";
import { cartographicToWkt } from "@/api/util";
import { UPDATE_MAP_NOTE } from "@/graphql/bbs/Mutation";
import { DrawEndFuncProps, DrawType, useAnalGeometryDraw } from "@/hooks/useAnalGeometryDraw";
import { MapNote, UpdateMapNoteInput } from "@mnd/shared/src/types/bbs-gen-type";
import { useMutation } from "@tanstack/react-query";
import { Geometry, feature, featureCollection } from "@turf/turf";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { parseFromWK, convertGeometryToWK } from "wkt-parser-helper";
import StyledDropzone, { UploadedFile } from "./Dropzone";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CurrentSymbolId, CurrentSymbolThumbnailState, IsSymbolDefineState } from "@/recoils/Mapnote";
import { useRefetchMapNote } from "@/hooks/useMapNote";
import { popupState } from "../MapPopup";
import * as Cesium from "cesium";
import { v4 as uuidv4 } from 'uuid'

interface MapNoteUpdateViewProps {
	mapnote: MapNote;
	//onClose: (mapnote: MapNote) => void;
}
export const MapNoteUpdateView = (props:MapNoteUpdateViewProps) => {
    const {mapnote,} = props;
    const refetch = useRefetchMapNote();
    const setPopup = useSetRecoilState(popupState);
    const {title, content, drawGeometry, files, id, symbols} = mapnote;
    const [inputWkt, setInputWkt] = useState<string | undefined>(undefined);
    const [isSymbolDefine, setIsSymbolDefine] = useRecoilState(IsSymbolDefineState);
    const [currentSymbolId, setCurrentSymbolId] = useRecoilState<number>(CurrentSymbolId);
    const [currentSymbolThumbnail, setCurrentSymbolThumbnail] = useRecoilState<string>(CurrentSymbolThumbnailState);
    const uploadedFilesState = useState<UploadedFile[]>([]);
    const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
    const resetUploadFileState = useState<boolean>(false);
    const {mutateAsync: updateMapNote} = useMutation({
        mutationFn: (input: UpdateMapNoteInput) => {
            return bbsGraphqlFetcher(UPDATE_MAP_NOTE, {id, input});
        }
    });

    useEffect(() => {
        return () => {
            const {mapnoteDataSource} = globeController;
            const entity = mapnoteDataSource.entities.getById(id);

            if (!entity) return;
            entity.show = true;
        }
    }, []);

    useEffect(() => {
        setValue('title', title);
        setValue('content', content);

        if (symbols) {
            const symbol = symbols[0];
            const symbolFileId = symbol?.files[0]?.id;
            const symbolId = symbol?.id;
            setCurrentSymbolId(Number(symbolId) ?? 0);
            setCurrentSymbolThumbnail(getThumbnailFullPath(symbolFileId ?? 0));
        }
        
        if (files) {
            const uploadFiles:UploadedFile[] = files.map((file) => {
                return {
                    assetId: id,
                    dbId: file.id,
                    clientId: uuidv4(),
                    filename: file.filename,
                    uploded: true
                }
            });
            setUploadedFiles(uploadFiles);
        }

        const wkt = convertGeometryToWK(JSON.parse(drawGeometry)).replace('GEOMETRYCOLLECTION (','').replace('))',')');
        setInputWkt(wkt);
    }, [mapnote]);

    const { register, handleSubmit, setValue} = useForm<UpdateMapNoteInput>();

    useEffect(() => {
		const {analysisDataSource} = globeController;
		const id = resultEntityIds[0];
		if (!id) return;

		const entity = analysisDataSource.entities.getById(id);
		if( entity && entity.billboard ) entity.billboard.image = new Cesium.ConstantProperty(currentSymbolThumbnail) ;
	}, [currentSymbolThumbnail]);
	
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
    const {clearCropShape, globeController, drawType, toggleDrawType, resultEntityIds} = useAnalGeometryDraw({ drawEnd:drawEnd, restrictArea: false});
	const toggleDrawTypeAndEntity = (type:DrawType) => {
        toggleDrawType(type);
        const {mapnoteDataSource} = globeController;
        
        const entity = mapnoteDataSource.entities.getById(id);

        if (!entity) return;
        entity.show = type === drawType;
    }

    const onSubmit: SubmitHandler<UpdateMapNoteInput> = (data) => {
        if (!confirm('수정하시겠습니까?')) return;
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
        data.uploadId = uploadedFiles
          .filter((file) => !file.uploded)
          .map((file) => file.dbId);
        data.drawGeometry = featureCollection([feature(parseFromWK(inputWkt) as Geometry)]);
        data.cameraPosition = featureCollection([feature(parseFromWK(cartographicToWkt(positionCartographic)) as Geometry)]);
        data.orientation = {
            //merge: {
                heading, pitch, roll
            //}
        }
    
        updateMapNote(data)
        .then((result) => {
                refetch();

                const {mapnoteDataSource} = globeController;
                mapnoteDataSource.entities.removeById(id);
                alert('수정되었습니다.');
                setPopup(null)
        }).catch((error) => {
          alert('수정에 실패했습니다.');
        });
    }
    
	return (
    <div className="dialog-registerPoint darkMode">
        <div className="dialog-title">
            <h3>지점수정</h3>
            <button className="close floatRight" onClick={() => setPopup(null)}></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="dialog-content">
                <ul className="pointer">
                    <li className={`dot ${drawType === DrawType.Point && 'on'}`} onClick={() => toggleDrawTypeAndEntity(DrawType.Point)}><a href="#">점</a></li>
                    <li className={`line ${drawType === DrawType.Line && 'on'}`} onClick={() => toggleDrawTypeAndEntity(DrawType.Line)}><a href="#">선</a></li>
                    <li className={`polygon ${drawType === DrawType.Box && 'on'}`} onClick={() => toggleDrawTypeAndEntity(DrawType.Box)}><a href="#">면</a></li>
                </ul>
                <input type="text" className="width-100 marginTop-20" placeholder="지점명"
                       {...register("title", {
                           required: '지점명을 입력해주세요.'
                       })}
                />
                <input type="text" className="width-100" readOnly defaultValue={inputWkt} placeholder="POINT(127.917155 36.726391)"/>
                <label className="symbol-image">
                    {
                      currentSymbolThumbnail && <img alt="" src={currentSymbolThumbnail}/>
                    }
                    <button type="button" className="btn-small" onClick={() => setIsSymbolDefine(!isSymbolDefine)}>심볼변경</button>
                </label>
                <textarea placeholder="설명"{...register("content")}></textarea>
                <StyledDropzone uploadedFilesState={uploadedFilesState} update={true} reset={resetUploadFileState} acceptFile={{"image/*": [".png", ".jpg", ".jpeg", ".bmp"]}}/>
            </div>
            <div className="darkMode-btn">
                <button type="submit" className="register"><a>수정</a></button>
                <button type="button" className="cancel" onClick={() => setPopup(null)}><a>취소</a></button>
            </div>
        </form>
    </div>
	)
}