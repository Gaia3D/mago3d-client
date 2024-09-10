import React from 'react';
import {useRecoilState} from "recoil";
import {stackAlertArrState} from "@/recoils/Spinner.ts";

const StackAlert = () => {

    const [stackAlertArr, setStackAlertArr] = useRecoilState(stackAlertArrState);

    return (
        <div className="stack-alert-container">
            {
                stackAlertArr.map(alert => (
                    <div key={alert.id} className="toast-bar">
                        <div className="toast-wrapper">
                            <div className="spinner-wrapper">
                                <div id="spinner"></div>
                            </div>
                            <span className="toast-message">{alert.msg}</span>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default StackAlert;