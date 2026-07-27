import KcAdminClient from '@keycloak/keycloak-admin-client';
import React, { Suspense, createContext, useContext } from 'react';
import keycloak from '../api/Keycloak';



const KeycloakAdminClientContext = createContext<KcAdminClient>({} as KcAdminClient);

// eslint-disable-next-line react-refresh/only-export-components
export const useKcAdminClient = () => useContext(KeycloakAdminClientContext);

const KeycloakAdminClientProvider = ({ children }: {children:React.ReactNode}) => {
    // VITE_AUTH_URL이 절대 URL이면 그대로, 상대 경로이면 현재 origin 기준으로 resolve
    const baseUrl = new URL(import.meta.env.VITE_AUTH_URL, window.location.origin).href;

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