import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import loginService from '../services/login'
import blogService, {IUser} from '../services/blogs'

// import { useLoginDispatch, useLoginValue } from "../LoginContext"
import { useMessageDispatch } from '../NotiContext'

// interface ILoginForm {
//   handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
//   username: string
//   handleUsername: (target: React.ChangeEvent<HTMLInputElement>) => void
//   password: string
//   handlePassword: (target: React.ChangeEvent<HTMLInputElement>) => void
// }

const LoginForm = () => {
  const queryClient = useQueryClient()

  const notiDispatch = useMessageDispatch()
  // const loginValue = useLoginValue()
  // const loginDispatch = useLoginDispatch()

  ///// MUTATION /////

  const loginMutation = useMutation(loginService.login, {
    onSuccess: (loginUser: IUser) => {
      const user: IUser | undefined = queryClient.getQueryData(['user'])
      queryClient.setQueryData(['user'], loginUser)
      
      blogService.setToken(user!.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      notiDispatch({
        type: 'login',
        payload: `Login successful!`,
      })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (e instanceof AxiosError) notiDispatch({
        type: 'error',
        payload: `Login failed`,
      })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    }
  })

  ///// HANDLE LOGIN /////

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const username = elementArray[0].value
    const password = elementArray[1].value

    loginMutation.mutateAsync({username, password})

    const user = await loginService.login({username, password})
    blogService.setToken(user.token)
    window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
  }

  ///// RETURN /////
  return (
  <div>
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
        username
        <input id="username" placeholder='username' />
        password
        <input
          id="password"
          type="password"
          placeholder='password'
        />
      <button id="login-button" type="submit">
        login
      </button>
    </form>
  </div>
)}

export default LoginForm