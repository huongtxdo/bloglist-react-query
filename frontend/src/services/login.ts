import axios from 'axios'
const baseUrl = '/api/login'

export interface ICredentials {
  username: string | null
  password: string | null
}

const login = async (credentials: ICredentials) => {
  const response = await axios.post(baseUrl, credentials)

  return response.data
}

export default { login }

