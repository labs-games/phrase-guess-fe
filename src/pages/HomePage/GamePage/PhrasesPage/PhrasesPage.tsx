import React from 'react';

import { useParams } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Phrase, GetResourcesResponse } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import CreatePhraseDialog from './CreatePhraseDialog';

const columns = [{ title: 'Phrase', dataIndex: 'value', key: 'value' }];

interface PhrasesTableProps {
  phrases: Phrase[];
}

function PhrasesTable({ phrases }: PhrasesTableProps) {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={phrases.map(g => ({
        id: g.id,
        key: g.id,
        value: g.value,
      }))}
    />
  );
}

function PhrasesPage() {
  const { gameId } = useParams<GameParams>();
  const { response, refresh } = useApiQuery<GetResourcesResponse<Phrase>>(
    `/api/games/${gameId}/phrases/`
  );
  const [isOpen, setIsOpen, handleClose] = useIsOpen();

  return (
    <Paper>
      <PageHeader
        title="Phrases List"
        extra={[
          <Button onClick={() => setIsOpen(true)} type="primary" key="button">
            Add New
          </Button>,
          <CreatePhraseDialog
            gameId={+gameId}
            handleClose={handleClose}
            isOpen={isOpen}
            onCreate={refresh}
            key="dialog"
          />,
        ]}
      />
      {response && <PhrasesTable phrases={response.items} />}
    </Paper>
  );
}

export default PhrasesPage;
