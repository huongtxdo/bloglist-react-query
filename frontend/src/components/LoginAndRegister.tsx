import { Container, Row, Col } from 'react-bootstrap'

import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Togglable from './Togglable'

const LoginAndRegister = () => {
  const titleStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '36px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
  }
  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <div className="mb-4 mt-4">
              <h2 style={titleStyle}>Blog App</h2>
            </div>
          </Col>
        </Row>
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

