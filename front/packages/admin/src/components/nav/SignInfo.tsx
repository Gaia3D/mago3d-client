import {useKeycloak} from "@react-keycloak/web";

const SignInfo = () => {
  const {keycloak} = useKeycloak();
  const logout = () => keycloak.logout({
    redirectUri: import.meta.env.VITE_BASE_URL
  });

  return (
    <>
      <div style={{display:"flex"}}>
        <span className="user-info">{keycloak.profile?.firstName} 님</span>
        <a href="#" className="logout" onClick={logout}></a>
      </div>
    </>
  )
}

export default SignInfo;