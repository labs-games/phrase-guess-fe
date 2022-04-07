import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Layout } from 'antd';

import Auth from 'components/Auth';
import Navbar from 'components/Navbar';

import GamesPage from './GamesPage';
import WelcomePage from './WelcomePage';

const StyledHeader = styled(Layout.Header)`
  height: 48px;
  line-height: 48px;
`;

function HomePage() {
  return (
    <Auth>
      <Layout>
        <StyledHeader>
          <Navbar />
        </StyledHeader>
        <Layout>
          <Switch>
            <Route path="/games" component={GamesPage} />
            <Route path="" component={WelcomePage} />
            <Redirect to="" />
          </Switch>
        </Layout>
      </Layout>
    </Auth>
  );
}

export default HomePage;
