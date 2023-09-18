import React from 'react'
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import blogService, { IBlog } from '../services/blogs'
import { useMessageDispatch } from '../NotiContext'
import { AxiosError } from 'axios'

const NewBlogForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  ///// MUTATION /////

  const newBlogMutation: UseMutationResult<unknown, unknown, IBlog, unknown> =
    useMutation(blogService.create, {
      onSuccess: (newBlog: IBlog) => {
        const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'], blogs!.concat(newBlog))
        dispatch({
          type: 'create',
          payload: `A new blog '${newBlog.title}' ${
            newBlog.author ? `by ${newBlog.author}` : ''
          } added!`,
        })
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      },
      onError: (e: unknown) => {
        if (
          e instanceof AxiosError &&
          e.response?.data.error === 'missingTitleOrUrl'
        ) {
          dispatch({ type: 'error', payload: 'title and url required' })
        } else if (
          e instanceof AxiosError &&
          e.response?.data.error === 'unauthorized'
        ) {
          dispatch({ type: 'error', payload: 'Unauthorized' })
        }
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      },
    })

  const addNewBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // THIS WORKS! But others recommend not to use. They didn't explain why!//
    // const title = (document.getElementById('title') as HTMLInputElement).value
    // const author = (document.getElementById('author') as HTMLInputElement).value
    // const url = (document.getElementById('url') as HTMLInputElement).value

    // THIS WORKS! Cre: Akiyo Marukawa from Medium
    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const title = elementArray[0].value
    const author = elementArray[1].value
    const url = elementArray[2].value

    // THIS ALSO WORKS! But title, author and url get red underscores
    // const title = event.target.title.value
    // const author = event.target.author.value
    // const url = event.target.url.value
    newBlogMutation.mutateAsync({
      title,
      author,
      url,
    })
  }

  return (
    <form onSubmit={addNewBlog}>
      title:
      <input id="title" placeholder="add title" />
      <br />
      author:
      <input id="author" placeholder="add author" />
      <br />
      url:
      <input id="url" placeholder="add url" />
      <br />
      <button id="create-blog-button" type="submit">
        create
      </button>
    </form>
  )
}
export default NewBlogForm

