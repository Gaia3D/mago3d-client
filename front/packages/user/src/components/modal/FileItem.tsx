import React, {MouseEvent} from 'react';
import {useTranslation} from "react-i18next";

interface FileItemProps {
    uuid: string,
    name: string,
    progress?: number,
    deleteFunc: (uuid: string) => void
}

const FileItem: React.FC<FileItemProps> = ({name, progress = 0, deleteFunc, uuid}) => {
    const {t} = useTranslation();
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
            }}>{t("remove")}
            </button>
        </div>
    );
};

export default FileItem;