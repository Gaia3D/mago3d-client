import {useNavigate, useOutletContext} from "react-router-dom";
import {useMutation} from "@apollo/client";
import {SubmitHandler, useForm} from "react-hook-form";
import {AppLoader, OlMapForGetCoordinate} from "@mnd/shared";
import {Suspense, useEffect, useState} from "react";
import {Coordinate} from "ol/coordinate";
import {LoadingStateType, UploadedFile} from "../../../types/Common";
import StyledDropzone from "../../Dropzone";
import {useRecoilValue} from "recoil";
import {loadingState} from "../../../recoils/Spinner";
import {classifyAssetTypeAcceptFile} from "../../../api/Data";
import {asset3dTypeOptions, heightReferenceOptions} from "./constant";
import {v4 as uuidv4} from 'uuid';

import {AssetOutletContext} from "./AssetOutletContext";
import {toast} from "react-toastify";
import {useSuspenseQuery} from "@apollo/client";
import {
  AssetType,
  DatasetGroupListDocument,
  DatasetUpdateAssetDocument,
  UpdateAssetInput
} from "@src/generated/gql/dataset/graphql";

const defaultUpdateAssetInput = {
  enabled: true,
  access: 'Public'
} as UpdateAssetInput;

const Update3d = () => {
  const {id, data: {asset}} = useOutletContext<AssetOutletContext>();
  const {data : {groups}} = useSuspenseQuery(DatasetGroupListDocument);

  const [renderReady, isRenderReady] = useState<boolean>(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.Terrain);
  const navigate = useNavigate();
  const currentLoadingState = useRecoilValue<LoadingStateType>(loadingState);
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
  const [onMap, setOnMap] = useState<boolean>(false);
  const [longitude, setLogitude] = useState<number | null>(0);
  const [latitude, setLatitude] = useState<number | null>(0);
  const [height, setHeight] = useState<number | null>(0);
  const {register, handleSubmit, setValue} = useForm<UpdateAssetInput>();


  useEffect(() => {

    setSelectedAssetType(asset.assetType);
    setValue("name", asset?.name);
    const {files} = asset;
    const uploadedFiles = files?.filter(file => file).map((file) => ({
      assetId: asset.id,
      dbId: file?.id,
      clientId: uuidv4(),
      filename: file?.filename,
      uploded: true
    } as UploadedFile));

    if (!uploadedFiles) return;

    setUploadedFiles(uploadedFiles);
    isRenderReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const changeAssetType = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAssetType(e.target.value as AssetType);
  const clickCallback = (coordinate: Coordinate) => {
    const [lon, lat] = coordinate;
    setLogitude(lon);
    setLatitude(lat);
  }
  const toggleMap = () => {
    setOnMap(!onMap);
  }
  const toBack = () => navigate(`/dataset/asset/`);

  const [updateMutation] = useMutation(DatasetUpdateAssetDocument, {
    update: (cache, {data}) => {
      cache.evict({fieldName: 'assets'});
      cache.evict({fieldName: 'asset'});
    }
  });

  const onSubmit: SubmitHandler<UpdateAssetInput> = (data) => {
    if (currentLoadingState.loading) {
      alert('파일 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (!confirm('수정하시겠습니까?')) return;
    const input = {} as UpdateAssetInput;

    const uploadIds = uploadedFiles.filter(uploadedFile => !uploadedFile.uploded).map((uploadedFile) => uploadedFile.dbId);
    if (uploadIds && uploadIds.length > 0) data.uploadId = uploadIds

    Object.assign(input, defaultUpdateAssetInput, data);

    updateMutation({
      variables: {id, input},
    }).then(() => {
      toast('성공적으로 수정되었습니다.');
      navigate(`/dataset/asset/${id}`)
    });

    // updateMutation({id, input}, {
    //   onSuccess() {
    //     alert('성공적으로 수정되었습니다.');
    //     getQueryClient().invalidateQueries({queryKey: ['assets', searchProps]})
    //     navigate(-1);
    //   },
    //   onError(e) {
    //     console.error(e);
    //     alert('에러가 발생하였습니다. 관리자에게 문의하시기 바랍니다.');
    //   }
    // });
  }
  //temp source
  const acceptFile = classifyAssetTypeAcceptFile(selectedAssetType);
  const firstGroupId = asset?.groups[0]?.id;
  if (!asset) return null;

  console.info(asset?.properties?.heightReference);
  return (
    <Suspense fallback={<AppLoader/>}>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{float: "left"}}>
            <label htmlFor="data-update-3d-groups">데이터 그룹</label>
            {
              asset ? <select
                  id="data-update-3d-groups"
                  {...register("groupId", {
                    required: {
                      value: true,
                      message: '그룹을 선택해주시기 바랍니다.'
                    },
                  })}
                  defaultValue={firstGroupId}
                >
                  {
                    groups.items.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      )
                    })
                  }
                </select>
                : null
            }

            <label htmlFor="data-update-3d-name">데이터명</label>
            <input type="text"
                   id="data-update-3d-name"
                   defaultValue={asset?.name}
                   {...register("name", {
                     required: {
                       value: true,
                       message: '데이터명을 입력해주시기 바랍니다.'
                     },
                   })}
            />
            <label htmlFor="data-update-3d-asset-type">데이터 타입</label>
            {
              asset?.assetType ? <select
                  id="data-update-3d-asset-type"
                  {...register("assetType", {
                    required: {
                      value: true,
                      message: '데이터타입을 선택해주시기 바랍니다.'
                    },
                  })}
                  onChange={changeAssetType}
                  defaultValue={asset?.assetType}
                >
                  {
                    asset3dTypeOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      )
                    })
                  }
                </select>
                : null
            }
            {/*
            <label>높이 설정</label>
            {
              asset ? <select
                  id="data-update-3d-height-reference"
                  {...register("properties.merge.heightReference")}
                  defaultValue={asset?.properties?.heightReference}
                >
                  {
                    heightReferenceOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      )
                    })
                  }
                </select>
                : null
            }

            <label>대표 위치</label>
            <input
              type="text"
              className="short"
              readOnly
              id="data-update-3d-longitude"
              placeholder="경도"
              value={asset?.properties?.longitude ?? longitude}
              {...register("properties.merge.longitude")}
            />
            <input
              type="text"
              className="short"
              readOnly
              id="data-update-3d-latitude"
              placeholder="위도"
              value={asset?.properties?.latitude ?? latitude}
              {...register("properties.merge.latitude")}
            />
            <input
              type="text"
              className="short"
              id="data-update-3d-height"
              placeholder="높이"
              value={asset?.properties?.height ?? height}
              onChange={(e) => setHeight(Number(e.target.value))}
              {...register("properties.merge.height")}
            />
            <button type="button" className="map-check" onClick={toggleMap}>지도</button>
            */}
            <label>설명</label>
            <input type="text"
                   id="data-update-3d-description"
                   defaultValue={asset?.description}
                   {...register("description")}
            />
          </div>
          {/*<OlMapForGetCoordinate className="coordinate-map" on={onMap} callback={clickCallback}/>*/}
          {
            renderReady &&
              <>
                <label>업로드 파일</label>
                <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile} update={true}/>
              </>
          }
        </form>

      </article>
      <div className="cboth alg-right">
        <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>저장</button>
        <button type="button" className="btn-l-cancel" onClick={toBack}>취소</button>
      </div>
    </Suspense>
  )
}

export default Update3d;