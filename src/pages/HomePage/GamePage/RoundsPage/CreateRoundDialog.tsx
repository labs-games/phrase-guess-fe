import React from 'react';

import { Button, Modal, Input, Form, Select } from 'antd';

import { BoldLabel } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useResetableState from 'hooks/useResetableState';
import useToast from 'hooks/useToast';
import { Team } from 'utils/apiResponseShapes';

interface CreateRoundDialogProps {
  teams: Team[];
  gameId: number;
  handleClose: () => void;
  isOpen: boolean;
  onCreate: () => void;
  initialName: string;
}

function CreateRoundDialog({
  gameId,
  teams,
  handleClose,
  isOpen,
  onCreate,
  initialName,
}: CreateRoundDialogProps) {
  const [name, setName, resetName] = useResetableState(initialName);
  const [startingTeamId, setStartingTeamId, resetStartingTeamId] = useResetableState(teams[0].id);
  const resetState = () => {
    resetName();
    resetStartingTeamId();
  };

  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Create round' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/rounds/`, 'post', {
        name,
        startingTeamId,
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
      title="Create New Round"
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
        <Form.Item label={<BoldLabel>Round Name</BoldLabel>}>
          <Input placeholder="Round Name" value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label={<BoldLabel>Starting Team</BoldLabel>}>
          <Select value={startingTeamId} onChange={setStartingTeamId}>
            {teams.map(team => (
              <Select.Option value={team.id} key={team.id}>
                {team.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateRoundDialog;
