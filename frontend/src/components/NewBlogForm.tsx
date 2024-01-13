import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogs';
import { AxiosError } from 'axios';
import { useNotiDispatch } from '../contexts/NotiContext';

const baseUrl = '/blogs';

export const NewBlogForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notiDispatch = useNotiDispatch();

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(['blogs', newBlog.id], newBlog);
      queryClient.invalidateQueries(['blogs'], { exact: true });
      navigate(`${baseUrl}/${newBlog.id}`);
      notiDispatch({
        type: 'create',
        payload: `A new blog '${newBlog.title}' ${
          newBlog.author ? `by ${newBlog.author}` : ''
        } added!`,
      });
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === 'missingTitle'
      ) {
        notiDispatch({
          type: 'error',
          payload:
            'title is required and cannot contain only spaces or non-characters',
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === 'missingUrl'
      ) {
        notiDispatch({
          type: 'error',
          payload:
            'url is required and cannot contain only spaces or non-characters',
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === 'unauthorized'
      ) {
        notiDispatch({ type: 'error', payload: 'Unauthorized' });
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    createBlogMutation.mutate({
      title: titleRef.current!.value,
      author: authorRef.current!.value,
      url: urlRef.current!.value,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title </label>
          <input id="title" ref={titleRef} />
        </div>
        <div>
          <label htmlFor="author">Author </label>
          <input id="author" ref={authorRef} />
        </div>
        <div>
          <label htmlFor="url">Url </label>
          <input id="url" ref={urlRef} />
        </div>
        <button disabled={createBlogMutation.isLoading}>
          {createBlogMutation.isLoading ? 'Loading...' : 'Create'}
        </button>
      </form>
    </>
  );
};

