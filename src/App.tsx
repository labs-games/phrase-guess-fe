import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={HomePage} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
