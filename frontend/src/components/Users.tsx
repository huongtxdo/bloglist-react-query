import { useQuery } from '@tanstack/react-query';

import userService from '../services/users';
import { IUser } from '../types';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

const Users = () => {
  ///////////////////INITIAL DATA LOADING////////////////////

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  });

  if (isLoading) return <div>Loading data ... </div>;

  const users = usersData;

  return (
    <div className="user-list">
      <h2>Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th className="text-center">Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a: IUser, b: IUser) => {
              if (a.name! < b.name!) return -1;
              else if (a.name! > b.name!) return 1;
              return 0;
            })
            .map((user: IUser) => (
              <tr key={user.id}>
                <td>
                  <Link
                    to={`/users/${user.id}`}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="text-center">{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;

