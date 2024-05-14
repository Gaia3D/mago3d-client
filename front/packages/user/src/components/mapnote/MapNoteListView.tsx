import { useRefetchMapNote } from "@/hooks/useMapNote";
import { popupState } from "../MapPopup";
import { useSetRecoilState } from "recoil";
import { IsSymbolDefineState } from "@/recoils/Mapnote";
import { useMutation } from "@tanstack/react-query";
import { bbsGraphqlFetcher } from "@/api/queryClient";
import { DELETE_MAP_NOTE } from "@/graphql/bbs/Mutation";
import MapNoteDetailView from "./MapNoteDetailView";
import { getCenterFromMapNote, getThumbnailFullPath, getThumbnailId } from "@/api/Mapnote";
import { cartesianToDegrees } from "@/api/util";
import { MapNote } from "@mnd/shared/src/types/bbs-gen-type";

/**
 * 목록 화면
 * @param props
 * @returns
 */
export const MapNoteListView = (props: { mapnote: MapNote }) => {
	const refetch = useRefetchMapNote();
  const { mapnote } = props;
  const setPopup = useSetRecoilState(popupState);
	const setIsSymbolDefine = useSetRecoilState(IsSymbolDefineState);
	const {mutateAsync:deleteMapNoteAsync} = useMutation({
		mutationFn: (id:string)=> {
				return bbsGraphqlFetcher(DELETE_MAP_NOTE, {id});
		}
	});

	const OpenDetailView = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();

		setPopup((prev) => {
			console.log("OpenDetailView", prev);
			const popup = <MapNoteDetailView mapnote={mapnote} onClose={CloseDetailView}/>;

			if (prev == popup) {
				console.log("CloseDetailView", this);
				return null;
			}

			return popup;
		});
		setIsSymbolDefine(false);
	};

	const deleteMapNote = (id:string) => {
		if (!confirm('삭제하시겠습니까?')) return;
		deleteMapNoteAsync(id)
		.then((result) => {
				alert('삭제되었습니다.');
        setPopup(null);
				refetch();
		}).catch((error) => {
				alert('삭제에 실패했습니다.');
		});
	}

  const CloseDetailView = () => {
    console.log("CloseDetailView", this);
    setPopup(null);
  };
	
  const thumbnailId = getThumbnailId(mapnote);

  const center = getCenterFromMapNote(mapnote);
  const {longitude, latitude} = cartesianToDegrees(center);

  return (
    <>
      <div className="mapnoteList">
        <div className="mapnote-symbol">
          <img alt="" src={getThumbnailFullPath(thumbnailId)} />
        </div>
        <div className="mapnote-title">
          <span className="point">{mapnote.title}</span>
          <span className="detailinfo">{`${longitude.toFixed(7)}, ${latitude.toFixed(7)}`}</span>
        </div>
        <div className="btn marginTop-5">
          <button type="button" className="btn-small-icon detailView" onClick={OpenDetailView}></button>
          <button type="button" className="btn-small-icon delete" onClick={()=>{deleteMapNote(mapnote.id)}}></button>
        </div>
      </div>
    </>
  );
};