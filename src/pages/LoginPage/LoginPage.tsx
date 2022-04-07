import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Typography, Input, Button, message } from 'antd';

import { Paper, Centralized, BoldLabel } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { LoginResponse } from 'utils/apiResponseShapes';
import { setCookie } from 'utils/cookie';
import { ErrorCodes } from 'utils/enums';

const StyledInput = styled(Input)`
  margin: 10px 0;
  width: 300px;
`;

const StyledPasswordInput = styled(Input.Password)`
  margin: 10px 0 20px;
  width: 300px;
`;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { request, pending } = useRequest<LoginResponse>();
  const { success, error } = useToast({ actionName: 'Login' });
  const { handleError } = useFetchErrorHandler<LoginResponse>({
    specificHandlers: {
      [ErrorCodes.BadRequestError]: () => message.error('Wrong username and password combination'),
    },
    defaultHandler: () => error(),
  });
  const { push } = useHistory();
  const handleLogin = useEventCallback(async () => {
    try {
      const response = await request('/api/login/', 'post', { username, password });
      setCookie('jwt', response.sessionToken);
      success();
      push('/');
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Paper>
      <Centralized>
        <Typography.Title level={2}>Login</Typography.Title>
        <div>
          <div>
            <BoldLabel>Username</BoldLabel>
          </div>
          <StyledInput
            placeholder="Your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <div>
            <BoldLabel>Password</BoldLabel>
          </div>
          <StyledPasswordInput
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div>
            <Button
              type="primary"
              loading={pending}
              disabled={username === '' || password === ''}
              onClick={handleLogin}
            >
              Submit
            </Button>
          </div>
        </div>
      </Centralized>
    </Paper>
  );
}

export default LoginPage;
