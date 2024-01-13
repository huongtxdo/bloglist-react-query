import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import blogService from '../services/blogs';
import { useNotiDispatch } from '../contexts/NotiContext';
import { IUser, IBlog } from '../types';
import { FormEvent, useRef } from 'react';

import { Form } from 'react-bootstrap';

const Blog = ({ user }: { user: IUser }) => {
  const navigate = useNavigate();
  const blogId = useParams().id;
  const queryClient = useQueryClient();
  const notiDispatch = useNotiDispatch();

  const commentRef = useRef<HTMLInputElement>(null);

  ///////////////////INCREMENT LIKES////////////////////

  const likeMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (likedBlog: IBlog) => {
      queryClient.setQueryData(['blogs', blogId], likedBlog);
      queryClient.invalidateQueries(['blogs']);
      notiDispatch({ type: 'like', payload: `Liked ${likedBlog.title}!` });
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `missingUpdatedBlogObject`
      ) {
        notiDispatch({ type: 'error', payload: `Missing request.body` });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `unableToLike`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Unable to like: Blog may not exist!`,
        });
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const incrementLikes = (blogObject: IBlog) => {
    const likedBlog = {
      ...blogObject,
      likes: blogObject.likes! + 1,
    };
    likeMutation.mutate(likedBlog);
  };

  ///////////////////DELETE 1 BLOG////////////////////

  const deleteOneMutataion = useMutation({
    mutationFn: blogService.deleteOne,
    onSuccess: (_data, variables: IBlog) => {
      const blogTitle: string = variables.title;
      queryClient.invalidateQueries(['blogs'], { exact: true });

      notiDispatch({ type: 'delete', payload: `Deleted ${blogTitle}!` });
      navigate('/');
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNoToken`
      ) {
        notiDispatch({ type: 'error', payload: `Login to delete!` });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNotOwner`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Blog can only be deleted by its owner!`,
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `nonExistantBlog`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Non-existing blog: It may have already been deleted!`,
        });
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const deleteOne = (blog: IBlog) => {
    if (confirm(`Remove ${blog.title}?`)) {
      deleteOneMutataion.mutate(blog);
    }
  };

  ///////////////////ADD COMMENT////////////////////

  const commentMutation = useMutation({
    mutationFn: blogService.comment,
    onSuccess: (commentedBlog: IBlog) => {
      queryClient.setQueryData(['blogs', blogId], commentedBlog);
      queryClient.invalidateQueries(['blogs']);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `missingBlogId`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Unable to identify the id of commented blog`,
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `missingComment`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Cannot leave empty comments`,
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `nonExistentBlog`
      ) {
        notiDispatch({
          type: 'error',
          payload: `The blog non-existent/may be deleted elsewhere.`,
        });
      }

      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const comment = (event: FormEvent) => {
    event.preventDefault();
    commentMutation.mutate({ blog: blog, comment: commentRef.current!.value });
  };

  ///// LOADING DATA /////

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', blogId],
    queryFn: () => blogService.getOne(blogId!),
  });

  if (isLoading) return <div>Loading...</div>;

  const blog = data;

  if (!blog) return null;

  return (
    <div>
      <h3>
        {blog.title} <span className="tab-space"></span>
        {blog.author && (
          <span>
            by <b>{blog.author}</b>
          </span>
        )}
      </h3>

      <div className="view-info">
        <a href={blog.url}>{blog.url}</a>
        <br />
        <span className="text-muted">Likes: {blog.likes}</span>
        <button
          className="btn btn-outline-success btn-sm mx-1"
          onClick={() => incrementLikes(blog)}
        >
          Like
        </button>
        <br />
        <span className="text-muted">Added by: {blog.user?.name}</span>
        <br />
        {blog.user?.id === user.id && (
          <button
            className="btn btn-outline-danger btn-sm mt-1"
            onClick={() => deleteOne(blog)}
          >
            remove
          </button>
        )}
      </div>

      <div className="mt-4">
        <h5>Comments</h5>
        <Form onSubmit={comment}>
          <Form.Group className="mb-1">
            <input
              type="text"
              className="form-control"
              placeholder="Add a comment"
              ref={commentRef}
            />
          </Form.Group>
          <button type="submit" className="btn btn-outline-dark btn-sm mb-1">
            Add Comment
          </button>
        </Form>
        <ul className="list-group list-group-flush">
          {blog.comments
            .filter((comment: string) => comment && comment !== '')
            .map((comment: string, index: number) => (
              <li className="list-group-item" key={index}>
                {comment}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;

