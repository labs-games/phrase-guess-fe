import React from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';

import { Button } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { Round, Team } from 'utils/apiResponseShapes';
import { CreationResponse } from 'utils/interfaces';
import { getNextTeamIdToStartRound } from 'utils/nextTeam';

interface NextRoundButtonProps {
  pastRounds: Round[];
  teams: Team[];
  gameId: number;
  disabled: boolean;
}

function NextRoundButton({ pastRounds, teams, gameId, disabled }: NextRoundButtonProps) {
  const name = `Round ${pastRounds.length + 1}`;
  const startingTeamId = getNextTeamIdToStartRound(
    teams.map(t => t.id),
    pastRounds
  );

  const { request, pending } = useRequest<CreationResponse>();
  const { success, error } = useToast({ actionName: 'Create round' });
  const { handleError } = useFetchErrorHandler<null>({
    defaultHandler: () => error(),
  });

  const { push } = useHistory();
  const { url } = useRouteMatch();

  const handleSubmit = useEventCallback(async () => {
    try {
      const response = await request(`/api/games/${gameId}/rounds/`, 'post', {
        name,
        startingTeamId,
      });
      success();
      push(url.replace(/leaderboard+$/, `rounds/${response.id}/guess`));
    } catch (err) {
      handleError(err);
    }
  });
  return (
    <Button
      key="submit"
      type="primary"
      onClick={handleSubmit}
      loading={pending}
      disabled={disabled}
    >
      Next Round
    </Button>
  );
}

export default NextRoundButton;
