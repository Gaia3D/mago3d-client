import React, {useEffect, useState} from 'react';
import {useRecoilValue} from "recoil";
import {assetsConvertingListState} from "@/recoils/Assets.ts";
import {useTranslation} from "react-i18next";

interface ConversionGuardProps {
    assetType: string;
}

const ConversionGuard: React.FC<ConversionGuardProps> = ({assetType}) => {
    const {t} = useTranslation();
    const assetConvertingList = useRecoilValue(assetsConvertingListState);
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        if (assetConvertingList.some((asset) => asset === assetType)) {
            setIsShow(true);
        } else {
            setIsShow(false);
        }
    }, [assetConvertingList, assetType]);

    return (
        <div className={`conversion-guard ${isShow ? "on" : "off"}`}>
            <b>{assetType} {t("aside.asset.file-uploading")}</b>
            <span className="spin-loader"></span>
        </div>
    );
};

export default ConversionGuard;
