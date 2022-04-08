import React, { useEffect, useRef } from 'react';

import * as echarts from 'echarts';
import keyBy from 'lodash/keyBy';
import styled, { css } from 'styled-components';

import { Team, TeamLeaderboard } from 'utils/apiResponseShapes';

const Canvas = styled.div<{ $teamCount: number }>`
  ${({ $teamCount }) => css`
    height: ${60 + $teamCount * 40}px;
  `}
`;

interface LeaderboardGraphProps {
  teamLeaderboards: TeamLeaderboard[];
  teams: Team[];
}

interface TeamWithScore extends Team {
  score: number;
}

const createOption = (teamsWithScore: TeamWithScore[]): echarts.EChartOption => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    top: 30,
    bottom: 30,
  },
  xAxis: {
    type: 'value',
    position: 'top',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
  },
  yAxis: {
    type: 'category',
    axisLine: { show: false },
    axisLabel: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    data: teamsWithScore.map(t => t.name),
  },
  series: [
    {
      name: 'Score',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        formatter: '{b}',
      },
      data: teamsWithScore.map(t =>
        t.score > 0 ? t.score : { value: t.score, label: { position: 'right' } }
      ),
    },
  ],
});

function LeaderboardGraph({ teamLeaderboards, teams }: LeaderboardGraphProps) {
  const ref = useRef(null);

  useEffect(() => {
    const teamLeaderboardsByTeamId = keyBy(teamLeaderboards, 'teamId');
    const teamsWithScore = teams
      .map(team => ({
        ...team,
        score: teamLeaderboardsByTeamId[team.id]?.totalScore ?? 0,
      }))
      .reverse();
    const dom = ref.current;
    if (dom === undefined) {
      return;
    }
    const chart = echarts.init(dom);
    chart.setOption(createOption(teamsWithScore));
  }, [ref, teamLeaderboards, teams]);

  return <Canvas ref={ref} $teamCount={teams.length} />;
}

export default LeaderboardGraph;
