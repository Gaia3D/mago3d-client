import React, {Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile, UploadFile, UploadItem, UploadState } from "@/types/Common.ts";
import {useSetRecoilState} from "recoil";
import {assetLoadingState, AssetLoadingStateType} from "@/recoils/Spinner.ts";
import { bbsFileUpload } from "@/api/http.ts";
import FileItem from "@/components/modal/FileItem.tsx";

interface FileUploadProps {
    uploadedFilesState: [UploadedFile[], Dispatch<SetStateAction<UploadedFile[]>>],
    update?: boolean,
    acceptFile?: { [key: string]: string[] }
}

const FileUpload = forwardRef(({ uploadedFilesState, acceptFile = {} }: FileUploadProps, ref) => {
    const setAssetLoadState = useSetRecoilState<AssetLoadingStateType>(assetLoadingState);
    const [uploadedFiles, setUploadedFiles] = uploadedFilesState;
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [fileItems, setFileItems] = useState<UploadItem[]>([]);
    const uploadingFilesRef = useRef(new Set<string>());

    useEffect(() => {
        console.log("files: ", files);
        console.log("fileItems: ", fileItems);
        console.log("uploadedFiles: ", uploadedFiles);
    }, [files, fileItems, uploadedFiles]);

    // 업로드 진행상황을 알기위한 프로그래스
    const uploadProgress = (progress: number, file: UploadFile) => {
        setFileItems(prevItems => {
            return prevItems.map(item => {
                if (item.uuid === file.uuid) {
                    const updatedProgress = Math.max(item.progress || 0, progress * 100);
                    return {
                        ...item,
                        progress: updatedProgress,
                        state: updatedProgress === 100 ? UploadState.UPLOAD_COMPLETE : UploadState.UPLOADING
                    };
                }
                return item;
            });
        });
    };

    // 파일 업로드 기능
    const upload = async (file: UploadFile) => {
        // 파일 이진데이터 일기
        const arrayBuffer = await file.arrayBuffer();
        // blob(서버에 전송할 수 있는 데이터) 객체 생성
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
        // formData 생성
        const formData = new FormData();
        formData.append('files', blob, file.name);

        // 파일 업로드 요청
        const response = await bbsFileUpload({
            data: formData,
            config: {
                onUploadProgress({ progress }) {
                    if (progress) {
                        uploadProgress(progress, file);
                    }
                }
            }
        });

        // 응답처리
        const [uploadResponse] = response.data;
        console.log("uploadResponse: ", uploadResponse)
        return {
            clientId: file.uuid,
            dbId: uploadResponse.id,
            uploaded: false
        } as UploadedFile;
    };

    const readyUpload = async () => {
        if (files.length === 0) {
            alert('파일을 업로드해주세요.');
            return;
        }
        if (!confirm('등록하시겠습니까?')) return;

        setAssetLoadState(prev => ({ ...prev, loading: true, msg: "파일을 업로드 중입니다." }));

        const uploadPromises = files.map(file => {
            uploadingFilesRef.current.add(file.uuid);
            return upload(file).then(uploadedFile => {
                setUploadedFiles(prev => [...prev, uploadedFile]);
                return uploadedFile;
            });
        });

        return Promise.all(uploadPromises).finally(() => {
            setFileItems(prevItems =>
                prevItems.map(item => {
                    if (uploadingFilesRef.current.has(item.uuid)) {
                        return {
                            ...item,
                            state: UploadState.COMPLETE
                        };
                    }
                    return item;
                })
            );
            uploadingFilesRef.current.clear();
            setAssetLoadState(prev => ({ ...prev, loading: false }));
        });
    };

    useImperativeHandle(ref, () => ({
        readyUpload
    }));

    const deleteFile = async (uuid: string) => {
        if (!confirm('삭제하시겠습니까?')) return;

        const { remain } = uploadedFiles.reduce((accum, file) => {
            if (file.clientId !== uuid) {
                accum.remain.push(file);
            } else {
                if (file.uploaded) {
                    accum.deleteFileId = file.dbId;
                    accum.deleteAssetId = file.assetId;
                }
            }
            return accum;
        }, {
            remain: [] as UploadedFile[],
            deleteFileId: undefined as string | undefined,
            deleteAssetId: undefined as string | undefined
        });

        setFiles(prev => prev.filter(file => file.uuid !== uuid));
        setFileItems(prev => prev.filter(item => item.uuid !== uuid));
        setUploadedFiles(remain);
    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {...acceptFile},
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                alert('허용되지 않는 파일 유형입니다. 다시 시도해주세요.\n허용되는 파일 유형: ' + Object.values(acceptFile).join(', '));
                return;
            }
            const newFiles = acceptedFiles.map(file => {
                const f = file as unknown as UploadFile;
                f.uuid = uuidv4();
                return f;
            });

            setFiles(prev => [...prev, ...newFiles]);

            setFileItems(prev => [
                ...prev,
                ...newFiles.map(file => ({
                    uuid: file.uuid,
                    name: file.name,
                    state: UploadState.READY,
                    progress: 0
                }))
            ]);
        }
    });

    return (
        <div className="file-upload-container file-upload-wrapper">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                {fileItems.length ? (
                    fileItems.map(({ name, progress, uuid }) => (
                        <FileItem uuid={uuid} name={name} progress={progress} deleteFunc={deleteFile} key={uuid} />
                    ))
                ) : (
                    <>
                        <div className="file-upload-icon"></div>
                        <div className="file-upload-text">Drop files here</div>
                    </>
                )}
            </div>
        </div>
    );
});

export default FileUpload;