import { Dispatch } from 'react'
import { useReducer, createContext, useContext, PropsWithChildren } from 'react'

import { IUser } from './services/blogs';

const loginReducer = (
  state: IUser | undefined,
  action: { type: string; payload: IUser }
) => {
  switch (action.type) {
    case 'login':
      return action.payload
    case 'logout':
      return action.payload
    case 'reset':
      return undefined
    default:
      return state
  }
}

const LoginContext = createContext<{
  loginData: IUser | undefined
  loginDataDispatch: Dispatch<{ type: string; payload: IUser }>
}>({
  loginData: undefined,
  loginDataDispatch: () => null,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useLoginValue = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch.loginData
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLoginDispatch = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch.loginDataDispatch
}

export const LoginContextProvider = (props: PropsWithChildren) => {
  const [loginData, loginDataDispatch] = useReducer(loginReducer, undefined)

  return (
    <LoginContext.Provider value={{ loginData, loginDataDispatch }}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext

