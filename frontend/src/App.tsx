import React, { useState, useEffect } from 'react'
// import { useQuery } from '@tanstack/react-query'
import './index.css'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm.tsx'

import blogService, { IUser } from './services/blogs'
import loginService from './services/login'
import { useMessageDispatch } from './NotiContext.tsx'

const App = () => {
  const dispatch = useMessageDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<IUser | null>(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
      dispatch({ type: 'login', payload: `Login successful!` })
      setTimeout(() => {
        dispatch({ type: 'reset', payload: '' })
      }, 5000)
    } catch (exception) {
      dispatch({ type: 'error', payload: `Login failed!` })
      setTimeout(() => {
        dispatch({ type: 'reset', payload: '' })
      }, 5000)
    }
  }

  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBloglistUser')

      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
      dispatch({ type: 'login', payload: `Logout successful!` })
      setTimeout(() => {
        dispatch({ type: 'reset', payload: '' })
      }, 5000)
    } catch (exception) {
      dispatch({ type: 'login', payload: `Logout failed!` })
      setTimeout(() => {
        dispatch({ type: 'reset', payload: '' })
      }, 5000)
    }
  }

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

      {!user && (
        <LoginForm
          handleSubmit={handleLogin}
          username={username}
          handleUsername={({ target }) => setUsername(target.value)}
          password={password}
          handlePassword={({ target }) => setPassword(target.value)}
        />
      )}
      {user && (
        <div>
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
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

