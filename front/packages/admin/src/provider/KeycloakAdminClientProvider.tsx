import KcAdminClient from '@keycloak/keycloak-admin-client';
import React, { Suspense, createContext, useContext } from 'react';
import keycloak from '../api/Keycloak';



const KeycloakAdminClientContext = createContext<KcAdminClient>({} as KcAdminClient);

// eslint-disable-next-line react-refresh/only-export-components
export const useKcAdminClient = () => useContext(KeycloakAdminClientContext);

const KeycloakAdminClientProvider = ({ children }: {children:React.ReactNode}) => {
    //const [kcacAuth, setKcacAuth] = useState(false);

    let baseUrl = `${import.meta.env.VITE_AUTH_URL}`;
    if (import.meta.env.MODE !== 'development') {
        const { protocol, hostname, port } = window.location;
        // 포트가 있는 경우 콜론과 함께 포트 번호를 추가
        const portPart = port ? `:${port}` : '';
        // 전체 URL 구성
        baseUrl = `${protocol}//${hostname}${portPart}${import.meta.env.VITE_AUTH_URL}`;
    }

    const kcAdminClient = new KcAdminClient({
        baseUrl,
        realmName: import.meta.env.VITE_AUTH_REALM,
    });

    kcAdminClient.registerTokenProvider({
        getAccessToken: ()=> Promise.resolve(keycloak.token)
    });

    /* useChageUserProfile((contents:IUserInfo) => {
        if(!contents.isAdmin) return;

        kcAdminClient.auth({
            username: decrypt(import.meta.env.VITE_ADMIN_ID),
            password: decrypt(import.meta.env.VITE_ADMIN_PASSWORD),
            grantType: 'password',
            clientId: 'admin-cli',
            //clientSecret: String('udYeImC6NHh6ocZZBfASjrdeNkFFnVAd'),
            //scopes: ['openid']
        })
        .then(()=>console.info('auth success'))
        .catch((err)=>console.error(err));
    }); */
 
    return (
        <Suspense>
            <KeycloakAdminClientContext.Provider value={kcAdminClient}>
                {children}
            </KeycloakAdminClientContext.Provider>
        </Suspense>
    );
};

export default KeycloakAdminClientProvider;