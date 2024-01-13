/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { IBlog } from '../types';
import Togglable from './Togglable';
import { NewBlogForm } from './NewBlogForm';
import blogService from '../services/blogs';

const Blogs = () => {
  ///// LOADING DATA /////

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;

  const blogs = blogsData;

  if (!blogs) return <></>;

  return (
    <>
      <Togglable buttonLabel="create new blog">
        <NewBlogForm />
      </Togglable>
      <div className="list-group">
        {blogs
          .sort((a: IBlog, b: IBlog) => b.likes! - a.likes!)
          .map((blog: IBlog) => (
            <Link
              to={`/blogs/${blog.id}`}
              key={blog.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <span>
                {blog.title} <span className="tab-space"></span>
                {blog.author && (
                  <span>
                    by <b>{blog.author}</b>
                  </span>
                )}
              </span>
              <span className="badge bg-primary rounded-pill">
                {blog.likes} Likes
              </span>
            </Link>
          ))}
      </div>
    </>
  );
};

export default Blogs;

