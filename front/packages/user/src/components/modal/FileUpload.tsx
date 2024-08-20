import React, {ChangeEvent} from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
    onFileAdd: (files: File[]) => void;
    fileItem: File[] | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileAdd, fileItem }) => {

    const onDrop = (acceptedFiles: File[]) => {
        onFileAdd([...(fileItem || []), ...acceptedFiles]);
    };

    const removeFile = (fileName: string) => {
        onFileAdd(fileItem?.filter(file => file.name !== fileName) || []);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div className="file-upload-container file-upload-wrapper">
            <div {...getRootProps({className: 'dropzone'})}>
                <input {...getInputProps()} />
                {fileItem?.length ? (
                    fileItem.map((file, index) => (
                        <div key={index} className="uploaded-file-item" onClick={e=>e.stopPropagation()}>
                            <span>{file.name}</span>
                            <button onClick={() => removeFile(file.name)}>Remove</button>
                        </div>
                    ))
                ):(
                    <>
                        <div className="file-upload-icon"></div>
                        <div className="file-upload-text">Drop files here</div>
                    </>
                )}
            </div>
        </div>
    )
};

export default FileUpload;