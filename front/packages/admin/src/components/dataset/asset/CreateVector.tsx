import {useNavigate, useOutletContext} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {useState} from "react";
import {LoadingStateType, UploadedFile} from "@src/types/Common";
import StyledDropzone from "../../Dropzone";
import {useRecoilValue} from "recoil";
import {loadingState} from "@src/recoils/Spinner";
import {classifyAssetTypeAcceptFile} from "@src/api/Data";
import {useToPath} from "@src/hooks/common";
import {AssetType, DatasetCreateAssetDocument} from "@src/generated/gql/dataset/graphql";
import {CreateAssetOutletContext} from "./AssetOutletContext";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
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
  });
}

type FormSchemaType = ReturnType<typeof FormSchema>;
type FormType = z.infer<FormSchemaType>;

const CreateVector = () => {
  const {t} = useTranslation();
  const back = useToPath('/dataset/asset');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.Terrain);
  const navigate = useNavigate();
  const currentLoadingState = useRecoilValue<LoadingStateType>(loadingState);
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [uploadedFiles] = uploadedFilesState;
  const {data} = useOutletContext<CreateAssetOutletContext>();

  const {register, handleSubmit} = useForm<FormType>({
    resolver: zodResolver(FormSchema())
  });

  const acceptFile = classifyAssetTypeAcceptFile(selectedAssetType);

  const changeAssetType = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedAssetType(e.target.value as AssetType);

  const [createMutation] = useMutation(DatasetCreateAssetDocument, {
    update: (cache, {data}) => {
      cache.evict({fieldName: 'assets'});
    },
    onCompleted(data) {
      navigate(`/dataset/asset/${data.createAsset.id}`);
    }
  });

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

    const uploadId = uploadedFiles.map((uploadedFile) => uploadedFile.dbId);
    const input = {
      name: data.name,
      groupId: [data.groupId],
      description: data.description,
      assetType: data.assetType,
      uploadId
    }

    createMutation({
      variables: {
        input
      }
    })
  }

  const {groups} = data;

  return (
    <>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="data-create-3d-groups">{t("data-group")}</label>
          <select id="data-create-3d-groups"{...register("groupId")}>
            {
              groups.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
            }
          </select>

          <label htmlFor="data-create-3d-name">{t("data-name")}</label>
          <input type="text" id="data-create-3d-name" {...register("name")}/>

          <label htmlFor="data-create-3d-asset-type">{t("data-type")}</label>
          <select id="data-create-3d-asset-type" {...register("assetType")} onChange={changeAssetType}>
            <option value={AssetType.GeoJson}>GeoJson</option>
            <option value={AssetType.Shp}>Shp</option>
          </select>

          <label>{t("description")}</label>
          <input type="text" id="data-create-3d-description" {...register("description")}/>

          <label>{t("upload-file")}</label>
          <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile}/>
        </form>
      </article>

      <div className="cboth alg-right">
        <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>{t("save")}</button>
        <button type="button" className="btn-l-cancel" onClick={back}>{t("cancel")}</button>
      </div>
    </>
  );
}

export default CreateVector;