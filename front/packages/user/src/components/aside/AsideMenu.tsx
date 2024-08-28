import {mainMenuState, newLayerCountState} from "@/recoils/MainMenuState.tsx";
import React, {useMemo} from "react";
import {useRecoilState} from "recoil";
import {useUserInfoLoadable} from "@/components/providers/UserInfoLoadableProvider.tsx";
import {useTranslation} from "react-i18next";

export const AsideMenu = () => {
  const {t} = useTranslation();
  const [menu, setMenu] = useRecoilState(mainMenuState);
  const [newLayerCount, setNewLayerCount] = useRecoilState(newLayerCountState);
  const {userInfo} = useUserInfoLoadable();

  const handleMenuClick = (e: React.MouseEvent<HTMLLIElement>, menuName: string) => {
    e.preventDefault();
    setMenu((prev) => ({
      ...prev,
      SelectedId: prev.SelectedId === menuName ? '' : menuName
    }));
  };

  const items = useMemo(() => {
    return [
      {className: "assets", text: "assets"},
      {className: "layers", text: "layers"},
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
              {newLayerCount > 0 && <span className="layer-number">{newLayerCount}</span>}
            </li>
        ))}
      </ul>
    </>
  );
};
