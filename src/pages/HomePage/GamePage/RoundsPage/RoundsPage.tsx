import React from 'react';

import isEmpty from 'lodash/isEmpty';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Round, GetResourcesResponse, Team } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import CreateRoundDialog from './CreateRoundDialog';

const columns = [
  { title: 'Round', dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

interface RoundsTableProps {
  rounds: Round[];
}

function RoundsTable({ rounds }: RoundsTableProps) {
  const { push } = useHistory();
  const { url } = useRouteMatch();
  return (
    <Table
      bordered
      columns={columns}
      dataSource={rounds.map(r => ({
        id: r.id,
        key: r.id,
        name: r.name,
        status: r.isEnded ? 'Ended' : 'Ongoing',
      }))}
      onRow={record => ({
        onClick: () => push(url.replace(/rounds+$/, `rounds/${record.id}/guess`)),
        style: { cursor: 'pointer' },
      })}
    />
  );
}

function RoundsPage() {
  const { gameId } = useParams<GameParams>();
  const { response, refresh } = useApiQuery<GetResourcesResponse<Round>>(
    `/api/games/${gameId}/rounds/`
  );
  const { response: teamsResponse } = useApiQuery<GetResourcesResponse<Team>>(
    `/api/games/${gameId}/teams/`
  );
  const [isOpen, setIsOpen, handleClose] = useIsOpen();

  return (
    <Paper>
      <PageHeader
        title="Rounds List"
        extra={
          response && teamsResponse && !isEmpty(teamsResponse.items)
            ? [
                <Button onClick={() => setIsOpen(true)} type="primary" key="button">
                  Add New
                </Button>,
                <CreateRoundDialog
                  gameId={+gameId}
                  handleClose={handleClose}
                  isOpen={isOpen}
                  onCreate={refresh}
                  key="dialog"
                  initialName={`Round ${response.items.length + 1}`}
                  teams={teamsResponse.items}
                />,
              ]
            : []
        }
      />
      {response && <RoundsTable rounds={response.items} />}
    </Paper>
  );
}

export default RoundsPage;
