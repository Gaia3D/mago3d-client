import React, {createContext, useContext} from 'react';
import {useRecoilValueLoadable} from 'recoil';
import {UserInfo} from '@/api/user.ts';
import {currentUserProfileSelector} from '@/recoils/Auth.ts';
import {IUserInfo} from '@mnd/shared';

export type LoadableUserInfo = {
  state: 'hasValue' | 'loading' | 'hasError',
  userInfo: IUserInfo
}
const AuthContext = createContext<LoadableUserInfo>({} as LoadableUserInfo);

export const useUserInfoLoadable = () => useContext(AuthContext);

const UserInfoLoadableProvider = ({children}: { children: React.ReactNode }) => {
  const {state, contents} = useRecoilValueLoadable(currentUserProfileSelector);
  const userInfo = {
    state,
    userInfo: (state === 'hasValue' && contents !== null) ? new UserInfo(contents) : null
  } as LoadableUserInfo;

  return (
    <AuthContext.Provider value={userInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserInfoLoadableProvider;