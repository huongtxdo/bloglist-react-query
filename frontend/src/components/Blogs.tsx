/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { IBlog } from '../types'
import Togglable from './Togglable'
import NewBlogForm from './NewBlogForm'
import blogService from '../services/blogs'

const Blogs = () => {
  const style = {
    border: 1,
    borderStyle: 'solid',
    paddingTop: 5,
    margin: 5,
  }

  ///// LOADING DATA /////

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  if (isLoading) return <div>Loading...</div>

  const blogs = blogsData

  if (!blogs) return <></>

  return (
    <div>
      <Togglable buttonLabel="create new blog">
        <NewBlogForm />
      </Togglable>
      {blogs
        .sort((a: IBlog, b: IBlog) => b.likes! - a.likes!)
        .map((blog: IBlog) => (
          <div style={style} key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} {blog.author}
            </Link>
          </div>
        ))}
    </div>
  )
}

export default Blogs

