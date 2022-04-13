import React from 'react';

import styled from 'styled-components';

import { useTimerContext } from './TimerContext';

const TimerWrapper = styled.div`
  font-size: 36px;
  color: #fc7c7c;
  font-weight: bold;
  width: 100%;
  text-align: right;
  margin-top: -66px;
`;

function TimerDisplay() {
  const { countdown } = useTimerContext();
  return <TimerWrapper>00:0{countdown}</TimerWrapper>;
}

export default TimerDisplay;
