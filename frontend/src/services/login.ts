import axios from 'axios'
import { ICredentials } from '../types'

const baseUrl = '/api/login'

const login = async (credentials: ICredentials) => {
  const response = await axios.post(baseUrl, credentials)

  return response.data
}

export default { login }
