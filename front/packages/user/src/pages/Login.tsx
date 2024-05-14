import { useKeycloak } from "@react-keycloak/web";

const Login = () => {
    const {keycloak} = useKeycloak();
    keycloak.login();

    return (
        <>로그인</>
    )
}

export default Login;