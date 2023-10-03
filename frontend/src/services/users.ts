import axios from 'axios'
const baseUrl = '/api/users'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getOne = async (id: string) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

interface ICreatePara {
  username: string
  password: string
  name: string
}

const create = async (newUser: ICreatePara) => {
  const response = await axios.post(baseUrl, newUser)
  return response.data
}

export default { getAll, getOne, create }

