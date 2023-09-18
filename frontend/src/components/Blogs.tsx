/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query'

import Blog from './Blog'
import blogService, { IBlog } from '../services/blogs'
import loginService from '../services/login'

const Blogs = () => {
  ///////////////////INITIAL DATA LOADING////////////////////

  const queryMultiple = () => {
    const userRes = useQuery(['user'], () =>
      loginService.login({ username: '', password: '' })
    )
    const blogRes = useQuery(['blogs'], () => blogService.getAll())

    return [userRes, blogRes]
  }

  const [userLoading, blogsLoading] = queryMultiple()

  if (userLoading.isLoading) return <div>logging in ...</div>
  if (blogsLoading.isLoading) return <div>loading data ...</div>

  const [user, blogs] = [userLoading.data, blogsLoading.data]

  return (
    <div className="blog-list">
      {blogs
        .sort((a: IBlog, b: IBlog) => b.likes! - a.likes!)
        .map((blog: IBlog) => (
          <Blog key={blog.id} user={user} blog={blog} />
        ))}
    </div>
  )
}

export default Blogs

