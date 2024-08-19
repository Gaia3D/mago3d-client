import React from 'react';
import {useSetRecoilState} from "recoil";
import {mainMenuState} from "@/recoils/MainMenuState.tsx";

const SideCloseButton = () => {
    const setMenu = useSetRecoilState(mainMenuState);
    return (
        <div className="button side" onClick={() => setMenu({SelectedId: ''})}>
            <div className="description--content">
                <div className="title">Close sidebar</div>
            </div>
        </div>
    );
};

export default SideCloseButton;