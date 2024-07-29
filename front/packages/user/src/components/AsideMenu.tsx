import {mainMenuState} from "@/recoils/MainMenuState";
import React, {useMemo} from "react";
import {useRecoilState} from "recoil";
import {useUserInfoLoadable} from "@/components/providers/UserInfoLoadableProvider.tsx";
import {useTranslation} from "react-i18next";
import SignInfo from "@/components/SignInfo.tsx";
import LanguageSelector from "@/components/LanguageSelector.tsx";

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
      {className: "layer", text: "layer"},
      {className: "search", text: "search"},
    ];
  }, [userInfo]);

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.className} className={`${menu.SelectedId === item.className ? "on" : ""} ${item.className}`}
              onClick={(e) => handleMenuClick(e, item.className)}>
            <a href="#">{t(item.text)}</a>
          </li>
        ))}
      </ul>
      <SignInfo />
      <LanguageSelector />
    </>
  );
};
