import {NavLink} from "react-router-dom";
import {IUserInfo} from "@mnd/shared";
import SignInfo from "../components/nav/SignInfo";
import {useState} from "react";
import {useChangeUserProfileEvent} from "../hooks/UserInfo";
import {useTranslation} from "react-i18next";
import LanguageSelector from "@src/components/nav/LanguageSelector";

export function Nav() {
  const {t} = useTranslation();
  const [isAdmin, setIsAdmin] = useState(false);
  useChangeUserProfileEvent((contents: IUserInfo) => {
    setIsAdmin(contents.isAdmin ?? false);
  });

  const lang: any = {
    title: "title",
    subtitle: "subtitle",
    user: "user",
    data: "data",
    layer: "layer",
  };

  return (
    <nav>
      <NavLink to="dashboard">
        <h1>
          {t(lang.title)}
          <br/>
          {t(lang.subtitle)}
        </h1>
      </NavLink>
      {isAdmin && (
        <ul>
          <NavLink to="userset">
            {({isActive}: { isActive: boolean }) => (
              <li className={`user ${isActive ? "on" : ""}`}>{t(lang.user)}</li>
            )}
          </NavLink>
          <NavLink to="dataset">
            {({isActive}: { isActive: boolean }) => (
              <li className={`data ${isActive ? "on" : ""}`}>{t(lang.data)}</li>
            )}
          </NavLink>
          <NavLink to="layerset">
            {({isActive}: { isActive: boolean }) => (
              <li className={`layer ${isActive ? "on" : ""}`}>{t(lang.layer)}</li>
            )}
          </NavLink>
        </ul>
      )}
      <SignInfo/>
      <LanguageSelector/>
    </nav>
  );
}
