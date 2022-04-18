import React from 'react';

import hash from 'object-hash';
import { useParams } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Team, GetResourcesResponse } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import CreateTeamDialog from './CreateTeamDialog';
import DeleteTeamIconButton from './DeleteTeamIconButton';

interface TeamTableRecord {
  refresh: () => void;
  gameId: number;
}

const columns = [
  { title: 'Team', dataIndex: 'name', key: 'name' },
  {
    title: '',
    dataIndex: 'team',
    key: 'team',
    render: (team: Team, record: TeamTableRecord) => (
      <DeleteTeamIconButton team={team} gameId={record.gameId} onDelete={record.refresh} />
    ),
    width: 80,
  },
];

interface TeamsTableProps {
  teams: Team[];
  refresh: () => void;
  gameId: number;
}

function TeamsTable({ teams, refresh, gameId }: TeamsTableProps) {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={teams.map(t => ({
        id: t.id,
        key: t.id,
        name: t.name,
        team: t,
        refresh,
        gameId,
      }))}
    />
  );
}

function TeamsPage() {
  // refactor TODO: make gameId and response refresh in context, no need to pass down this much
  const { gameId } = useParams<GameParams>();
  const { response, refresh } = useApiQuery<GetResourcesResponse<Team>>(
    `/api/games/${gameId}/teams/`
  );
  const [isOpen, setIsOpen, handleClose] = useIsOpen();

  return (
    <Paper>
      <PageHeader
        title="Teams List"
        extra={
          response
            ? [
                <Button onClick={() => setIsOpen(true)} type="primary" key="button">
                  Add New
                </Button>,
                <CreateTeamDialog
                  gameId={+gameId}
                  handleClose={handleClose}
                  isOpen={isOpen}
                  onCreate={refresh}
                  key={hash(response)}
                  initialName={`Team ${response.items.length + 1}`}
                />,
              ]
            : []
        }
      />
      {response && <TeamsTable teams={response.items} gameId={+gameId} refresh={refresh} />}
    </Paper>
  );
}

export default TeamsPage;
