import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { useMutation } from '@tanstack/react-query'

import { useNotiDispatch } from '../NotiContext'

import userService from '../services/users'
import { AxiosError } from 'axios'

const RegisterForm = () => {
  const notiDispatch = useNotiDispatch()

  ///// MUTATION /////

  const registerMutation = useMutation(userService.create, {
    onSuccess: () => {
      notiDispatch({
        type: 'register',
        payload: `Register successful!`,
      })
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === 'passwordMinLength3'
      ) {
        notiDispatch({
          type: 'error',
          payload: `Register failed: Password must be at least 3 characters`,
        })
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' })
      }, 5000)
    },
  })

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const formElements = target.elements
    const elementArray = [...formElements] as HTMLInputElement[]

    const name = elementArray[0].value
    const username = elementArray[1].value
    const password = elementArray[2].value

    registerMutation.mutateAsync({ name, username, password })
  }

  ///// RETURN /////

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center">
            <h2>Register</h2>
          </div>
          <Form onSubmit={handleRegister}>
            <Form.Group>
              <Form.Label>Name: </Form.Label>
              <input
                id="registerName"
                className="form-control"
                placeholder="name"
              />
              <Form.Label>Username: </Form.Label>
              <input
                id="registerUsername"
                className="form-control"
                placeholder="username"
              />
              <Form.Label>Password: </Form.Label>
              <input
                id="registerPassword"
                type="password"
                className="form-control"
                placeholder="password"
              />
              <br />
              <Button variant="primary" type="submit" className="btn-block">
                Register
              </Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterForm

