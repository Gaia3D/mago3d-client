import {useNavigate, useRouteError} from "react-router-dom";

const ErrorPage = () => {

  const unknownError = useRouteError();
  const navigate = useNavigate();

  if ((unknownError as Error).name === 'NotAuthorizedError') {
    return (
      <div className="alert--popup-wrapper">
        <div className="alert--popup">
          <div className="alert--wrapper">
            <div className="alert--icon warning3"></div>
            <div className="message">권한이 없습니다.</div>
          </div>
          <div className="alert--popup--button">
            <button type="button" onClick={() => {
              window.location.replace(import.meta.env.VITE_API_URL + '/portal');
            }}>포탈 페이지로 가기
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
          <div className="message">페이지를 찾을 수 없습니다.</div>
        </div>
        <div className="alert--popup--button">
          <button type="button" onClick={() => {
            navigate(-1);
          }}>이전 페이지로 가기
          </button>
        </div>
      </div>
    </div>
  );
}
export default ErrorPage;