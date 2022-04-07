import React from 'react';

import { Link } from 'react-router-dom';

import { Menu } from 'antd';

function Navbar() {
  return (
    <Menu mode="horizontal" theme="dark">
      <Menu.Item>
        <Link to="">Home</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/games">Games</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navbar;
