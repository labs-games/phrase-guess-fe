import React from 'react';

import { Button } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { CreateGuessResponse, Round } from 'utils/apiResponseShapes';
import { GuessTypes } from 'utils/enums';

import { useTimerContext } from './TimerContext';

interface NextTeamTimerButtonProps {
  teamId: number;
  round: Round;
  gameId: number;
  onTimeout: () => void;
  isEnded: boolean;
}

function NextTeamTimerButton({
  teamId,
  gameId,
  round,
  onTimeout,
  isEnded,
}: NextTeamTimerButtonProps) {
  const { isTimeout } = useTimerContext();

  const { request } = useRequest<CreateGuessResponse>();
  const { error } = useToast({ actionName: 'Guess' });
  const { handleError } = useFetchErrorHandler<CreateGuessResponse>({
    defaultHandler: () => error(),
  });

  const handleTimeout = useEventCallback(async () => {
    try {
      await request(`/api/games/${gameId}/rounds/${round.id}/guesses/`, 'post', {
        teamId,
        type: GuessTypes.timedOut,
      });
      onTimeout();
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Button type="primary" danger onClick={handleTimeout} disabled={!isTimeout || isEnded}>
      Next Team
    </Button>
  );
}

export default NextTeamTimerButton;
