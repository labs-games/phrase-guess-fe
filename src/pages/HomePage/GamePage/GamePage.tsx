import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { Layout } from 'antd';

import Background from 'images/Background.jpg';

import GameSidebar from './GameSidebar';
import GuessPage from './GuessPage';
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

const BackgroundImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${Background});
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position-y: top;
  background-position-x: 150px;
  background-size: cover;
`;

const BackgroundColor = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(240, 242, 245, 0.3);
`;

const BackgroundPaper = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(240, 242, 245, 0.9);
`;

function GamePage() {
  return (
    <>
      <GameSider>
        <GameSidebar />
      </GameSider>
      <GameContent>
        <BackgroundImage>
          <BackgroundColor>
            <BackgroundPaper>
              <Switch>
                <Route path="/games/:gameId/leaderboard" component={LeaderboardPage} />
                <Route path="/games/:gameId/info" component={InfoPage} />
                <Route path="/games/:gameId/teams" component={TeamsPage} />
                <Route path="/games/:gameId/phrases" component={PhrasesPage} />
                <Route path="/games/:gameId/rounds/:roundId/guess" component={GuessPage} />
                <Route path="/games/:gameId/rounds" component={RoundsPage} />
                <Redirect to="/games/:gameId/info" />
              </Switch>
            </BackgroundPaper>
          </BackgroundColor>
        </BackgroundImage>
      </GameContent>
    </>
  );
}

export default GamePage;
