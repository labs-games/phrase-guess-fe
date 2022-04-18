import React, { useEffect, useRef } from 'react';

import * as echarts from 'echarts';
import isEmpty from 'lodash/isEmpty';
import keyBy from 'lodash/keyBy';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import styled, { css } from 'styled-components';

import { Team, TeamLeaderboard } from 'utils/apiResponseShapes';

const Canvas = styled.div<{ $height: number }>`
  ${({ $height }) => css`
    height: ${$height}px;
  `}
`;

interface LeaderboardProps {
  teamLeaderboards: TeamLeaderboard[];
  teams: Team[];
  height: number;
}

interface TeamWithScore extends Team {
  score: number;
}

const createOption = (teamsWithScore: TeamWithScore[]): echarts.EChartOption => {
  if (isEmpty(teamsWithScore)) {
    return {};
  }
  const cutoffScore = last(sortBy(teamsWithScore, 'score').reverse().slice(0, 3)).score;

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: 30,
      bottom: 50,
      left: 30,
      right: 30,
    },
    xAxis: {
      data: teamsWithScore.map(t => ({
        value: t.name,
        textStyle: {
          fontWeight: 'bold',
        },
      })),
      axisLabel: { rotate: 45 },
    },
    yAxis: {},
    series: [
      {
        name: 'Score',
        type: 'bar',
        stack: 'Total',
        data: teamsWithScore.map(t => ({
          value: t.score,
          itemStyle: {
            color: t.score >= cutoffScore ? 'orange' : '#666666',
          },
          label: { show: t.score !== 0, fontWeight: 'bold', fontSize: 14 },
        })),
      },
    ],
  };
};

function Leaderboard({ teamLeaderboards, teams, height }: LeaderboardProps) {
  const ref = useRef(null);

  useEffect(() => {
    const teamLeaderboardsByTeamId = keyBy(teamLeaderboards, 'teamId');
    const teamsWithScore = teams.map(team => ({
      ...team,
      score: teamLeaderboardsByTeamId[team.id]?.totalScore ?? 0,
    }));
    const dom = ref.current;
    if (dom === undefined) {
      return;
    }
    const chart = echarts.init(dom);
    chart.setOption(createOption(teamsWithScore));
  }, [ref, teamLeaderboards, teams]);

  return <Canvas ref={ref} $height={height} />;
}

export default Leaderboard;
