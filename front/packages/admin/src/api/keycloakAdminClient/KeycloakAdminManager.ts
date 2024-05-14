import KcAdminClient from '@keycloak/keycloak-admin-client';
import axios from 'axios';
import Keycloak from 'keycloak-js';

export class KeycloakAdminManager {
    private _client: KcAdminClient;
    constructor(keycloak: Keycloak) {
        this._client = new KcAdminClient({
            baseUrl: import.meta.env.VITE_AUTH_URL,
            realmName: import.meta.env.VITE_AUTH_REALM,
        });

        this._client.registerTokenProvider({
            getAccessToken: ()=> Promise.resolve(keycloak.token)
        });

        this.init();
    }

    private async init() {
        
        this.client.groups.find()
        .then((groups) => {
            console.info(groups);
            
            return axios.all(groups.map(group=>this.client.groups.listMembers({id: group.id??''})));
        })
        .then((members) => {
            console.info(members);
        })
        .catch((error) => console.error(error));

        
    }

    get client() {
        return this._client;
    }
}