import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Layout } from 'antd';

import GameSidebar from './GameSidebar';
import InfoPage from './InfoPage';
import LeaderboardPage from './LeaderboardPage';
import PhrasesPage from './PhrasesPage';
import RoundsPage from './RoundsPage';
import TeamsPage from './TeamsPage';

const GameSider = styled(Layout.Sider)`
  min-height: 100%;
  position: fixed;
  background-color: white;
`;

const GameContent = styled(Layout.Content)`
  margin-left: 200px;
  min-height: 100%;
`;

function GamePage() {
  return (
    <>
      <GameSider>
        <GameSidebar />
      </GameSider>
      <GameContent>
        <Switch>
          <Route path="/games/:gameId/leaderboard" component={LeaderboardPage} />
          <Route path="/games/:gameId/info" component={InfoPage} />
          <Route path="/games/:gameId/teams" component={TeamsPage} />
          <Route path="/games/:gameId/phrases" component={PhrasesPage} />
          <Route path="/games/:gameId/rounds" component={RoundsPage} />
          <Redirect to="/games/:gameId/info" />
        </Switch>
      </GameContent>
    </>
  );
}

export default GamePage;
