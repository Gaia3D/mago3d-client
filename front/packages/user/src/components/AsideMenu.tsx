import {mainMenuState} from "@/recoils/MainMenuState";
import React, {useMemo} from "react";
import {useRecoilState} from "recoil";
import {useUserInfoLoadable} from "@/components/providers/UserInfoLoadableProvider.tsx";
import {useTranslation} from "react-i18next";

export const AsideMenu = () => {
  const {t} = useTranslation();
  const [menu, setMenu] = useRecoilState(mainMenuState);
  const {userInfo} = useUserInfoLoadable();

  const handleMenuClick = (e: React.MouseEvent<HTMLLIElement>, menuName: string) => {
    e.preventDefault();
    setMenu((prev) => ({...prev, SelectedId: menuName}));
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
          <li key={item.className} className={`menu ${menu.SelectedId === item.className ? "on" : ""} ${item.className}`}
              onClick={(e) => handleMenuClick(e, item.className)}>
            <span className={"text"}>
                {t(item.text)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};
