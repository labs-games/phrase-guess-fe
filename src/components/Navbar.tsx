import React from 'react';

import { Link } from 'react-router-dom';

import { Menu } from 'antd';

function Navbar() {
  return (
    <Menu mode="horizontal" theme="dark" selectedKeys={[]}>
      <Menu.Item key={1}>
        <Link to="">Home</Link>
      </Menu.Item>
      <Menu.Item key={2}>
        <Link to="/games">Games</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navbar;
