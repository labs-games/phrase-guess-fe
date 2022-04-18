import React from 'react';

import keyBy from 'lodash/keyBy';
import orderBy from 'lodash/orderBy';
import { useParams } from 'react-router-dom';

import { PageHeader, Table } from 'antd';

import Leaderboard from 'components/Leaderboard';
import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import {
  GetGameResponse,
  GetResourcesResponse,
  Phrase,
  Round,
  Team,
  TeamLeaderboard,
} from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import NextRoundButton from './NextRoundButton';

const columns = [
  { title: 'Rank', dataIndex: 'rank', key: 'rank' },
  { title: 'Team', dataIndex: 'team', key: 'team' },
  { title: 'Score', dataIndex: 'score', key: 'score' },
];

interface LeaderboardTableProps {
  teamLeaderboards: TeamLeaderboard[];
  teams: Team[];
}

export function LeaderboardTable({ teamLeaderboards, teams }: LeaderboardTableProps) {
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
  const { response: roundsResponse } = useApiQuery<GetResourcesResponse<Round>>(
    `/api/games/${gameId}/rounds/`
  );
  const { response: phraseResponse } = useApiQuery<GetResourcesResponse<Phrase>>(
    `/api/games/${gameId}/phrases/`
  );

  return (
    <Paper>
      <PageHeader
        title="Leaderboard"
        extra={
          roundsResponse && teamsResponse && phraseResponse
            ? [
                <NextRoundButton
                  gameId={+gameId}
                  pastRounds={roundsResponse.items}
                  teams={teamsResponse.items}
                  disabled={roundsResponse.items.length === phraseResponse.items.length}
                />,
              ]
            : []
        }
      />
      {gameResponse && teamsResponse && (
        <Leaderboard
          height={700}
          teamLeaderboards={gameResponse.leaderboard}
          teams={teamsResponse.items}
        />
      )}
    </Paper>
  );
}

export default LeaderboardPage;
