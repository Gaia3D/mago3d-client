import { CSSProperties, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid'
import { bbsGraphqlFetcher } from '@/api/queryClient';
import { mapnoteFileUpload as fileUpload } from '@/api/http';
import { loadingState } from '@/recoils/Spinner';
import { DELETE_MAP_NOTE_FILE } from '@/graphql/bbs/Mutation';
import { produce } from 'immer';


const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

function FileItem({ name, deleteFunc, uuid } : {uuid:string, name: string, deleteFunc:(uuid:string)=>void}) {
    return (
        <li>{name} <div className="button-delete" onClick={()=>{deleteFunc(uuid)}}></div></li>
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
    state: UploadState
}
interface deleteFileVariables {
    id: string
    fileId: string
}

export type UploadedFile = {
    assetId: string,
    dbId: string,
    clientId: string,
    filename?:string,
    uploded:boolean
}

type LoadingStateType= {
    loading: boolean,
    msg: string
}

function StyledDropzone({uploadedFilesState, update = false, acceptFile = {}, reset}: {
    uploadedFilesState: [UploadedFile[], Dispatch<SetStateAction<UploadedFile[]>>],
    update?: boolean,
    acceptFile?: { [key: string]: string[] } 
    reset: [boolean, Dispatch<SetStateAction<boolean>>]
    }) {

    const {mutateAsync: deleteMutateAsync} = useMutation({
        mutationFn: (ids:string[] | string)=> bbsGraphqlFetcher(DELETE_MAP_NOTE_FILE, {id:ids}),
    });

    const [currentLoadingState, setLoadingState] = useRecoilState<LoadingStateType>(loadingState);
    const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
    const [resetUploadFile, setResetUploadFile] = reset;
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [fileItems, setFileItems] = useState<Item[]>([]);

    useEffect(()=>{
        const [uploadedFiles] = uploadedFilesState;
        if(uploadedFiles && uploadedFiles.length > 0) {
            const items =  uploadedFiles.map(uploadedFile => ({
                uuid: uploadedFile.clientId,
                name: uploadedFile.filename,
                state: UploadState.COMPLETE
            } as Item));
            setFileItems(produce(draft => {
                draft.length = 0;
                draft.push(...items);
            }));
        } 
    }, [uploadedFiles]);
    
    const upload = async (file: UploadFile) => {
        const arrayBuffer = await file.arrayBuffer();
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type : file.type} );
        const formData = new FormData();
        formData.append('files', blob, file.name);

        const response = await fileUpload({
            data: formData,
        });

        const index = fileItems.findIndex(item=> item.uuid === file.uuid)
        fileItems[index].state = UploadState.COMPLETE;
        setFileItems([...fileItems]);
        
        const [uploadResponse] = response.data;
        const uploadFile = {
            clientId:  file.uuid,
            dbId: uploadResponse.id,
            uploded: false,
            filename: file.name
        } as UploadedFile;

        return uploadFile;
    }

    useEffect(() => {
        if (!resetUploadFile) return;
        deleteFiles();
        setResetUploadFile(false);
    }, [resetUploadFile]);

    useEffect(() => {
        const filter = files.filter((file)=>{
            if(!fileItems.find(item => item.uuid === file.uuid)) return file;
        }).map(({name, uuid}) : Item =>{
            return {
                name, 
                uuid,
                state: UploadState.READY
            };
        });
        setFileItems([...fileItems, ...filter]);
    }, [files]);
    
    useEffect(() => {
        if(currentLoadingState.loading) return;

        const filesForUpload = files.filter((file)=>{
            if(fileItems.find(item => item.state === UploadState.READY && item.uuid === file.uuid)) return file;
        });

        if(filesForUpload.length === 0) return;

        const uploadPromises = [];
        for(const file of filesForUpload) {
            uploadPromises.push(upload(file));
        }

        Promise.all(uploadPromises)
        .then(uploadCompleteFiles=>{
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
        if(!confirm('삭제하시겠습니까?')) return;

        const {remain, deleteFileId} = uploadedFiles.reduce((accum, file) => {
            if(file.clientId !== uuid) {
                accum.remain.push(file);
            } else {
                if(file.uploded) {
                    accum.deleteFileId = file.dbId
                }
            }

            return accum;
        }, {
            remain:[] as UploadedFile[],
            deleteFileId: undefined as string | undefined,
        });
        
        let deleteSuccess = true;
        if(update && deleteFileId) {
            const deletePromise = await deleteMutateAsync(deleteFileId);
            deleteSuccess = true
        }

        if(!deleteSuccess) {
            alert('삭제에 실패했습니다.');
            return;
        }
        
        const remainFiles = files.filter(file=>file.uuid !== uuid);
        const remainFileItems = fileItems.filter(file=>file.uuid !== uuid);

        setFiles(remainFiles);
        setFileItems(remainFileItems);
        setUploadedFiles(remain);
    }

    const deleteFiles = async () => {
        const {remain, remainClientIds, deleteFileIds} = uploadedFiles.reduce((accum, file) => {
            if(file.uploded) {
                accum.remainClientIds.push(file.clientId);
                accum.remain.push(file);
            } else {
                accum.deleteFileIds.push(file.dbId);
            }

            return accum;
        }, {
            remain:[] as UploadedFile[],
            remainClientIds:[] as string[],
            deleteFileIds: [] as string[],
        });
        
        const remainFiles = files.filter(file=>remainClientIds.indexOf(file.uuid) > -1);
        const remainFileItems = fileItems.filter(file=>remainClientIds.indexOf(file.uuid) > -1);

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
            const uuidFiles = acceptedFiles.map((file: File):UploadFile => {
                const f = file as UploadFile;
                f.uuid = uuidv4();
                return f;
            });
            setFiles([...files, ...uuidFiles]);
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
            <div className="pointer-list">
                <ul>
                {
                    fileItems.map(({name, uuid}) => {
                        return <FileItem uuid={uuid} name={name} deleteFunc={deleteFile} key={uuid}/>
                    })
                }
                </ul>
            </div>
            <div {...getRootProps({style})} className="pointer-list">
                <input {...getInputProps()} />
                파일을 드래그하여 첨부하여 주십시오.
            </div>
        </>
    );
}

function StyledDropzoneExcel({uploadedFilesState, update = false, acceptFile = {}, reset}: {
    uploadedFilesState: [UploadFile[], Dispatch<SetStateAction<UploadFile[]>>],
    update?: boolean,
    acceptFile?: { [key: string]: string[] }
    reset: [boolean, Dispatch<SetStateAction<boolean>>]
}) {

    const [currentLoadingState, setLoadingState] = useRecoilState<LoadingStateType>(loadingState);
    const [resetUploadFile, setResetUploadFile] = reset;
    const [files, setFiles] = uploadedFilesState;
    const [fileItems, setFileItems] = useState<Item[]>([]);

    useEffect(() => {
        if (!resetUploadFile) return;
        setFiles([]);
        setFileItems([]);
        setResetUploadFile(false);
    }, [resetUploadFile]);

    useEffect(() => {
        const filter = files.filter((file)=>{
            if(!fileItems.find(item => item.uuid === file.uuid)) return file;
        }).map(({name, uuid}) : Item =>{
            return {
                name,
                uuid,
                state: UploadState.READY
            };
        });
        setFileItems([...fileItems, ...filter]);
    }, [files]);

    const deleteFile = async (uuid: string) => {
        if (!confirm('삭제하시겠습니까?')) return;

        const remainFiles = files.filter(file => file.uuid !== uuid);
        const remainFileItems = fileItems.filter(file => file.uuid !== uuid);

        setFiles(remainFiles);
        setFileItems(remainFileItems);
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
            const uuidFiles = acceptedFiles.map((file: File):UploadFile => {
                const f = file as UploadFile;
                f.uuid = uuidv4();
                return f;
            });
            setFiles([...files, ...uuidFiles]);
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
          <div className="pointer-list">
              <ul>
                  {
                      fileItems.map(({name, uuid}) => {
                          return <FileItem uuid={uuid} name={name} deleteFunc={deleteFile} key={uuid}/>
                      })
                  }
              </ul>
          </div>
          <div {...getRootProps({style})} className="pointer-list">
              <input {...getInputProps()} />
              파일을 드래그하여 첨부하여 주십시오.
          </div>
      </>
    );
}

export default StyledDropzone;
export { StyledDropzoneExcel };