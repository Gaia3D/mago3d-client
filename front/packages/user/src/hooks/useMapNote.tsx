import { getCenterFromMapNote, getCoordinatesFromMapNote, getThumbnailFullPath, getThumbnailId } from "@/api/Mapnote";
import { bbsGraphqlFetcher } from "@/api/queryClient";
import { useGlobeController } from "@/components/providers/GlobeControllerProvider";
import { GET_MAPNOTES, GET_MAPNOTES_ALL } from "@/graphql/bbs/Query";
import { MapNote, MapNotePaged, Query } from "@mnd/shared/src/types/bbs-gen-type";
import { DefaultError, useQueryClient, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import  * as Cesium from "cesium";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { MapNoteCurrentPageState } from "@/recoils/Mapnote";
import { LoadingStateType, loadingState } from "@/recoils/Spinner";

export const useMapNote = () => {
  const page = useRecoilValue<number>(MapNoteCurrentPageState);
  const setloading = useSetRecoilState<LoadingStateType>(loadingState);

  const filter = {};
  const pageable = { page, size: 10, sort: [ "CREATED_AT_DESC", "UPDATED_AT_DESC" ] };

  const {data:notePaged, error, isLoading } = useQuery<Query, DefaultError, MapNotePaged>({
    queryKey: ["mapnotes", page],
    queryFn: () => bbsGraphqlFetcher(GET_MAPNOTES, {filter, pageable}),
    select: (data) => data.mapNotes,
  });
  useEffect(() => {
    setloading({loading: isLoading, msg: '지도노트를 불러오는 중입니다.'})
  }, [isLoading]);

  if (!notePaged) return { notePaged: {items: [], pageInfo: {hasNextPage: false, hasPreviousPage: false, size:0, page:0, totalItems:0, totalPages:0}}, error };

  return { notePaged, error };
};

export const useMapNoteEntityDraw = () => {
  const { globeController } = useGlobeController();
  useEffect(() => {
    return () => {
      const { mapnoteDataSource } = globeController;
      mapnoteDataSource.entities.removeAll();
    };
  }, []);
  const { data: notes } = useQuery<Query, DefaultError, MapNote[]>({
    queryKey: ["mapnotesall"],
    queryFn: () => bbsGraphqlFetcher(GET_MAPNOTES_ALL),
    select: (data) => data.mapNotes?.items as MapNote[],
  });

  if (!notes) return;

  const { mapnoteDataSource } = globeController;
  mapnoteDataSource.entities.removeAll();
  notes.forEach((note) => {
    const thumbnailId = getThumbnailId(note);
    const center = getCenterFromMapNote(note);
    const {type, coordinates} = getCoordinatesFromMapNote(note)
    const entityConstructor = getEventEntityContructor(type, coordinates);

    entityConstructor.position = center;
    entityConstructor.billboard = {
      image: getThumbnailFullPath(thumbnailId),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e6, 0.1),
      show: true
    };
    entityConstructor.id = note.id;
    mapnoteDataSource.entities.add(entityConstructor);
  });

  return;
};

export const useRefetchMapNote = () => {
  const queryClient = useQueryClient();
  const page = useRecoilValue<number>(MapNoteCurrentPageState);
  return async () => {
      try {
        await queryClient.refetchQueries({
          queryKey: ["mapnotesall"],
        }).catch(()=> {throw 'RefetchAll Error.'});
        await queryClient.refetchQueries({
          queryKey: ["mapnotes", page],
        }).catch(()=> {throw 'RefetchPaged Error.'});
      } catch (error) {
        alert(error);
      }
  };
}

const getEventEntityContructor = (geometryType:string, coordinates: Cesium.Cartesian3 | Cesium.Cartesian3[]):Cesium.Entity.ConstructorOptions => {
  switch(geometryType) {
    case 'LineString':
      return {
          polyline: {
            positions: coordinates as Cesium.Cartesian3[],
            material: Cesium.Color.CYAN.withAlpha(0.5),
            width: 3,
            clampToGround: true
          }
      }
    case 'Polygon':
      return {
        polygon: {
          hierarchy: coordinates as Cesium.Cartesian3[],
          material: Cesium.Color.CYAN.withAlpha(0.5),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      }
    default:
      return {}
  }
}
