import { Dispatch, useEffect } from 'react'
import { useReducer, createContext, useContext, PropsWithChildren } from 'react'

import { IUser } from './types'

const loginReducer = (
  state: IUser | null,
  action: { type: string; payload: IUser | null }
) => {
  switch (action.type) {
    case 'login':
      return action.payload
    case 'logout':
      return null
    default:
      return state
  }
}

const LoginContext = createContext<{
  loginData: IUser | null
  loginDataDispatch: Dispatch<{ type: string; payload: IUser | null }>
}>({
  loginData: null,
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

const localStorageLogger = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    return user
  }
  return null
}

export const LoginContextProvider = (props: PropsWithChildren) => {
  const [loginData, loginDataDispatch] = useReducer(
    loginReducer,
    null,
    localStorageLogger
  )

  useEffect(() => {
    window.localStorage.setItem('loggedBloglistUser', JSON.stringify(loginData))
  }, [loginData])

  return (
    <LoginContext.Provider value={{ loginData, loginDataDispatch }}>
      {props.children}
    </LoginContext.Provider>
  )
}

export default LoginContext

