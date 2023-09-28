import {
  UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

import loginService from '../services/login'
import blogService from '../services/blogs'
import { ICredentials, IUser } from '../types'

import { useNotiDispatch } from '../NotiContext'
import { useLoginDispatch } from '../LoginContext'

const LoginForm = () => {
  const queryClient = useQueryClient()

  const notiDispatch = useNotiDispatch()
  const loginDispatch = useLoginDispatch()

  ///// MUTATION /////

  const loginMutation: UseMutationResult<
    unknown,
    unknown,
    ICredentials,
    unknown
  > = useMutation(loginService.login, {
    onSuccess: (loginUser: IUser) => {
      queryClient.setQueryData(['user'], loginUser)
      const user: IUser | undefined = queryClient.getQueryData(['user'])

      blogService.setToken(user!.token)
      // window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      loginDispatch({
        type: 'login',
        payload: user!,
      })
      notiDispatch({
        type: 'login',
        payload: `Login successful!`,
      })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (e instanceof AxiosError)
        notiDispatch({
          type: 'error',
          payload: `Login failed`,
        })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
  })

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const username = elementArray[0].value
    const password = elementArray[1].value

    loginMutation.mutateAsync({ username, password })
  }

  ///// RETURN /////
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center">
            <h2>Login</h2>
          </div>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>username: </Form.Label>
              <input
                id="username"
                className="form-control"
                placeholder="username"
              />
              <br />
              <Form.Label>password: </Form.Label>
              <input
                id="password"
                className="form-control"
                type="password"
                placeholder="password"
              />
              <br />
              <Button variant="primary" type="submit" className="btn-block">
                login
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginForm

