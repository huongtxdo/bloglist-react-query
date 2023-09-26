import { useQuery } from '@tanstack/react-query'

import userService from '../services/users'
import { IUser } from '../types'
import { Link } from 'react-router-dom'

const Users = () => {
  ///////////////////INITIAL DATA LOADING////////////////////

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  })

  if (isLoading) return <div>Loading data ... </div>

  const users = usersData

  return (
    <div className="user-list">
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users
            .sort((a: IUser, b: IUser) => {
              if (a.name! < b.name!) return -1
              else if (a.name! > b.name!) return 1
              return 0
            })
            .map((user: IUser) => (
              <tr key={user.id}>
                <td>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users

