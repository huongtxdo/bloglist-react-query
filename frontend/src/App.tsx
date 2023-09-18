import { useState, useEffect } from 'react'
// import { useQuery } from '@tanstack/react-query'
import './index.css'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm.tsx'

import blogService from './services/blogs'
// import loginService from './services/login'

// import { useMessageDispatch } from './NotiContext.tsx'
import { useLoginValue } from './LoginContext.tsx'

const App = () => {
  // const notiDispatch = useMessageDispatch()
  // const loginDispatch = useLoginDispatch()
  const loginValue = useLoginValue()

  // const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()

  //   try {
  //     const user = await loginService.login(loginValue)
  //     blogService.setToken(user.token)
  //     window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

  //     setUser(user)
  //     setUsername('')
  //     setPassword('')
  //     notiDispatch({ type: 'login', payload: `Login successful!` })
  //     setTimeout(() => {
  //       notiDispatch({ type: 'reset', payload: '' })
  //     }, 5000)
  //   } catch (exception) {
  //     notiDispatch({ type: 'error', payload: `Login failed!` })
  //     setTimeout(() => {
  //       notiDispatch({ type: 'reset', payload: '' })
  //     }, 5000)
  //   }
  // }

  // const handleLogout = async () => {
  //   try {
  //     window.localStorage.removeItem('loggedBloglistUser')

  //     blogService.setToken(null)
  //     setUser(null)
  //     setUsername('')
  //     setPassword('')
  //     notiDispatch({ type: 'login', payload: `Logout successful!` })
  //     setTimeout(() => {
  //       notiDispatch({ type: 'reset', payload: '' })
  //     }, 5000)
  //   } catch (exception) {
  //     notiDispatch({ type: 'login', payload: `Logout failed!` })
  //     setTimeout(() => {
  //       notiDispatch({ type: 'reset', payload: '' })
  //     }, 5000)
  //   }
  // }

  // *** FOR TESTING ONLY!!  DELETE EVERYTHING
  /*
  const DeleteAllBlogs = () => {
    const deleteAllBlogs = async (event) => {
      const response = await blogService.deleteAll()
      if (response.status === 204) setBlogs([])
    }
    return <button onClick={deleteAllBlogs}>delete all blogs</button>
  }
  */

  // ///////////////////INITIAL DATA LOADING////////////////////

  // const result = useQuery({
  //   queryKey: ['blogs'],
  //   queryFn: () => blogService.getAll(),
  //   refetchOnWindowFocus: false,
  // })

  // if (result.isLoading) {
  //   return <div>loading data...</div>
  // }

  // const blogs = result.data

  return (
    <div>
      <Notification />

      {!loginValue && <LoginForm />}
      {loginValue && (
        <div>
          <h2>blogs</h2>
          <p>
            {loginValue.name} logged in
            {/* <button onClick={handleLogout}>logout</button> */}
          </p>
          <Togglable buttonLabel="create new blog">
            <NewBlogForm />
          </Togglable>
          <Blogs />
          {/* <DeleteAllBlogs /> */}
        </div>
      )}
    </div>
  )
}

export default App

