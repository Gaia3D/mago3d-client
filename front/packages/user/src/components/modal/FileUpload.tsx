import React, {ChangeEvent} from 'react';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => (
    <label className="file-upload-wrapper">
        <div className="file-upload-icon"></div>
        <div className="file-upload-text">Drop files here</div>
        <input
            type="file"
            id="file-upload"
            onChange={(e: ChangeEvent<HTMLInputElement>) => onFileSelect(e.target.files ? e.target.files[0] : null)}
        />
    </label>
);

export default FileUpload;