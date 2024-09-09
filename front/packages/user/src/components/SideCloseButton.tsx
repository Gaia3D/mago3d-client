import React from 'react';
import {useSetRecoilState} from "recoil";
import {mainMenuState} from "@/recoils/MainMenuState.tsx";
import {useTranslation} from "react-i18next";

const SideCloseButton = () => {
    const {t} = useTranslation();
    const setMenu = useSetRecoilState(mainMenuState);
    return (
        <div className="button side" onClick={() => setMenu({SelectedId: ''})}>
            <div className="description--content">
                <div className="title">{t("aside.close-sidebar")}</div>
            </div>
        </div>
    );
};

export default SideCloseButton;