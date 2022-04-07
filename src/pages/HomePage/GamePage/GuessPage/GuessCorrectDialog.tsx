import React from 'react';

import { Button, Modal, Result } from 'antd';

import { CreateGuessResponse, Team } from 'utils/apiResponseShapes';

interface GuessCorrectDialogProps {
  teams: Team[];
  guessResponse: CreateGuessResponse | null;
  handleClose: () => void;
  isOpen: boolean;
  refresh: () => void;
  goToLeaderboard: () => void;
}

function GuessCorrectDialog({
  teams,
  guessResponse,
  isOpen,
  handleClose,
  refresh,
  goToLeaderboard,
}: GuessCorrectDialogProps) {
  const team = teams.find(t => t.id === guessResponse?.teamId);
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {}}
      footer={
        guessResponse?.shouldEnd
          ? [
              <Button key="submit" type="primary" onClick={goToLeaderboard}>
                Go to leaderboard page
              </Button>,
            ]
          : [
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
            ]
      }
    >
      <Result
        status="success"
        title="Correct!"
        subTitle={`${team?.name} obtained ${guessResponse?.score} score`}
      />
    </Modal>
  );
}

export default GuessCorrectDialog;
