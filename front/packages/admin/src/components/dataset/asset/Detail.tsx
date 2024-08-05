import {useNavigate} from "react-router-dom";
import {AssetType} from "@mnd/shared/src/types/dataset-gen-type";
import {AppLoader} from "@mnd/shared";
import {Suspense, useState} from "react";
import {UploadedFile} from "@src/types/Common";
import StyledDropzone from "../../Dropzone";
import {classifyAssetTypeAcceptFile} from "@src/api/Data";
import {assetTypeOptions, heightReferenceOptions} from "./constant";
import ProcessComponent from "../process/Process";
import ProcessLog from "../process/ProcessLog";
import {FragmentType, useFragment} from "@src/generated/gql/dataset";
import {DatasetAssetFileFragmentDoc, DatasetAssetForDetailDocument, Process} from "@src/generated/gql/dataset/graphql";
import {useSuspenseQuery} from "@apollo/client";
import WarningMessage from "./WarningMessage";
import fileImage from '/public/images/image-file.png';
import {useTranslation} from "react-i18next";


const Detail = ({id}: { id: string }) => {
  const {t} = useTranslation();
  const [renderReady] = useState<boolean>(false);
  const [selectedAssetType] = useState<AssetType>(AssetType.Terrain);
  const navigate = useNavigate();
  const uploadedFilesState = useState<UploadedFile[]>([]);
  const [process, setProcess] = useState<Process>();
  const handleProcessChange = (process: Process) => {
    setProcess(process);
  }

  const resetProcess = () => {
    setProcess(undefined);
  }

  const {data} = useSuspenseQuery(DatasetAssetForDetailDocument, {
    variables: {
      id
    }
  });
  const {asset} = data;

  const toList = () => navigate(`/dataset/asset`);

  const acceptFile = classifyAssetTypeAcceptFile(asset.assetType);

  return (
    <Suspense fallback={<AppLoader/>}>
      <article>
        <form style={{display: "flex", alignItems: "stretch"}}>
          <div style={{padding: "10px"}}>
            <label htmlFor="data-update-3d-groups">{t("data-group")}</label>
            {
              asset ? <select disabled>
                  {
                    asset.groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)
                  }
                </select>
                : null
            }

            <label htmlFor="data-update-3d-name">{t("data-name")}</label>
            <input type="text"
                   defaultValue={asset?.name}
                   disabled
            />
            <label htmlFor="data-update-3d-asset-type">{t("data-type")}</label>
            {
              asset?.assetType ? <select disabled value={asset?.assetType}>
                  {
                    assetTypeOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      )
                    })
                  }
                </select>
                : null
            }

            <label>{t("height-setting")}</label>
            {
              asset ? <select disabled value={asset?.properties?.heightReference}>
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

            <label>{t("main-position")}</label>
            <input
              type="text"
              className="short"
              readOnly
              placeholder={t("lon")}
              defaultValue={asset?.properties?.longitude}
            />
            <input
              type="text"
              className="short"
              readOnly
              placeholder={t("lat")}
              defaultValue={asset?.properties?.latitude}
            />
            <input
              type="text"
              className="short"
              placeholder={t("height")}
              defaultValue={asset?.properties?.height}
              disabled
            />
            <label>{t("description")}</label>
            <input type="text"
                   readOnly
                   defaultValue={asset?.description}
            />

          </div>
          <div id="files" className="files" style={{margin: "10px", flexGrow: "1"}}>
            {asset.files.map((file) => <FileItem key={file.id} file={file}/>)}
          </div>
          {/* <OlMapForGetCoordinate className="coordinate-map" on={onMap}/> */}
          {
            renderReady &&
              <StyledDropzone uploadedFilesState={uploadedFilesState} acceptFile={acceptFile} update={true}/>
          }
        </form>
      </article>
      <WarningMessage message={t("uploading-data")} />
      <ProcessComponent data={data} process={process} resetProcess={resetProcess}/>
      <ProcessLog assetId={asset.id} onProcessChange={handleProcessChange} resetProcess={resetProcess}/>
      <div className="cboth alg-right">
        {/* <button type="submit" className="btn-l-save" onClick={handleSubmit(onSubmit)}>저장</button> */}
        <button type="button" className="btn-l-cancel" onClick={toList}>{t("list")}</button>
      </div>
    </Suspense>
  );
}

function FileItem(props: {
  file: FragmentType<typeof DatasetAssetFileFragmentDoc>
}) {
  const {t} = useTranslation();
  const data = useFragment(DatasetAssetFileFragmentDoc, props.file);

  return (
    <div className="file" key={data.id}>
      <div className="thumbnail">
        <img src={fileImage} alt={t("file-type-img")} className="image"/>
      </div>
      <div className="details">
        <div className="filename">
          <span className="name">{data.filename}</span>
        </div>
        {/* <div className="progress">
                            <div className="bar" style={{width:`${progress}%`}}></div>
                        </div> */}
      </div>
    </div>
  )
}

export default Detail;