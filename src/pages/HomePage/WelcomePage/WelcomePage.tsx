import React from 'react';

import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Typography } from 'antd';

import { useAuthContext } from 'components/Auth';
import { Paper } from 'components/common';

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

function WelcomePage() {
  const { user } = useAuthContext();
  const { push } = useHistory();

  return (
    <Paper>
      <Typography.Title level={2}>Hi {user.username},</Typography.Title>
      <Typography.Title level={4}>Welcome to Phrase-Guess App</Typography.Title>
      <StyledButton type="primary" onClick={() => push('/games')}>
        Get Started
      </StyledButton>
    </Paper>
  );
}

export default WelcomePage;
