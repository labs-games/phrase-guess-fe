import React from 'react';

import { useParams } from 'react-router-dom';

import { Button, PageHeader, Table } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import useIsOpen from 'hooks/useIsOpen';
import { Phrase, GetResourcesResponse } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

import CreatePhraseDialog from './CreatePhraseDialog';
import DeletePhraseIconButton from './DeletePhraseIconButton';

interface PhraseTableRecord {
  refresh: () => void;
  gameId: number;
}

const columns = [
  { title: 'Phrase', dataIndex: 'value', key: 'value' },
  {
    title: '',
    dataIndex: 'phrase',
    key: 'phrase',
    render: (phrase: Phrase, record: PhraseTableRecord) => (
      <DeletePhraseIconButton phrase={phrase} gameId={record.gameId} onDelete={record.refresh} />
    ),
    width: 80,
  },
];

interface PhrasesTableProps {
  phrases: Phrase[];
  refresh: () => void;
  gameId: number;
}

function PhrasesTable({ phrases, refresh, gameId }: PhrasesTableProps) {
  return (
    <Table
      bordered
      columns={columns}
      dataSource={phrases.map(p => ({
        id: p.id,
        key: p.id,
        value: p.value,
        phrase: p,
        refresh,
        gameId,
      }))}
    />
  );
}

function PhrasesPage() {
  // refactor TODO: make gameId and response refresh in context, no need to pass down this much
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
      {response && <PhrasesTable phrases={response.items} gameId={+gameId} refresh={refresh} />}
    </Paper>
  );
}

export default PhrasesPage;
