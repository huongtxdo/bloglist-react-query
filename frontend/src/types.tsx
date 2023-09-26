export interface IBlog {
  title: string
  author: string
  likes?: number
  url: string
  id?: string
  user?: IUser
  comments?: string[]
}

export interface IUser {
  id?: string
  username: string
  passwordHash: string
  name: string
  blogs: IBlog[]
  token: string
}

export interface ICredentials {
  username: string | null
  password: string | null
}
