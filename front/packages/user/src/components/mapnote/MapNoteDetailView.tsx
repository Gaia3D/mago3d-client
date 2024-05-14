import * as Cesium from "cesium";
import { MapNote } from "@mnd/shared/src/types/bbs-gen-type";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageViewer from 'react-simple-image-viewer';
import { useGlobeController } from "../providers/GlobeControllerProvider";
import { useCallback, useState } from "react";
import {getCameraPositionFromMapNote, getCenterFromMapNote} from "@/api/Mapnote";
import { isFalsy } from "@/api/util";
import { useSetRecoilState } from "recoil";
import { IsSymbolDefineState } from "@/recoils/Mapnote";
import { MapNoteUpdateView } from "./MapNoteUpdateView";
import { popupState } from "../MapPopup";
interface MapNoteDetailViewProps {
	mapnote: MapNote;
	onClose: (mapnote: MapNote) => void;
}
  
type CesiumCameraFlytoOpion =  {
	destination: Cesium.Cartesian3 | Cesium.Rectangle;
	orientation?: any;
	duration?: number;
	complete?: Cesium.Camera.FlightCompleteCallback;
	cancel?: Cesium.Camera.FlightCancelledCallback;
	endTransform?: Cesium.Matrix4;
	maximumHeight?: number;
	pitchAdjustHeight?: number;
	flyOverLongitude?: number;
	flyOverLongitudeWeight?: number;
	convert?: boolean;
	easingFunction?: Cesium.EasingFunction.Callback;
}
  
  /**
   * 상세보기 화면
   * @param props
   * @returns
   */
const MapNoteDetailView = (props:MapNoteDetailViewProps) => {

		const {mapnote, onClose} = props;
		const {globeController} = useGlobeController();
		const [currentImage, setCurrentImage] = useState(0);
		const [isViewerOpen, setIsViewerOpen] = useState(false);
		const setPopup = useSetRecoilState(popupState);
		const setIsSymbolDefine = useSetRecoilState(IsSymbolDefineState);
		const {viewer} = globeController;
		const cameraPosition = getCameraPositionFromMapNote(mapnote);
		const centerPosition = getCenterFromMapNote(mapnote);

		if (viewer && cameraPosition) {
			//const {merge:{heading, pitch, roll}} = mapnote.orientation;
			const {heading, pitch, roll} = mapnote.orientation;

			const flyOption: CesiumCameraFlytoOpion = {
				destination: cameraPosition,
				duration: 0.5
			}

			if (!isFalsy(heading) && !isFalsy(pitch) && !isFalsy(roll)) {
				flyOption.orientation = {
					heading,
					pitch,
					roll
				}
			}

			viewer.camera.flyTo(flyOption);

		} else if (viewer && centerPosition) {

			const flyOption: CesiumCameraFlytoOpion = {
				destination: centerPosition,
				duration: 0.5
			}
			viewer.camera.flyTo(flyOption);
		}
		
	const images = mapnote.files?.filter((file)=>file.download).map((file) => file.download) as string[] | undefined;
	const closeHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		onClose(mapnote);
	};

	const updateHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		onClose(mapnote);
	};

	const openImageViewer = useCallback((index:number) => {
		setCurrentImage(index);
		setIsViewerOpen(true);
	}, []);

	const closeImageViewer = () => {
		setCurrentImage(0);
		setIsViewerOpen(false);
	};

    const OpenUpdateView = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        setPopup((prev) => {
          const popup = <MapNoteUpdateView mapnote={mapnote} />;
            
          if (prev == popup) {
            console.log("CloseDetailView", this);
            return null;
          }
                
          return popup;
        });
        setIsSymbolDefine(false);
    };

	return (
		<div className="dialog-registerPoint darkMode">
			<div className="dialog-title">
				<h3>상세보기</h3>
				<button className="close floatRight" onClick={closeHandler}></button>
			</div>
			<div className="dialog-content">
				<span className="title">{mapnote.title}</span>
				<span className="point">좌표정보</span>
				<textarea placeholder="설명" defaultValue={mapnote.content ?? ''} readOnly></textarea>
			</div>
            {
			images && images.length > 0 && 
                <div className="dialog-content">
                    <ImageList sx={{ width: 280 }} style={{maxHeight:'280px'}} cols={images.length === 1 ? 1 : 2}>
                    {images.map((item, index) => (
                        <ImageListItem key={index}>
                            <img
															  alt=""
                                srcSet={`${item}`}
                                src={`${item}`}
                                loading="lazy"
                                onClick={ () => openImageViewer(index) }
                            />
                        </ImageListItem>
                    ))}
                    </ImageList>
                </div>
						
            }
            {
            isViewerOpen && images && 
            (
                <ImageViewer
                    src={ images }
                    currentIndex={ currentImage }
                    disableScroll={ false }
                    closeOnClickOutside={ true }
                    onClose={ closeImageViewer }
                />
            )
            }
			<div className="darkMode-btn">
				<button type="button" className="register" onClick={OpenUpdateView}>
					<a>수정</a>
				</button>
				<button type="button" className="cancel" onClick={closeHandler}>
					<a>닫기</a>
				</button>
			</div>
		</div>
	);
};
export default MapNoteDetailView;