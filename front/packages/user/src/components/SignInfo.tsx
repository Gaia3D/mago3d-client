import {useKeycloak} from "@react-keycloak/web";
import {useTranslation} from "react-i18next";
import {useCallback, useMemo, useRef} from "react";

const SignInfo = () => {

    const { t } = useTranslation();
    const {keycloak} = useKeycloak();
    const popLayer = useRef<HTMLDivElement | null>(null);

    const togglePopLayer = () => {
        if (popLayer.current) {
            popLayer.current.classList.toggle('on');
        }
    };

    const toggleGraphic = () => {
        console.log("GRAPHIC");
    }

    const toggleDateTime = () => {
        console.log("DATE/TIME");
    }

    const logout = useCallback(() => {
        keycloak.logout({
            redirectUri: import.meta.env.VITE_BASE_URL
        });
    }, [keycloak]);

    const settingItems = useMemo(() => {
        return [
            {className: "graphic", text: "graphic", onClick: toggleGraphic},
            {className: "time", text: "time", onClick: toggleDateTime},
        ];
    }, []);

    const userItems = useMemo(() => {
        return [
            { className: "logout", text: "logout", onClick: logout }
        ]
    },[logout]);

  return (
    <>
      <button onClick={togglePopLayer} type="button" className="user-icon">{keycloak.profile?.firstName}</button>
      <div ref={popLayer} className={"pop-layer user"}>
          <ul>
              {settingItems.map((item) => {
                  return (
                      <li
                          key={item.className}
                          className={item.className}
                          onClick={item.onClick}
                      >
                          <span className={"text"}>{t(item.text)}</span>
                      </li>);
              })}
          </ul>
          <ul className={"user-wrapper"}>
              {userItems.map((item) => {
                  return (
                      <li
                          onClick={item.onClick}
                          key={item.className}
                          className={item.className}
                      >
                          <span className={"text"}>{t(item.text)}</span>
                      </li>);
              })}
          </ul>
      </div>
    </>
  )
}

export default SignInfo;