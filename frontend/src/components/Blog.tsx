import {
  useQueryClient,
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query'

import blogService from '../services/blogs'
import { useNotiDispatch } from '../NotiContext'
import { IUser, IBlog } from '../types'

import { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

const Blog = ({ user }: { user: IUser }) => {
  const blogId = useParams().id
  const queryClient = useQueryClient()
  const notiDispatch = useNotiDispatch()

  ///////////////////INCREMENT LIKES////////////////////

  const likeMutation = useMutation(blogService.update, {
    onSuccess: (votedBlog: IBlog) => {
      const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs!.map((blog) => (blog.id === votedBlog.id ? votedBlog : blog))
      )

      notiDispatch({ type: 'like', payload: `Liked ${votedBlog.title}!` })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `missingUpdatedBlogObject`
      ) {
        notiDispatch({ type: 'error', payload: `Missing request.body` })
        setTimeout(() => {
          notiDispatch({ type: 'reset', payload: '' })
        }, 5000)
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `unableToLike`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Unable to like: Blog may not exist!`,
        })
        setTimeout(() => {
          notiDispatch({ type: 'reset', payload: '' })
        }, 5000)
      }
    },
  })

  const incrementLikes = (blogObject: IBlog) => {
    const likedBlog = {
      ...blogObject,
      likes: blogObject.likes! + 1,
    }
    likeMutation.mutate(likedBlog)
  }

  ///////////////////DELETE 1 BLOG////////////////////

  const deleteOneMutataion = useMutation(blogService.deleteOne, {
    onSuccess: (_data, variables: IBlog) => {
      const blogTitle: string = variables.title
      const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs!.filter((blog) => blog.id !== variables.id)
      )

      notiDispatch({ type: 'delete', payload: `Deleted ${blogTitle}!` })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNoToken`
      ) {
        notiDispatch({ type: 'error', payload: `Login to delete!` })
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNotOwner`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Blog can only be deleted by its owner!`,
        })
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `nonExistantBlog`
      ) {
        notiDispatch({
          type: 'error',
          payload: `Non-existing blog: It may have already been deleted!`,
        })
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
  })

  const deleteOne = (blog: IBlog) => {
    deleteOneMutataion.mutateAsync(blog)
  }

  ///////////////////ADD COMMENT////////////////////

  const commentMutation = useMutation(blogService.comment, {
    onSuccess: (commentedBlog: IBlog) => {
      const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs!.map((blog) =>
          blog.id === commentedBlog.id
            ? { ...blog, ['comments']: commentedBlog.comments }
            : blog
        )
      )
    },
  })

  const comment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]
    const comment = elementArray[0].value

    console.log('comment Blog.tsx', comment)
    console.log('blog', blog)

    await commentMutation.mutateAsync({ blog: blog, comment: comment })

    elementArray[0].value = ''
  }

  ///// LOADING DATA /////

  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll(),
  })

  if (isLoading) return <div>Loading...</div>

  const blogs = data

  if (!blogs) return null

  const blog = blogs.find((blog: IBlog) => blog.id === blogId)

  if (!blog) return <></>

  return (
    <div className="blog">
      <h3 style={{ paddingBottom: 15 }}>
        {blog.title} {blog.author}
      </h3>

      <div className="view-info">
        <a href={blog.url}>{blog.url}</a>
        <br />
        likes {blog.likes}
        <button id="like-button" onClick={() => incrementLikes(blog)}>
          like
        </button>
        <br />
        added by {blog.user?.name} <br />
        {blog.user?.id === user.id && (
          <button onClick={() => deleteOne(blog)}>remove</button>
        )}
      </div>

      <div style={{ paddingTop: 15 }}>
        <h5>comments</h5>
        <form onSubmit={comment}>
          <input type="text" />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment: string, index: number) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog

