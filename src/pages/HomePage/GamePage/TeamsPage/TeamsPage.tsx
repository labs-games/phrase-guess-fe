import React from 'react';

import { useParams } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Team, GetResourcesResponse } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import CreateTeamDialog from './CreateTeamDialog';

const columns = [{ title: 'Name', dataIndex: 'name', key: 'name' }];

interface TeamsTableProps {
  teams: Team[];
}

function TeamsTable({ teams }: TeamsTableProps) {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={teams.map(g => ({
        id: g.id,
        key: g.id,
        name: g.name,
      }))}
    />
  );
}

function TeamsPage() {
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
                  key="dialog"
                  initialName={`Team ${response.items.length + 1}`}
                />,
              ]
            : []
        }
      />
      {response && <TeamsTable teams={response.items} />}
    </Paper>
  );
}

export default TeamsPage;
