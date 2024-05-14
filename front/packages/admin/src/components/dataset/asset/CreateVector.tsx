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

const FormSchema = z.object({
  groupId: z.string().nonempty('그룹을 선택하세요.'),
  name: z.string().trim().nonempty('데이터명을 입력해주세요.'),
  description: z.string().optional(),
  assetType: z.nativeEnum(AssetType),
});
type FormType = z.infer<typeof FormSchema>;

const CreateVector = () => {
  const back = useToPath('/dataset/asset');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.Terrain);
  const navigate = useNavigate();
  const currentLoadingState = useRecoilValue<LoadingStateType>(loadingState);
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [uploadedFiles] = uploadedFilesState;
  const {data} = useOutletContext<CreateAssetOutletContext>();

  const {register, handleSubmit} = useForm<FormType>({
    resolver: zodResolver(FormSchema)
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
      alert('파일 업로드 중입니다. 잠시만 기다려주세요.');
      return;
    }

    if (uploadedFiles.length === 0) {
      alert('파일을 업로드해주세요.');
      return;
    }

    if (!confirm('등록하시겠습니까?')) return;

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
          <label htmlFor="data-create-3d-groups">데이터 그룹</label>
          <select id="data-create-3d-groups"{...register("groupId")}>
            {
              groups.items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)
            }
          </select>

          <label htmlFor="data-create-3d-name">데이터명</label>
          <input type="text" id="data-create-3d-name" {...register("name")}/>

          <label htmlFor="data-create-3d-asset-type">데이터 타입</label>
          <select id="data-create-3d-asset-type" {...register("assetType")} onChange={changeAssetType}>
            <option value={AssetType.GeoJson}>GeoJson</option>
            <option value={AssetType.Shp}>Shp</option>
          </select>

          <label>설명</label>
          <input type="text" id="data-create-3d-description" {...register("description")}/>

          <label>업로드 파일</label>
          <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile}/>
        </form>
      </article>

      <div className="cboth alg-right">
        <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>저장</button>
        <button type="button" className="btn-l-cancel" onClick={back}>취소</button>
      </div>
    </>
  );
}

export default CreateVector;