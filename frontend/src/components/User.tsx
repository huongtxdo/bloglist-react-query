import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import userService from '../services/users'
import { IBlog, IUser } from '../types'

const User = () => {
  const id = useParams().id
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  })

  if (isLoading) return <div>Loading user data...</div>

  const users = data

  if (!users) return null
  const user = users.find((user: IUser) => user.id === id)
  if (!user) return null
  return (
    <>
      <div className="mt-4">
        <h3>{user.name}</h3>
      </div>

      <br />
      <h5>Added Blogs</h5>
      <ul className="list-group list-group-flush">
        {user.blogs.map((blog: IBlog) => (
          <li key={blog.id} className="list-group-item">
            {blog.title}
          </li>
        ))}
      </ul>
    </>
  )
}

export default User

