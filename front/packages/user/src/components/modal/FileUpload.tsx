import React, {Dispatch, forwardRef, SetStateAction, useEffect, useImperativeHandle, useRef, useState} from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile, UploadFile, UploadItem, UploadState } from "@/types/Common.ts";
import {useSetRecoilState} from "recoil";
import {assetLoadingState, AssetLoadingStateType} from "@/recoils/Spinner.ts";
import { datasetFileUpload } from "@/api/http.ts";
import FileItem from "@/components/modal/FileItem.tsx";
import {useTranslation} from "react-i18next";

interface FileUploadProps {
    update?: boolean,
    acceptFile?: { [key: string]: string[] }
}

const FileUpload = forwardRef(({ acceptFile = {} }: FileUploadProps, ref) => {
    const {t} = useTranslation();
    const setAssetLoadState = useSetRecoilState<AssetLoadingStateType>(assetLoadingState);
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [fileItems, setFileItems] = useState<UploadItem[]>([]);
    const uploadingFilesRef = useRef(new Set<string>());

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

    const upload = async (file: UploadFile) => {
        // 파일 이진데이터 일기
        const arrayBuffer = await file.arrayBuffer();
        // blob(서버에 전송할 수 있는 데이터) 객체 생성
        const blob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
        // formData 생성
        const formData = new FormData();
        formData.append('files', blob, file.name);

        // 파일 업로드 요청
        const response = await datasetFileUpload({
            data: formData,
            config: {
                onUploadProgress({ progress }) {
                    if (progress) {
                        uploadProgress(progress, file);
                    }
                }
            }
        });
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
            alert(t("alert.file-upload"));
            return;
        }
        if (!confirm(t("confirm.register"))) return;

        setAssetLoadState(prev => ({ ...prev, loading: true, msg: t("msg.file-upload") }));

        const uploadPromises = files.map(file => {
            uploadingFilesRef.current.add(file.uuid);
            return upload(file).then(uploadedFile => {
                return uploadedFile;
            });
        });

        const uploadedFilesResult = await Promise.all(uploadPromises); // 업로드 완료 후 결과 반환

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

        if (!uploadedFilesResult || uploadedFilesResult.length === 0) {
            alert(t("error.file.upload"));
            return;
        }

        return uploadedFilesResult; // 업로드된 파일 리스트 반환
    };

    useImperativeHandle(ref, () => ({
        readyUpload
    }));

    const deleteFile = async (uuid: string) => {
        if (!confirm(t("confirm.delete"))) return;

        setFiles(prev => prev.filter(file => file.uuid !== uuid));
        setFileItems(prev => prev.filter(item => item.uuid !== uuid));
    };

    const { getRootProps, getInputProps } = useDropzone({
        multiple: true,
        accept: {...acceptFile},
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length === 0) {
                alert(t("error.file.validate") + Object.values(acceptFile).join(', '));
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
                        <div className="file-upload-text">{t("aside.common.drop-file-here")}</div>
                    </>
                )}
            </div>
        </div>
    );
});

export default FileUpload;