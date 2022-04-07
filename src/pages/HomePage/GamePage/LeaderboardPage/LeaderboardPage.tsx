import React from 'react';

import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import { useParams } from 'react-router-dom';

import { PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import {
  GetGameResponse,
  GetResourcesResponse,
  Team,
  TeamLeaderboard,
} from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

const columns = [
  { title: 'Rank', dataIndex: 'rank', key: 'rank' },
  { title: 'Team', dataIndex: 'team', key: 'team' },
  { title: 'Score', dataIndex: 'score', key: 'score' },
];

interface LeaderboardTableProps {
  teamLeaderboards: TeamLeaderboard[];
  teams: Team[];
}

function LeaderboardTable({ teamLeaderboards, teams }: LeaderboardTableProps) {
  const teamLeaderboardsByTeamId = keyBy(teamLeaderboards, 'teamId');
  const sortedData = orderBy(
    teams.map(team => ({
      id: team.id,
      team: team.name,
      score: teamLeaderboardsByTeamId[team.id]?.totalScore ?? 0,
    })),
    ['score', 'id'],
    ['desc', 'asc']
  );
  return (
    <Table
      bordered
      columns={columns}
      dataSource={sortedData.map((datum, idx) => ({ ...datum, rank: idx + 1, key: datum.id }))}
    />
  );
}

function LeaderboardPage() {
  const { gameId } = useParams<GameParams>();
  const { response: gameResponse } = useApiQuery<GetGameResponse>(`/api/games/${gameId}/`);
  const { response: teamsResponse } = useApiQuery<GetResourcesResponse<Team>>(
    `/api/games/${gameId}/teams/`
  );

  return (
    <Paper>
      <PageHeader title="Leaderboard" />
      {gameResponse && teamsResponse && (
        <LeaderboardTable teamLeaderboards={gameResponse.leaderboard} teams={teamsResponse.items} />
      )}
    </Paper>
  );
}

export default LeaderboardPage;
