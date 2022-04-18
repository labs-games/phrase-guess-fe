import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import useIsOpen from 'hooks/useIsOpen';
import { Phrase } from 'utils/apiResponseShapes';

import DeletePhraseDialog from './DeletePhraseDialog';

interface DeletePhraseIconButtonProps {
  phrase: Phrase;
  gameId: number;
  onDelete: () => void;
}

function DeletePhraseIconButton({ phrase, gameId, onDelete }: DeletePhraseIconButtonProps) {
  const [isOpen, setIsOpen, handleClose] = useIsOpen();
  return (
    <>
      <Button danger type="text" onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <DeletePhraseDialog
        phrase={phrase}
        gameId={gameId}
        handleClose={handleClose}
        isOpen={isOpen}
        onDelete={onDelete}
      />
    </>
  );
}

export default DeletePhraseIconButton;
