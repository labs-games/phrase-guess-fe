import React from 'react';

import { Button, Modal, Input, Form } from 'antd';

import { BoldLabel } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useResetableState from 'hooks/useResetableState';
import useToast from 'hooks/useToast';

interface CreateTeamDialogProps {
  gameId: number;
  handleClose: () => void;
  isOpen: boolean;
  onCreate: () => void;
  initialName: string;
}

function CreateTeamDialog({
  gameId,
  handleClose,
  isOpen,
  onCreate,
  initialName,
}: CreateTeamDialogProps) {
  const [name, setName, resetName] = useResetableState(initialName);
  const resetState = () => {
    resetName();
  };

  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Create team' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/teams/`, 'post', {
        name,
      });
      success();
      handleClose();
      onCreate();
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Modal
      title="Create New Team"
      visible={isOpen}
      onCancel={handleClose}
      afterClose={resetState}
      footer={[
        <Button onClick={handleClose} key="cancel">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={pending}
          disabled={name === ''}
        >
          Submit
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label={<BoldLabel>Team Name</BoldLabel>}>
          <Input placeholder="Team Name" value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateTeamDialog;
