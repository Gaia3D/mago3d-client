import React, {MouseEvent} from 'react';
import {useTranslation} from "react-i18next";
import {useRecoilState, useRecoilValue} from "recoil";
import {IsLogModalState, LogModalContentState} from "@/recoils/Modal.ts";

const LogModal = () => {
    const {t} = useTranslation();
    const [isLogModal, setIsLogModal] = useRecoilState(IsLogModalState);
    const logContent = useRecoilValue(LogModalContentState);
    const handleCloseModal = () => setIsLogModal(false);
    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div className={`modal log-modal ${isLogModal? 'on':'off'}`} onClick={handleCloseModal}>
            <div className="modal-content log"  onClick={handleModalClick}>
                <div className="modal-popup-header">
                    <h2>Log</h2>
                    <button type="button" className="button-close" onClick={() => setIsLogModal(false)}></button>
                </div>
                <div className="modal-popup-body">
                    {logContent}
                </div>
            </div>
        </div>
    );
};

export default LogModal;