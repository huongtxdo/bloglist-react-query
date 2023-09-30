import { Container, Row, Col } from 'react-bootstrap'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Togglable from './Togglable'

const LoginAndRegister = () => {
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Togglable buttonLabel="Login here">
              <LoginForm />
            </Togglable>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Togglable buttonLabel="Register here">
              <RegisterForm />
            </Togglable>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default LoginAndRegister

