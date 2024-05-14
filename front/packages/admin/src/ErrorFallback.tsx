import {useNavigate, useRouteError} from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();
  const routeError = useRouteError();
  if (routeError) {
    return (
      <div>
        <h1>404</h1>
        <p>페이지를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const title = error.message;
  const buttonMessage = '새로고침';
  const content = JSON.stringify(error)


  // const { status } = error.response;
  // // const { title, content } = getErrorMessage();
  // const isNotAuthorized = status === 401 || status === 403;
  // const buttonMessage = isNotAuthorized ? '로그인' : '새로고침';

  const onClickHandler = () => {
    // if (isNotAuthorized) {
    //   navigate('/login');
    // } else {
      resetErrorBoundary();
    // }
  };

  return (
    <div className="error-fallback-wrapper">
      <div className="inner">
        <h2 className="title">{title}</h2>
        <p className="content">{content}</p>
        <button type="button" onClick={onClickHandler}>
          {buttonMessage}
        </button>
      </div>
    </div>
  );
}

// const getErrorMessage = () => {
//   switch (status) {
//     case 401:
//     case 402:
//       return {
//         title: '접근 권한이 없습니다.',
//         content: '로그인을 해주세요.',
//       };
//     case 409:
//     case 500:
//     default:
//       return {
//         title: '서비스에 접속할 수 없습니다.',
//         content: '새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.',
//       };
//   }
// };

export default ErrorFallback;