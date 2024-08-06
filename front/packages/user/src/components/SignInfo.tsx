import {useKeycloak} from "@react-keycloak/web";
import {useTranslation} from "react-i18next";

const SignInfo = () => {
    const { t } = useTranslation();
  const {keycloak} = useKeycloak();
  const logout = () => keycloak.logout({
    redirectUri: import.meta.env.VITE_BASE_URL
  });

  return (
    <>
      <a className="user-info">{keycloak.profile?.firstName} {t("nim")}</a>
      <button type="button" className="logout" onClick={logout}>{t("logout")}</button>
    </>
  )
}

export default SignInfo;