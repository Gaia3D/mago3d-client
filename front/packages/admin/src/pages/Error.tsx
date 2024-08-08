import {useNavigate, useRouteError} from "react-router-dom";
import {useTranslation} from "react-i18next";

const ErrorPage = () => {
  const { t } = useTranslation();
  const unknownError = useRouteError();
  const navigate = useNavigate();

  if ((unknownError as Error).name === 'NotAuthorizedError') {
    return (
      <div className="alert--popup-wrapper">
        <div className="alert--popup">
          <div className="alert--wrapper">
            <div className="alert--icon warning3"></div>
            <div className="message">{t("error.authority")}</div>
          </div>
          <div className="alert--popup--button">
            <button type="button" onClick={() => {
              window.location.replace(import.meta.env.VITE_API_URL + '/portal');
            }}>{t("portal-page")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="alert--popup-wrapper">
      <div className="alert--popup">
        <div className="alert--wrapper">
          <div className="alert--icon warning3"></div>
          <div className="message">{t("not-found.page")}</div>
        </div>
        <div className="alert--popup--button">
          <button type="button" onClick={() => {
            navigate(-1);
          }}>{t("prev-page")}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ErrorPage;