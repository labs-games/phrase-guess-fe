import React, { useState } from 'react';

import { useHistory, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Input, Select, Space, Radio } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useIsOpen from 'hooks/useIsOpen';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { CreateGuessResponse, Guess, Round, Team } from 'utils/apiResponseShapes';
import { GuessTypeDisplays } from 'utils/displays';
import { GuessStatuses, GuessTypes } from 'utils/enums';
import { getNextTeamIdToGuess } from 'utils/nextTeam';

import GuessCorrectDialog from './GuessCorrectDialog';
import GuessWrongDialog from './GuessWrongDialog';
import NextTeamTimerButton from './NextTeamTimerButton';

const StyledSelect = styled(Select)`
  min-width: 150px;
`;

const StyledInput = styled(Input)`
  min-width: 300px;
`;

interface GuessActionBarProps {
  onGuess: () => void;
  teams: Team[];
  pastGuesses: Guess[];
  round: Round;
  gameId: number;
}

function GuessActionBar({ pastGuesses, round, gameId, onGuess, teams }: GuessActionBarProps) {
  const [type, setType] = useState(GuessTypes.letter);
  const [teamId, setTeamId] = useState(getNextTeamIdToGuess(round.teamOrdering, pastGuesses));
  const [value, setValue] = useState('');
  const [guessResponse, setGuessResponse] = useState(null);

  const { request, pending } = useRequest<CreateGuessResponse>();
  const { error } = useToast({ actionName: 'Guess' });
  const { handleError } = useFetchErrorHandler<CreateGuessResponse>({
    defaultHandler: () => error(),
  });

  const [correctDialogOpen, setCorrectDialogOpen, handleCorrectDialogClose] = useIsOpen();
  const [wrongDialogOpen, setWrongDialogOpen, handleWrongDialogClose] = useIsOpen();
  const { push } = useHistory();
  const { url } = useRouteMatch();

  const handleSubmit = useEventCallback(async () => {
    try {
      const response = await request(`/api/games/${gameId}/rounds/${round.id}/guesses/`, 'post', {
        teamId,
        type,
        value,
      });
      setGuessResponse(response);
      if (response.status === GuessStatuses.correct) {
        setCorrectDialogOpen(true);
      } else {
        setWrongDialogOpen(true);
      }
    } catch (err) {
      handleError(err);
    }
  });

  return (
    <Space>
      <Radio.Group value={type} onChange={e => setType(e.target.value)}>
        {[GuessTypes.letter, GuessTypes.phrase].map(typeChoice => (
          <Radio.Button value={typeChoice} key={typeChoice}>
            {GuessTypeDisplays[typeChoice]}
          </Radio.Button>
        ))}
      </Radio.Group>
      <StyledSelect value={teamId} onChange={setTeamId}>
        {teams.map(team => (
          <Select.Option value={team.id} key={team.id}>
            {team.name}
          </Select.Option>
        ))}
      </StyledSelect>
      <StyledInput
        placeholder="Enter Your Guess"
        value={value}
        onChange={e =>
          setValue(
            type === GuessTypes.letter ? e.target.value.slice(0, 1) : e.target.value.slice(0, 200)
          )
        }
      />
      <Button type="primary" onClick={handleSubmit} loading={pending} disabled={value === ''}>
        Guess
      </Button>
      <NextTeamTimerButton teamId={teamId} round={round} gameId={gameId} onTimeout={onGuess} />
      <GuessCorrectDialog
        teams={teams}
        guessResponse={guessResponse}
        handleClose={handleCorrectDialogClose}
        isOpen={correctDialogOpen}
        refresh={onGuess}
        goToLeaderboard={() => push(url.replace(/rounds+.+$/, 'leaderboard'))}
      />
      <GuessWrongDialog
        handleClose={handleWrongDialogClose}
        isOpen={wrongDialogOpen}
        refresh={onGuess}
      />
    </Space>
  );
}

export default GuessActionBar;
