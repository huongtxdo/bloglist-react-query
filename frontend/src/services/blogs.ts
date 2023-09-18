import axios from 'axios'
const baseUrl = '/api/blogs'

let token: string | null = null
const setToken = (newToken: string | null) => {
  token = `Bearer ${newToken}`
}

// const getAll = () => axios.get(baseUrl).then((res) => res.data)

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export interface IBlog {
  title: string
  author: string
  likes?: number
  url: string
  id?: string
  user?: IUser
}

export interface IUser {
  id?: string
  username: string
  passwordHash: string
  name: string
  blogs: IBlog
}

const create = async (newObject: IBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  // console.log('newObject', newObject)
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const deleteOne = async (blogObject: IBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const blogId = blogObject.id as string
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response
}

const deleteAll = async () => {
  const response = await axios.delete(baseUrl)
  return response
}

const update = async (blogObject: IBlog) => {
  const blogId = blogObject.id as string
  const response = await axios.put(`${baseUrl}/${blogId}`, blogObject)
  return response.data
}

export default { setToken, getAll, create, deleteOne, deleteAll, update }

