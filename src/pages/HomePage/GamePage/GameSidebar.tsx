import React from 'react';

import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Menu, Switch } from 'antd';

import useLocalStorage from 'hooks/useLocalStorage';

const StyledMenu = styled(Menu)`
  min-height: 100%;
`;

const SwitchWrapper = styled.div`
  margin-left: 20px;
  margin-top: 24px;
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
  const [isSafeMode, setIsSafeMode] = useLocalStorage({ key: 'safe-mode', initialValue: false });
  return (
    <StyledMenu selectedKeys={[getSelectedKey(window.location.pathname)]}>
      <Menu.Item key="1">
        <Link to={`${url}/info`}>Info</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to={`${url}/teams`}>Teams</Link>
      </Menu.Item>
      <Menu.Item key="3" disabled={isSafeMode}>
        <Link to={`${url}/phrases`}>Phrases</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to={`${url}/rounds`}>Rounds</Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link to={`${url}/leaderboard`}>Leaderboard</Link>
      </Menu.Item>
      <SwitchWrapper>
        <Switch
          checkedChildren="Safe"
          unCheckedChildren="Unsafe"
          checked={isSafeMode}
          onChange={setIsSafeMode}
        />
      </SwitchWrapper>
    </StyledMenu>
  );
}

export default GameSidebar;
