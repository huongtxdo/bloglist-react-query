import React from 'react'
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import blogService from '../services/blogs'
import { IBlog } from '../types'
import { useNotiDispatch } from '../contexts/NotiContext'
import { AxiosError } from 'axios'

const NewBlogForm = () => {
  const queryClient = useQueryClient()
  const notiDispatch = useNotiDispatch()

  ///// MUTATION /////

  const { mutateAsync }: UseMutationResult<unknown, unknown, IBlog, unknown> =
    useMutation(blogService.create, {
      onSuccess: (newBlog: IBlog) => {
        const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(['blogs'], blogs!.concat(newBlog))
        notiDispatch({
          type: 'create',
          payload: `A new blog '${newBlog.title}' ${
            newBlog.author ? `by ${newBlog.author}` : ''
          } added!`,
        })
        setTimeout(() => {
          notiDispatch({ type: 'reset', payload: '' })
        }, 5000)
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
          })
        } else if (
          e instanceof AxiosError &&
          e.response?.data.error === 'missingUrl'
        ) {
          notiDispatch({
            type: 'error',
            payload:
              'url is required and cannot contain only spaces or non-characters',
          })
        } else if (
          e instanceof AxiosError &&
          e.response?.data.error === 'unauthorized'
        ) {
          notiDispatch({ type: 'error', payload: 'Unauthorized' })
        }
        setTimeout(() => {
          notiDispatch({ type: 'reset', payload: '' })
        }, 5000)
      },
    })

  const addNewBlog = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // THIS WORKS! But others recommend not to use. They didn't explain why!//
    // const title = (document.getElementById('title') as HTMLInputElement).value
    // const author = (document.getElementById('author') as HTMLInputElement).value
    // const url = (document.getElementById('url') as HTMLInputElement).value

    // THIS WORKS! Src: Medium
    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const title = elementArray[0].value
    const author = elementArray[1].value
    const url = elementArray[2].value

    mutateAsync({
      title,
      author,
      url,
    })

    elementArray[0].value = ''
    elementArray[1].value = ''
    elementArray[2].value = ''
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

