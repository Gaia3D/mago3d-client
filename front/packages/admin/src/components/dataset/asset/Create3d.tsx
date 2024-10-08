import {useNavigate, useOutletContext} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {OlMapForGetCoordinate} from "@mnd/shared";
import {useState} from "react";
import {Coordinate} from "ol/coordinate";
import {LoadingStateType, UploadedFile} from "@src/types/Common";
import StyledDropzone from "../../Dropzone";
import {useRecoilValue} from "recoil";
import {loadingState} from "@src/recoils/Spinner";
import {classifyAssetTypeAcceptFile} from "@src/api/Data";
import {asset3dTypeOptions, heightReferenceOptions} from "./constant";
import {Access, AssetType, CreateAssetInput, DatasetCreateAssetDocument} from "@src/generated/gql/dataset/graphql";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreateAssetOutletContext} from "./AssetOutletContext";
import {useMutation} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

const FormSchema = () => {
  const { t } = useTranslation();
  return z.object({
    groupId: z.string().nonempty(t("validation.group")),
    name: z.string().trim().nonempty(t("validation.data-name")),
    description: z.string().optional(),
    assetType: z.nativeEnum(AssetType),
    properties: z.object({
      longitude: z.coerce.number().optional(),
      latitude: z.coerce.number().optional(),
      height: z.coerce.number().optional(),
      heightReference: z.string().optional()
    }).optional()
  })
}

type FormSchemaType = ReturnType<typeof FormSchema>;
type FormType = z.infer<FormSchemaType>;

const Create3d = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.Tiles3D);
  const currentLoadingState = useRecoilValue<LoadingStateType>(loadingState);
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [uploadedFiles] = uploadedFilesState;
  const [onMap, setOnMap] = useState<boolean>(false);
  const [height, setHeight] = useState<number | null>(0);
  const {data} = useOutletContext<CreateAssetOutletContext>();

  const {register, handleSubmit, formState: {errors}, setValue} = useForm<FormType>({
    resolver: zodResolver(FormSchema())
  });

  const {groups} = data;

  const [createMutation] = useMutation(DatasetCreateAssetDocument, {
    update: (cache, {data}) => {
      cache.evict({fieldName: 'assets'});
    },
    onCompleted(data) {
      navigate(`/dataset/asset/${data.createAsset.id}`);
    }
  });

  const toList = () => navigate('/dataset/asset');

  const acceptFile = classifyAssetTypeAcceptFile(selectedAssetType);

  const changeAssetType = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAssetType(e.target.value as AssetType);
  const clickCallback = (coordinate: Coordinate) => {
    const [lon, lat] = coordinate;
    setValue('properties.longitude', lon);
    setValue('properties.latitude', lat);
  }
  const toggleMap = () => {
    setOnMap(!onMap);
  }

  const onSubmit: SubmitHandler<FormType> = (data) => {
    if (currentLoadingState.loading) {
      toast(t("uploading-file"));
      return;
    }

    if (uploadedFiles.length === 0) {
      toast(t("validation.file"));
      return;
    }

    if (!confirm(t("question.create"))) return;

    const input: CreateAssetInput = {
      name: data.name,
      groupId: [data.groupId],
      description: data.description,
      properties: data.properties,
      assetType: data.assetType,
      enabled: true,
      access: Access.Public
    };
    input.uploadId = uploadedFiles.map((uploadedFile) => uploadedFile.dbId);
    // Object.assign(input, defaultCreateAssetInput, data);

    createMutation({
      variables: {input}
    }).catch((e) => {
      console.error(e);
      alert(t("error.admin"));
    });
  }

  return (
    <>
      <article>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="data-create-3d-groups">{t("data-group")}</label>
            <select id="data-create-3d-groups" {...register("groupId")}>
              {
                groups.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
              }
            </select>
            <label htmlFor="data-create-3d-name">{t("data-name")}</label>
            <input type="text" id="data-create-3d-name" {...register("name")}/>
            <label htmlFor="data-create-3d-asset-type">{t("data-type")}</label>
            <select id="data-create-3d-asset-type" {...register("assetType")} onChange={changeAssetType}>
              {
                asset3dTypeOptions.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>{item.label}</option>
                  )
                })
              }
            </select>
            {/*
            <label>높이 설정</label>
            <select
              id="data-create-3d-height-reference"
              {...register("properties.heightReference")}
            >
              {
                heightReferenceOptions.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>{item.label}</option>
                  )
                })
              }
            </select>
            <label>대표 위치</label>
            <input
              type="number"
              className="short"
              readOnly
              id="data-create-3d-longitude"
              placeholder="경도"
              {...register("properties.longitude")}
            />
            <input
              type="number"
              className="short"
              readOnly
              id="data-create-3d-latitude"
              placeholder="위도"
              {...register("properties.latitude")}
            />
            <input
              type="number"
              className="short"
              id="data-create-3d-height"
              placeholder="높이"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              {...register("properties.height")}
            />
            <button type="button" className="map-check" onClick={toggleMap}>지도</button>
            */}
            <label>{t("description")}</label>
            <input type="text" id="data-create-3d-description" {...register("description")}/>
          </div>
          {/*<OlMapForGetCoordinate className="coordinate-map" on={onMap} callback={clickCallback}/>*/}
          <label>{t("upload-file")}</label>
          <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile}/>
        </form>

      </article>
      <div className="cboth alg-right">
        <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>{t("save")}</button>
        <button type="button" className="btn-l-cancel" onClick={toList}>{t("cancel")}</button>
      </div>
    </>
  )
}

export default Create3d;