import React from 'react';
import {useRecoilValue} from "recoil";
import {assetLoadingState, AssetLoadingStateType} from "@/recoils/Spinner.ts";

const AssetLoadSpinner = () => {
    const {loading, msg} = useRecoilValue<AssetLoadingStateType>(assetLoadingState);
    return (
        <div className="toast-bar" style={{display: `${loading ? 'block' : 'none'}`}}>
            <div className="toast-wrapper">
                <div className="spinner-wrapper">
                    <div id="spinner"></div>
                </div>
                <span className="toast-message">{msg}</span>
            </div>
        </div>
    );
};

export default AssetLoadSpinner;