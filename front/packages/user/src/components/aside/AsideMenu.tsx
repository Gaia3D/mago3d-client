import {mainMenuState, newLayerCountState, newTerrainCountState} from "@/recoils/MainMenuState.tsx";
import React, {useMemo} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import {useUserInfoLoadable} from "@/components/providers/UserInfoLoadableProvider.tsx";
import {useTranslation} from "react-i18next";
import {CurrentCreatePropIdState} from "@/recoils/Tool.ts";

export const AsideMenu = () => {
  const {t} = useTranslation();
  const [menu, setMenu] = useRecoilState(mainMenuState);
  const [newLayerCount, setNewLayerCount] = useRecoilState(newLayerCountState);
  const [newTerrainCount, setNewTerrainCount] = useRecoilState(newTerrainCountState);
  const setCurrentCreatePropId = useSetRecoilState(CurrentCreatePropIdState);

  const {userInfo} = useUserInfoLoadable();

  const handleMenuClick = (e: React.MouseEvent<HTMLLIElement>, menuName: string) => {
    e.preventDefault();
    setMenu((prev) => ({
      ...prev,
      SelectedId: prev.SelectedId === menuName ? '' : menuName
    }));
    if (menuName === 'layers') {
      setNewLayerCount(0);
    }
    if (menuName === 'terrains') {
      setNewTerrainCount(0);
    }
    if (menuName !== 'props') {
      setCurrentCreatePropId('');
    }
  };

  const items = useMemo(() => {
    return [
      {className: "assets", text: "assets"},
      {className: "layers", text: "layers"},
      {className: "terrains", text: "terrains"},
      {className: "props", text: "props"},
    ];
  }, [userInfo]);

  return (
    <>
      <ul>
        {items.map((item) => (
            <li key={item.className}
                className={`menu ${menu.SelectedId === item.className ? "on" : ""} ${item.className}`}
                onClick={(e) => handleMenuClick(e, item.className)}>
              <span className={"text"}>
                  {t(item.text)}
              </span>
              {(newLayerCount > 0 && item.className === "layers") && <span className="layer-number">{newLayerCount}</span>}
              {(newTerrainCount > 0 && item.className === "terrains") && <span className="terrain-number">{newTerrainCount}</span>}
            </li>
        ))}
      </ul>
    </>
  );
};
