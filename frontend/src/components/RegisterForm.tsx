import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useMutation } from '@tanstack/react-query';

import { useNotiDispatch } from '../contexts/NotiContext';

import userService from '../services/users';
import { AxiosError } from 'axios';
import { useRef } from 'react';

const RegisterForm = () => {
  const notiDispatch = useNotiDispatch();

  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  ///// MUTATION /////

  const registerMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      notiDispatch({
        type: 'register',
        payload: `Register successful!`,
      });
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === 'passwordMinLength3'
      ) {
        notiDispatch({
          type: 'error',
          payload: `Register failed: Password must be at least 3 characters`,
        });
      } else if (
        e instanceof AxiosError &&
        e.response?.data.error === 'existingUsername'
      ) {
        notiDispatch({
          type: 'error',
          payload: `Register failed: This username is not available`,
        });
      }
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    registerMutation.mutateAsync({
      name: nameRef.current!.value,
      username: usernameRef.current!.value,
      password: passwordRef.current!.value,
    });
  };

  ///// RETURN /////

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <div className="text-center">
            <h2>Register</h2>
          </div>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Name: </Form.Label>
              <input
                id="registerName"
                className="form-control"
                placeholder="Name"
                ref={nameRef}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username: </Form.Label>
              <input
                id="registerUsername"
                className="form-control"
                placeholder="Username"
                ref={usernameRef}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password: </Form.Label>
              <input
                id="registerPassword"
                type="password"
                className="form-control"
                placeholder="password"
                ref={passwordRef}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="btn-block mb-3">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;

