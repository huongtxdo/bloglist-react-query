import { Dispatch } from 'react'
import { useReducer, createContext, useContext, PropsWithChildren } from 'react'

import { ICredentials } from './services/login'

const loginReducer = (
  state: ICredentials,
  action: { type: string; payload: ICredentials }
) => {
  switch (action.type) {
    case 'login':
      return action.payload
    case 'logout':
      return action.payload
    case 'reset':
      return { username: '', password: '' }
    default:
      return state
  }
}

const LoginContext = createContext<{
  loginData: ICredentials
  loginDataDispatch: Dispatch<{ type: string | null; payload: ICredentials }>
}>({
  loginData: { username: null, password: null },
  loginDataDispatch: () => null,
})

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageValue = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch.loginData
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageDispatch = () => {
  const valueAndDispatch = useContext(LoginContext)
  return valueAndDispatch.loginDataDispatch
}

export const LoginContextProvider = (props: PropsWithChildren) => {
  const [loginData, loginDataDispatch] = useReducer(loginReducer, {
    username: '',
    password: '',
  })

  return (
    <LoginContext.Provider value={{ loginData, loginDataDispatch }}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext

