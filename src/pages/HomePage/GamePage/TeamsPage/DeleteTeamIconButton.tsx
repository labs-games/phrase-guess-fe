import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import useIsOpen from 'hooks/useIsOpen';
import { Team } from 'utils/apiResponseShapes';

import DeleteTeamDialog from './DeleteTeamDialog';

interface DeleteTeamIconButtonProps {
  team: Team;
  gameId: number;
  onDelete: () => void;
}

function DeleteTeamIconButton({ team, gameId, onDelete }: DeleteTeamIconButtonProps) {
  const [isOpen, setIsOpen, handleClose] = useIsOpen();
  return (
    <>
      <Button danger type="text" onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <DeleteTeamDialog
        team={team}
        gameId={gameId}
        handleClose={handleClose}
        isOpen={isOpen}
        onDelete={onDelete}
      />
    </>
  );
}

export default DeleteTeamIconButton;
