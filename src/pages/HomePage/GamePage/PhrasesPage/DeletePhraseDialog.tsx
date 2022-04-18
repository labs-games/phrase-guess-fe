import React from 'react';

import { Button, Modal, Typography } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { Phrase } from 'utils/apiResponseShapes';

interface DeletePhraseDialogProps {
  phrase: Phrase;
  gameId: number;
  handleClose: () => void;
  isOpen: boolean;
  onDelete: () => void;
}

function DeletePhraseDialog({
  gameId,
  handleClose,
  isOpen,
  onDelete,
  phrase,
}: DeletePhraseDialogProps) {
  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Delete phrase' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/phrases/${phrase.id}/`, 'delete');
      success();
      handleClose();
      onDelete();
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Modal
      title="Delete Phrase"
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
        Are you sure you want to delete phrase {phrase.value} ? This action is irreversible
      </Typography.Text>
    </Modal>
  );
}

export default DeletePhraseDialog;
