import React from 'react';

import { Button, Modal, Input, Form } from 'antd';

import { BoldLabel } from 'components/common';
import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useResetableState from 'hooks/useResetableState';
import useToast from 'hooks/useToast';

interface CreatePhraseDialogProps {
  gameId: number;
  handleClose: () => void;
  isOpen: boolean;
  onCreate: () => void;
}

function CreatePhraseDialog({ gameId, handleClose, isOpen, onCreate }: CreatePhraseDialogProps) {
  const [value, setName, resetName] = useResetableState('');
  const resetState = () => {
    resetName();
  };

  const { request, pending } = useRequest<null>();
  const { success, error } = useToast({ actionName: 'Create phrase' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const handleSubmit = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/phrases/`, 'post', {
        value,
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
      title="Create New Phrase"
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
          disabled={value === ''}
        >
          Submit
        </Button>,
      ]}
    >
      <Form>
        <Form.Item label={<BoldLabel>Phrase Value</BoldLabel>}>
          <Input placeholder="Phrase Value" value={value} onChange={e => setName(e.target.value)} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreatePhraseDialog;
