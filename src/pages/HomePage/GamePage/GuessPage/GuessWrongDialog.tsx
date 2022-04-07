import React from 'react';

import { Button, Modal, Result } from 'antd';

interface GuessWrongDialogProps {
  handleClose: () => void;
  isOpen: boolean;
  refresh: () => void;
}

function GuessWrongDialog({ isOpen, handleClose, refresh }: GuessWrongDialogProps) {
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {}}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            refresh();
            handleClose();
          }}
        >
          Continue game
        </Button>,
      ]}
    >
      <Result status="error" title="Wrong!" />
    </Modal>
  );
}

export default GuessWrongDialog;
