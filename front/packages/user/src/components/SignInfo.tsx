import {useKeycloak} from "@react-keycloak/web";

const SignInfo = () => {
  const {keycloak} = useKeycloak();
  const logout = () => keycloak.logout({
    redirectUri: import.meta.env.VITE_BASE_URL
  });

  return (
    <>
      <a className="user-info">{keycloak.profile?.firstName} 님</a>
      <button type="button" className="logout" onClick={logout}>로그아웃</button>
    </>
  )
}

export default SignInfo;