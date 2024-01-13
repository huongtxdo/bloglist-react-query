import { Dispatch, useEffect } from 'react';
import {
  useReducer,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react';

import { IUser } from '../types';
import blogService from '../services/blogs';

const loginReducer = (
  state: IUser | null,
  action: { type: string; payload: IUser | null }
) => {
  switch (action.type) {
    case 'login':
      return action.payload;
    case 'logout':
      return null;
    default:
      return state;
  }
};

interface LoginContext {
  loginData: IUser | null;
  loginDataDispatch: Dispatch<{ type: string; payload: IUser | null }>;
}

const LoginContext = createContext<LoginContext>({
  loginData: null,
  loginDataDispatch: () => null,
});

const getLocalStorageUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    if (user) blogService.setToken(user.token);
    return user;
  }
  return null;
};

export const LoginContextProvider = (props: PropsWithChildren) => {
  const [loginData, loginDataDispatch] = useReducer(
    loginReducer,
    null,
    getLocalStorageUser
  );

  useEffect(() => {
    window.localStorage.setItem(
      'loggedBloglistUser',
      JSON.stringify(loginData)
    );
  }, [loginData]);

  return (
    <LoginContext.Provider value={{ loginData, loginDataDispatch }}>
      {props.children}
    </LoginContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoginValue = () => {
  const valueAndDispatch = useContext(LoginContext);
  return valueAndDispatch.loginData;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLoginDispatch = () => {
  const valueAndDispatch = useContext(LoginContext);
  return valueAndDispatch.loginDataDispatch;
};

export default LoginContext;

