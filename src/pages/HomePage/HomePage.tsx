import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';

import Auth from 'components/Auth';

import GamesPage from './GamesPage';
import WelcomePage from './WelcomePage';

function HomePage() {
  return (
    <Auth>
      <Switch>
        <Route path="/games" component={GamesPage} />
        <Route path="" component={WelcomePage} />
        <Redirect to="" />
      </Switch>
    </Auth>
  );
}

export default HomePage;
