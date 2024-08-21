import React, {MouseEvent} from 'react';

interface FileItemProps {
    uuid: string,
    name: string,
    progress?: number,
    deleteFunc: (uuid: string) => void
}

const FileItem: React.FC<FileItemProps> = ({name, progress = 0, deleteFunc, uuid}) => {
    return (
        <div className="file" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
            <div className="img"></div>
            <div className="details">
                <div className="filename">
                    <span className="name">{name}</span>
                </div>
                <div className="progress">
                    <div className="bar" style={{width: `${progress}%`}}></div>
                </div>
            </div>
            <button type="button" className="file-delete" onClick={() => {
                deleteFunc(uuid)
            }}>삭제
            </button>
        </div>
    );
};

export default FileItem;