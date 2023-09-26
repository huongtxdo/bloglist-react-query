import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import loginService from '../services/login'
import blogService from '../services/blogs'
import { ICredentials, IUser } from '../types'

import { useNotiDispatch } from '../NotiContext'
import { useLoginDispatch } from '../LoginContext'

const LoginForm = () => {
  const queryClient = useQueryClient()

  const notiDispatch = useNotiDispatch()
  const loginDispatch = useLoginDispatch()

  ///// MUTATION /////

  const loginMutation: UseMutationResult<
    unknown,
    unknown,
    ICredentials,
    unknown
  > = useMutation(loginService.login, {
    onSuccess: (loginUser: IUser) => {
      queryClient.setQueryData(['user'], loginUser)
      const user: IUser | undefined = queryClient.getQueryData(['user'])

      blogService.setToken(user!.token)
      // window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      loginDispatch({
        type: 'login',
        payload: user!,
      })
      notiDispatch({
        type: 'login',
        payload: `Login successful!`,
      })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (e instanceof AxiosError)
        notiDispatch({
          type: 'error',
          payload: `Login failed`,
        })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
  })

  ///// HANDLE LOGIN /////

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const username = elementArray[0].value
    const password = elementArray[1].value

    loginMutation.mutateAsync({ username, password })
  }

  ///// RETURN /////
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        username
        <input id="username" placeholder="username" />
        <br />
        password
        <input id="password" type="password" placeholder="password" />
        <br />
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm

