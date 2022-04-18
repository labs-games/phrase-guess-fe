import React from 'react';

import { Button, Modal, Typography } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { Team } from 'utils/apiResponseShapes';

interface DeleteTeamDialogProps {
  team: Team;
  gameId: number;
  handleClose: () => void;
  isOpen: boolean;
  onDelete: () => void;
}

function DeleteTeamDialog({ gameId, handleClose, isOpen, onDelete, team }: DeleteTeamDialogProps) {
  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Delete team' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/teams/${team.id}/`, 'delete');
      success();
      handleClose();
      onDelete();
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Modal
      title="Delete Team"
      visible={isOpen}
      onCancel={handleClose}
      footer={[
        <Button onClick={handleClose} key="cancel">
          Cancel
        </Button>,
        <Button danger key="submit" type="primary" onClick={handleSubmit} loading={pending}>
          Delete
        </Button>,
      ]}
    >
      <Typography.Text>
        Are you sure you want to delete team {team.name} ? This action is irreversible
      </Typography.Text>
    </Modal>
  );
}

export default DeleteTeamDialog;
