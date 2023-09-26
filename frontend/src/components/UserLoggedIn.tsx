import { useLoginDispatch } from '../LoginContext.tsx'
import { useNotiDispatch } from '../NotiContext.tsx'

import blogService from '../services/blogs.ts'
import { IUser } from '../types.tsx'

const UserLoggedIn = ({ user }: { user: IUser | null }) => {
  const loginDispatch = useLoginDispatch()
  const notiDispatch = useNotiDispatch()
  const handleLogout = async () => {
    try {
      window.localStorage.removeItem('loggedBloglistUser')
      loginDispatch({ type: 'logout', payload: null })

      blogService.setToken(null)
      notiDispatch({ type: 'login', payload: `Logout successful!` })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    } catch (exception) {
      notiDispatch({ type: 'login', payload: `Logout failed!` })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    }
  }
  return (
    <div>
      {user!.name} logged in
      <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default UserLoggedIn

