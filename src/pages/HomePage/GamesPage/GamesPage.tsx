import React from 'react';

import { useHistory } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Game, GetResourcesResponse } from 'utils/apiResponseShapes';
import { OrderingDisplays } from 'utils/displays';

import CreateGameDialog from './CreateGameDialog';

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Team Order', dataIndex: 'teamOrder', key: 'teamOrder' },
  { title: 'Phrase Order', dataIndex: 'phraseOrder', key: 'phraseOrder' },
];

interface GamesTableProps {
  games: Game[];
}

function GamesTable({ games }: GamesTableProps) {
  const { push } = useHistory();
  return (
    <Table
      bordered
      columns={columns}
      dataSource={games.map(g => ({
        id: g.id,
        key: g.id,
        name: g.name,
        teamOrder: OrderingDisplays[g.teamOrder],
        phraseOrder: OrderingDisplays[g.phraseOrder],
      }))}
      onRow={record => ({
        onClick: () => push(`/games/${record.id}`),
        style: { cursor: 'pointer' },
      })}
    />
  );
}

function GamesPage() {
  const { response, refresh } = useApiQuery<GetResourcesResponse<Game>>('/api/games/');
  const [isOpen, setIsOpen, handleClose] = useIsOpen();

  return (
    <Paper>
      <PageHeader
        title="Games List"
        extra={[
          <Button onClick={() => setIsOpen(true)} type="primary" key="button">
            Add New
          </Button>,
          <CreateGameDialog
            handleClose={handleClose}
            isOpen={isOpen}
            onCreate={refresh}
            key="dialog"
          />,
        ]}
      />
      {response && <GamesTable games={response.items} />}
    </Paper>
  );
}

export default GamesPage;
