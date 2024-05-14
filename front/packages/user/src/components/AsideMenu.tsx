import {mainMenuState} from "@/recoils/MainMenuState";
import React, {useMemo} from "react";
import {useRecoilState} from "recoil";
import {useUserInfoLoadable} from "@/components/providers/UserInfoLoadableProvider.tsx";
import SignInfo from "./SignInfo";

export const AsideMenu = () => {
  const [menu, setMenu] = useRecoilState(mainMenuState);
  const {userInfo} = useUserInfoLoadable();

  const handleMenuClick = (e: React.MouseEvent<HTMLLIElement>, menuName: string) => {
    e.preventDefault();
    setMenu((prev) => ({...prev, SelectedId: menuName}));
  };
  //console.info(userInfo);

  const items = useMemo(() => {
    const values = [
      {className: "layer", text: "레이어"},
      {className: "search", text: "검색"},
    ];

    return values;
  }, [userInfo]);

  return (
    <>
      <ul>
        {items.map((item) => (
          <li key={item.className} className={`${menu.SelectedId === item.className ? "on" : ""} ${item.className}`}
              onClick={(e) => handleMenuClick(e, item.className)}>
            <a href="#">{item.text}</a>
          </li>
        ))}
      </ul>
      <SignInfo />
    </>
  );
};
