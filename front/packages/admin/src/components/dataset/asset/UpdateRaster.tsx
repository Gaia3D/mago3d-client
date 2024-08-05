import {useNavigate, useOutletContext} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {AppLoader} from "@mnd/shared";
import {Suspense, useEffect, useState} from "react";
import {LoadingStateType, UploadedFile} from "@src/types/Common";
import StyledDropzone from "../../Dropzone";
import {useRecoilValue} from "recoil";
import {loadingState} from "@src/recoils/Spinner";
import {dataSearchSelector} from "@src/recoils/Data";
import {classifyAssetTypeAcceptFile} from "@src/api/Data";
import {assetRasterTypeOptions} from "./constant";
import {v4 as uuidv4} from 'uuid';
import {
  AssetType,
  DatasetAssetListQueryVariables, DatasetGroupListDocument,
  DatasetUpdateAssetDocument,
  UpdateAssetInput
} from "@src/generated/gql/dataset/graphql";
import {AssetOutletContext} from "./AssetOutletContext";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

const defaultUpdateAssetInput = {
  enabled: true,
  access: 'Public'
} as UpdateAssetInput;

const UpdateRaster = () => {
  const {t} = useTranslation();
  const {id, data: {asset}} = useOutletContext<AssetOutletContext>();
  const {data : {groups}} = useSuspenseQuery(DatasetGroupListDocument);

  const [renderReady, isRenderReady] = useState<boolean>(false);
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType>(AssetType.Terrain);
  const navigate = useNavigate();
  const searchProps = useRecoilValue<DatasetAssetListQueryVariables>(dataSearchSelector);
  const currentLoadingState = useRecoilValue<LoadingStateType>(loadingState);
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
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

  const toBack = () => navigate(`/dataset/asset/`);

  const [updateMutation] = useMutation(DatasetUpdateAssetDocument, {
    update(cache) {
      cache.evict({fieldName: 'assets'});
    }
  });

  const onSubmit: SubmitHandler<UpdateAssetInput> = (data) => {
    if (currentLoadingState.loading) {
      toast(t("uploading-file"));
      return;
    }

    if (!confirm(t("question.create"))) return;
    const input = {} as UpdateAssetInput;

    const uploadIds = uploadedFiles.filter(uploadedFile => !uploadedFile.uploded).map((uploadedFile) => uploadedFile.dbId);
    if (uploadIds && uploadIds.length > 0) data.uploadId = uploadIds

    Object.assign(input, defaultUpdateAssetInput, data);
    updateMutation({variables: {id, input}}).then(() => {
      alert(t("success.edited"));
      navigate(-1);
    });
  }
//temp source
  const acceptFile = classifyAssetTypeAcceptFile(selectedAssetType);
  const firstGroupId = asset.groups?.at(0)?.id;

  return (
    <Suspense fallback={<AppLoader/>}>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{display: "inline-block"}}>
            <label htmlFor="data-update-3d-groups">{t("data-group")}</label>
            {
              asset ? <select
                  id="data-update-3d-groups"
                  {...register("groupId", {
                    required: {
                      value: true,
                      message: t("validation.groups")
                    },
                  })}
                  defaultValue={firstGroupId}
                >
                  {
                    groups.items.map((item, index) => {
                      return (
                        <option key={item.id} value={item.id}>{item.name}</option>
                      )
                    })
                  }
                </select>
                : null
            }

            <label htmlFor="data-update-3d-name">{t("data-name")}</label>
            <input type="text"
                   id="data-update-3d-name"
                   defaultValue={asset?.name}
                   {...register("name", {
                     required: {
                       value: true,
                       message: t("validation.data")
                     },
                   })}
            />
            <label htmlFor="data-update-3d-asset-type">{t("data-type")}</label>
            {
              asset?.assetType ? <select
                  id="data-update-3d-asset-type"
                  {...register("assetType", {
                    required: {
                      value: true,
                      message: t("validation.data-type")
                    },
                  })}
                  onChange={changeAssetType}
                  defaultValue={asset?.assetType}
                >
                  {
                    assetRasterTypeOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      )
                    })
                  }
                </select>
                : null
            }
            <label>{t("description")}</label>
            <input type="text"
                   id="data-update-3d-description"
                   defaultValue={asset?.description}
                   {...register("description")}
            />
          </div>
          {
            renderReady &&
              <>
                  <label style={{width: "100%"}}>{t("upload-file")}</label>
                  <div style={{marginTop: '45px'}}>
                      <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile}
                                      update={true}/>
                  </div>
              </>
          }
        </form>

      </article>
      <div className="cboth alg-right">
        <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>{t("save")}</button>
        <button type="button" className="btn-l-cancel" onClick={toBack}>{t("cancel")}</button>
      </div>
    </Suspense>
  )
}

export default UpdateRaster;