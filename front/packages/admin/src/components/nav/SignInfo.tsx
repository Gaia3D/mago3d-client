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
      <div style={{display:"flex"}}>
        <span className="user-info">{keycloak.profile?.firstName} {t("nim")}</span>
        <a href="#" className="logout" onClick={logout}></a>
      </div>
    </>
  )
}

export default SignInfo;