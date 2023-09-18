import axios from 'axios'

const baseUrl = '/api/blogs'

let token: string | null = null
const setToken = (newToken: string | null) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export interface IBlog {
  title: string
  author: string
  likes?: number
  url: string
  id?: number
  user?: IUser
}

export interface IUser {
  id?: number
  username: string
  passwordHash: string
  name: string
  blogs: IBlog
}

const create = async (newObject: IBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const deleteOne = async (id: number) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response
}

const deleteAll = async () => {
  const response = await axios.delete(baseUrl)
  return response
}

const update = async (id: number, blogObject: IBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogObject)
  return response.data
}

export default { setToken, getAll, create, deleteOne, deleteAll, update }

