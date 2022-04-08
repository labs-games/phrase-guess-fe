import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Layout } from 'antd';

import Auth from 'components/Auth';
import Navbar from 'components/Navbar';

import GamePage from './GamePage';
import GamesPage from './GamesPage';
import WelcomePage from './WelcomePage';

const StyledHeader = styled(Layout.Header)`
  height: 48px;
  line-height: 48px;
  position: fixed;
  width: 100vw;
  z-index: 100;
`;

const StyledBody = styled(Layout)`
  min-height: 100vh;
`;

const StyledPage = styled(Layout)`
  min-height: 100%;
  margin-top: 48px;
`;

function HomePage() {
  return (
    <Auth>
      <StyledBody>
        <StyledHeader>
          <Navbar />
        </StyledHeader>
        <StyledPage>
          <Switch>
            <Route path="/games/:gameId" component={GamePage} />
            <Route path="/games" component={GamesPage} />
            <Route path="" component={WelcomePage} />
            <Redirect to="" />
          </Switch>
        </StyledPage>
      </StyledBody>
    </Auth>
  );
}

export default HomePage;
