export type AuthClientEvent = 'onReady' | 'onInitError' | 'onAuthSuccess' | 'onAuthError' | 'onAuthRefreshSuccess' | 'onAuthRefreshError' | 'onAuthLogout' | 'onTokenExpired';

export interface AuthClientError {
  error: string;
  error_description: string;
}

export type AuthClientTokens = {
    idToken?: string | undefined;
    refreshToken?: string | undefined;
    token?: string | undefined;
}