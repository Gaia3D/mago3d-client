import {CSSProperties, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {useRecoilState} from 'recoil';
import {v4 as uuidv4} from 'uuid';
import {LoadingStateType, UploadedFile} from '../types/Common';
import {fileUpload} from '../api/http';
import {loadingState} from '../recoils/Spinner';
import {useMutation} from "@apollo/client";
import {DatasetDeleteAssetFileDocument} from "@src/generated/gql/dataset/graphql";
import uploadImage from '/public/images/upload-img.png';
import fileImage from '/public/images/image-file.png';


const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function FileItem({name, progress = 0, deleteFunc, uuid}: {
  uuid: string,
  name: string,
  progress?: number,
  deleteFunc: (uuid: string) => void
}) {
  return (
    <div className="file">
      <div className="thumbnail">
        <img src={fileImage} alt="파일타입 이미지" className="image"/>
      </div>
      <div className="details">
        <div className="filename">
          <span className="name">{name}</span>
          {
            progress === 100 ?
              <button type="button" className="file-delete" onClick={() => {
                deleteFunc(uuid)
              }}></button>
              : <></>
          }
        </div>
        <div className="progress">
          <div className="bar" style={{width: `${progress}%`}}></div>
        </div>
      </div>
    </div>
  )
}

enum UploadState {
  READY,
  UPLOADING,
  UPLOAD_COMPLETE,
  COMPLETE
}

interface UploadFile extends File {
  uuid: string
}

interface Item {
  uuid: string
  name: string
  progress?: number
  state: UploadState
}

interface deleteFileVariables {
  id: string
  fileId: string
}

function StyledDropzone({uploadedFilesState, update = false, acceptFile = {}}: {
  uploadedFilesState: [UploadedFile[], Dispatch<SetStateAction<UploadedFile[]>>],
  update?: boolean,
  acceptFile?: { [key: string]: string[] }
}) {

  const getInitItems = useCallback((uploadedFilesState: [UploadedFile[], Dispatch<SetStateAction<UploadedFile[]>>]): Item[] | [] => {
    const [uploadedFiles] = uploadedFilesState;
    if (!uploadedFiles || uploadedFiles.length === 0) return [];

    return uploadedFiles.map(uploadedFile => ({
      uuid: uploadedFile.clientId,
      name: uploadedFile.filename,
      progress: 100,
      state: UploadState.COMPLETE
    } as Item));
  }, []);

  const [deleteMutation] = useMutation(DatasetDeleteAssetFileDocument);

  const [currentLoadingState, setLoadingState] = useRecoilState<LoadingStateType>(loadingState);
  const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [fileItems, setFileItems] = useState<Item[]>(getInitItems(uploadedFilesState));

  const uploadProgress = (progress: number, file: UploadFile) => {
    const index = fileItems.findIndex(item => item.uuid === file.uuid)
    const prev = fileItems[index].progress;

    let next = progress * 100;
    if (prev !== undefined && prev > next) next = prev;
    fileItems[index].progress = next;

    if (fileItems[index].state === UploadState.READY) {
      fileItems[index].state = UploadState.UPLOADING;
    } else if (fileItems[index].state === UploadState.UPLOADING && next === 100) {
      fileItems[index].state = UploadState.UPLOAD_COMPLETE;
    }

    setFileItems([...fileItems]);
  }

  const upload = async (file: UploadFile) => {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([new Uint8Array(arrayBuffer)], {type: file.type});
    const formData = new FormData();
    formData.append('files', blob, file.name);

    const response = await fileUpload({
      data: formData,
      config: {
        onUploadProgress({progress}): void {
          if (!progress) return;
          uploadProgress(progress, file);
        }
      }
    });

    const index = fileItems.findIndex(item => item.uuid === file.uuid)
    fileItems[index].state = UploadState.COMPLETE;
    setFileItems([...fileItems]);

    const [uploadResponse] = response.data;
    const uploadFile = {
      clientId: file.uuid,
      dbId: uploadResponse.id,
      uploded: false
    } as UploadedFile;

    return uploadFile;
  }

  useEffect(() => {
    const filter = files.filter((file) => {
      if (!fileItems.find(item => item.uuid === file.uuid)) return file;
    }).map(({name, uuid}): Item => {
      return {
        name,
        uuid,
        state: UploadState.READY
      };
    });

    setFileItems([...fileItems, ...filter]);
  }, [files]);

  useEffect(() => {
    if (currentLoadingState.loading) return;

    const filesForUpload = files.filter((file) => {
      if (fileItems.find(item => item.state === UploadState.READY && item.uuid === file.uuid)) return file;
    });

    if (filesForUpload.length === 0) return;

    const uploadPromises = [];
    for (const file of filesForUpload) {
      uploadPromises.push(upload(file));
    }

    Promise.all(uploadPromises)
      .then(uploadCompleteFiles => {
        setUploadedFiles([
          ...uploadedFiles,
          ...uploadCompleteFiles
        ])
      });
  }, [fileItems]);

  useEffect(() => {
    const uploadedItems = fileItems.filter(item => item.state === UploadState.COMPLETE);
    const uploading = fileItems.length !== uploadedItems.length;
    const loadingState = {...currentLoadingState};
    loadingState.loading = uploading;
    setLoadingState(loadingState);
  }, [fileItems]);

  const deleteFile = async (uuid: string) => {
    if (!confirm('삭제하시겠습니까?')) return;

    const {remain, deleteFileId, deleteAssetId} = uploadedFiles.reduce((accum, file) => {
      if (file.clientId !== uuid) {
        accum.remain.push(file);
      } else {
        if (file.uploded) {
          accum.deleteFileId = file.dbId
          accum.deleteAssetId = file.assetId
        }
      }

      return accum;
    }, {
      remain: [] as UploadedFile[],
      deleteFileId: undefined as string | undefined,
      deleteAssetId: undefined as string | undefined
    });

    let deleteSuccess = true;
    if (update && deleteFileId && deleteAssetId) {

      //todo : deleteMutation
      deleteMutation({
        variables: {
          id: deleteAssetId,
          fileId: deleteFileId
        }
      })

      deleteSuccess = true;

      // deleteSuccess = await deleteMutation.mutateAsync({id: deleteAssetId, fileId: deleteFileId})
      //   .then((res) => res.deleteAssetFile);
    }

    if (!deleteSuccess) {
      alert('삭제에 실패했습니다.');
      return;
    }

    const remainFiles = files.filter(file => file.uuid !== uuid);
    const remainFileItems = fileItems.filter(file => file.uuid !== uuid);

    setFiles(remainFiles);
    setFileItems(remainFileItems);
    setUploadedFiles(remain);
  }

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    multiple: true,
    accept: {
      ...acceptFile,
    },
    onDrop(acceptedFiles) {
      if (acceptedFiles.length === 0) {
        // 허용되지 않는 파일이 드래그 앤 드롭된 경우, 경고창을 띄웁니다.
        alert('허용되지 않는 파일 유형입니다. 다시 시도해주세요. \n허용되는 파일 유형은 ' + Object.values(acceptFile).join(', ') + ' 입니다.');
      } else {
        const uuidFiles = acceptedFiles.map((file: File): UploadFile => {
          const f = file as UploadFile;
          f.uuid = uuidv4();
          console.info(f);
          return f;
        });
        setFiles([...files, ...uuidFiles]);
      }
    },
  });

  const style = useMemo(() => ({
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]) as CSSProperties | undefined;
  return (
    <>
      <div className="upload-wrapper">
        <div className="upload-box">
          <div  {...getRootProps({style})} className="drag-file">
            <label className="file-label" htmlFor="dropzone-upload-file">
              <img src={uploadImage} id="dropzone-upload-file" width={50} height={50} alt="파일 아이콘"/>
              <br/><br/>
              <input {...getInputProps()} />
              <p className="message">업로딩 하려면 파일을 올리거나 클릭하십시오.</p>
            </label>
          </div>
        </div>
        <div id="files" className="files">
          {
            fileItems.map(({name, progress, uuid}) => {
              return <FileItem uuid={uuid} name={name} progress={progress} deleteFunc={deleteFile} key={uuid}/>
            })
          }
        </div>
      </div>
    </>
  );
}

export default StyledDropzone;