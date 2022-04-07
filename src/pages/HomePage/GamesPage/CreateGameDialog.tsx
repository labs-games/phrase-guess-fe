import React from 'react';

import { Button, Modal, Input, Form, Select } from 'antd';

import { BoldLabel } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useResetableState from 'hooks/useResetableState';
import useToast from 'hooks/useToast';
import { OrderingDisplays } from 'utils/displays';
import { Orderings } from 'utils/enums';

interface CreateGameDialogProps {
  handleClose: () => void;
  isOpen: boolean;
  onCreate: () => void;
}

function CreateGameDialog({ handleClose, isOpen, onCreate }: CreateGameDialogProps) {
  const [name, setName, resetName] = useResetableState('');
  const [teamOrdering, setTeamOrdering, resetTeamOrdering] = useResetableState(Orderings.random);
  const [phraseOrdering, setPhraseOrdering, resetPhraseOrdering] = useResetableState(
    Orderings.random
  );
  const resetState = () => {
    resetName();
    resetPhraseOrdering();
    resetTeamOrdering();
  };

  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Create game' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request('/api/games/', 'post', {
        name,
        teamOrder: teamOrdering,
        phraseOrder: phraseOrdering,
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
      title="Create New Game"
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
        <Form.Item label={<BoldLabel>Game Name</BoldLabel>}>
          <Input placeholder="Game Name" value={name} onChange={e => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label={<BoldLabel>Team Ordering</BoldLabel>}>
          <Select value={teamOrdering} onChange={setTeamOrdering}>
            <Select.Option value={Orderings.random} key={Orderings.random}>
              {OrderingDisplays[Orderings.random]}
            </Select.Option>
            <Select.Option value={Orderings.ordered} key={Orderings.ordered}>
              {OrderingDisplays[Orderings.ordered]}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label={<BoldLabel>Phrase Ordering</BoldLabel>}>
          <Select value={phraseOrdering} onChange={setPhraseOrdering}>
            <Select.Option value={Orderings.random} key={Orderings.random}>
              {OrderingDisplays[Orderings.random]}
            </Select.Option>
            <Select.Option value={Orderings.ordered} key={Orderings.ordered}>
              {OrderingDisplays[Orderings.ordered]}
            </Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateGameDialog;
