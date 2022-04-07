import React from 'react';

import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Menu } from 'antd';

const StyledMenu = styled(Menu)`
  min-height: 100%;
`;

const getSelectedKey = (fullPathName: string): string => {
  if (fullPathName.endsWith('info')) {
    return '1';
  }
  if (fullPathName.endsWith('teams')) {
    return '2';
  }
  if (fullPathName.endsWith('phrases')) {
    return '3';
  }
  if (fullPathName.endsWith('leaderboard')) {
    return '5';
  }
  return '4';
};

function GameSidebar() {
  const { url } = useRouteMatch();
  return (
    <StyledMenu selectedKeys={[getSelectedKey(window.location.pathname)]}>
      <Menu.Item key="1">
        <Link to={`${url}/info`}>Info</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={`${url}/teams`}>Teams</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to={`${url}/phrases`}>Phrases</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to={`${url}/rounds`}>Rounds</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to={`${url}/leaderboard`}>Leaderboard</Link>
      </Menu.Item>
    </StyledMenu>
  );
}

export default GameSidebar;
