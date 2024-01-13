import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRef, FormEvent } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

import loginService from '../services/login';
import blogService from '../services/blogs';

import { IUser } from '../types';

import { useNotiDispatch } from '../contexts/NotiContext';
import { useLoginDispatch } from '../contexts/LoginContext';

const LoginForm = () => {
  const queryClient = useQueryClient();
  const notiDispatch = useNotiDispatch();
  const loginDispatch = useLoginDispatch();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  ///// MUTATION /////

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (loginUser: IUser) => {
      queryClient.setQueryData(['user'], loginUser);
      const user: IUser | undefined = queryClient.getQueryData(['user']);

      blogService.setToken(user!.token);

      loginDispatch({
        type: 'login',
        payload: user!,
      });
      notiDispatch({
        type: 'login',
        payload: `Login successful!`,
      });
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
    onError: (e: unknown) => {
      if (
        e instanceof AxiosError &&
        e.response?.data.error === 'invalidUsernameOrPassword'
      )
        notiDispatch({
          type: 'error',
          payload: `Login failed: Wrong username or password`,
        });
      setTimeout(() => {
        notiDispatch({ type: 'reset', payload: '' });
      }, 5000);
    },
  });

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();
    loginMutation.mutate({
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
            <h2>Login</h2>
          </div>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username: </Form.Label>
              <input
                className="form-control"
                id="username"
                ref={usernameRef}
                placeholder="Username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password: </Form.Label>
              <input
                className="form-control"
                id="password"
                type="password"
                ref={passwordRef}
                placeholder="Password"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;

