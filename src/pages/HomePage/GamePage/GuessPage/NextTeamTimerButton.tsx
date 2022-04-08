import React, { useEffect, useState } from 'react';

import { Button } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { CreateGuessResponse, Round } from 'utils/apiResponseShapes';
import { GuessTypes } from 'utils/enums';

interface NextTeamTimerButtonProps {
  teamId: number;
  round: Round;
  gameId: number;
  onTimeout: () => void;
}

function NextTeamTimerButton({ teamId, gameId, round, onTimeout }: NextTeamTimerButtonProps) {
  const [countDown, setCountdown] = useState(3);
  const isTimeout = countDown === 0;

  const reduceCountdown = useEventCallback(() => {
    if (countDown > 0) {
      setCountdown(c => c - 1);
    }
  });
  useEffect(() => {
    const timer = setInterval(reduceCountdown, 1000);
    return () => clearInterval(timer);
  }, [reduceCountdown]);

  const { request, pending } = useRequest<CreateGuessResponse>();
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
    <Button type="primary" danger onClick={handleTimeout} disabled={!isTimeout} loading={pending}>
      {isTimeout ? 'Next Team' : `00:0${countDown}`}
    </Button>
  );
}

export default NextTeamTimerButton;
