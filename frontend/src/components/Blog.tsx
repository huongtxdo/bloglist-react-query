import { useState } from 'react'
import {
  useQueryClient,
  useMutation,
  UseMutationResult,
} from '@tanstack/react-query'

import blogService, { IUser, IBlog } from '../services/blogs'
import { useMessageDispatch } from '../NotiContext'
import { AxiosError } from 'axios'

const Blog = ({ user, blog }: { user: IUser; blog: IBlog }) => {
  const [visible, setVisible] = useState(false)
  const queryClient = useQueryClient()
  const dispatch = useMessageDispatch()

  ///// VISIBILITY AND STYLE /////

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  ///////////////////INCREMENT LIKES////////////////////

  const likeMutation: UseMutationResult<unknown, unknown, IBlog, unknown> =
    useMutation(blogService.update, {
      onSuccess: (votedBlog: IBlog) => {
        // console.log('votedBlog', votedBlog)
        const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
        queryClient.setQueryData(
          ['blogs'],
          blogs!.map((blog) => (blog.id === votedBlog.id ? votedBlog : blog))
        )

        dispatch({ type: 'like', payload: `Liked ${votedBlog.title}!` })
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      },
      onError: (e: unknown) => {
        if (
          e instanceof AxiosError &&
          e.response?.data.error === `missingUpdatedBlogObject`
        ) {
          dispatch({ type: 'error', payload: `Missing request.body` })
          setTimeout(() => {
            dispatch({ type: 'reset', payload: '' })
          }, 5000)
        } else if (
          e instanceof AxiosError &&
          e.response?.data.error === `unableToLike`
        ) {
          dispatch({
            type: 'error',
            payload: `Unable to like: Blog may not exist!`,
          })
          setTimeout(() => {
            dispatch({ type: 'reset', payload: '' })
          }, 5000)
        }
      },
    })

  const incrementLikes = (blogObject: IBlog) => {
    const likedBlog = {
      ...blogObject,
      likes: blogObject.likes! + 1,
    }
    likeMutation.mutateAsync(likedBlog)
  }

  ///////////////////DELETE 1 BLOG////////////////////

  const deleteOneMutataion: UseMutationResult<
    unknown,
    unknown,
    IBlog,
    unknown
  > = useMutation(blogService.deleteOne, {
    onSuccess: (data, variables: IBlog) => {
      console.log('data', data)
      const blogTitle: string = variables.title
      const blogs: IBlog[] | undefined = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs!.filter((blog) => blog.id !== variables.id)
      )

      dispatch({ type: 'delete', payload: `Deleted ${blogTitle}!` })
      setTimeout(() => {
        dispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNoToken`
      ) {
        dispatch({ type: 'error', payload: `Login to delete!` })
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `unauthorizedNotOwner`
      ) {
        dispatch({
          type: 'error',
          payload: `Blog can only be deleted by its owner!`,
        })
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === `nonExistantBlog`
      ) {
        dispatch({
          type: 'error',
          payload: `Non-existing blog: It may have already been deleted!`,
        })
        setTimeout(() => {
          dispatch({ type: 'reset', payload: '' })
        }, 5000)
      }
    },
  })

  const deleteOne = (blog: IBlog) => {
    deleteOneMutataion.mutateAsync(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      {visible && (
        <div className="view-info">
          {blog.url} <br />
          likes {blog.likes}
          <button id="like-button" onClick={() => incrementLikes(blog)}>
            like
          </button>
          <br />
          {blog.user?.name} <br />
          {blog.user?.id === user.id && (
            <button onClick={() => deleteOne(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

// Blog.propTypes = {
//   user: PropTypes.object.isRequired,
//   blog: PropTypes.object.isRequired,
//   incrementLikes: PropTypes.func.isRequired,
//   deleteThisBlog: PropTypes.func.isRequired,
// }

export default Blog

