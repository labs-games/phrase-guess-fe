import React, { useState, useEffect } from 'react';

import hash from 'object-hash';
import { useRouteMatch, Link } from 'react-router-dom';
import styled from 'styled-components';

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Input, Select, Space, Radio, message } from 'antd';

import useEventCallback from 'hooks/useEventCallback';
import useFetchErrorHandler from 'hooks/useFetchErrorHandler';
import useRequest from 'hooks/useRequest';
import useToast from 'hooks/useToast';
import { CreateGuessResponse, Guess, Round, Team } from 'utils/apiResponseShapes';
import { GuessTypeDisplays } from 'utils/displays';
import { GuessStatuses, GuessTypes } from 'utils/enums';
import { getNextTeamIdToGuess } from 'utils/nextTeam';

import NextTeamTimerButton from './NextTeamTimerButton';
import { useTimerContext } from './TimerContext';

const StyledSpace = styled(Space)`
  margin-bottom: 24px;
`;

const StyledSelect = styled(Select)`
  min-width: 150px;
`;

const StyledInput = styled(Input)`
  min-width: 300px;
`;

const Message = styled.div`
  font-size: 24px;
  text-align: left;
`;

const MessageScore = styled.span`
  font-weight: bold;
  color: green;
`;

const messageRootClass = 'message-root'; // see App.css for usage

interface GuessActionBarProps {
  onGuess: () => void;
  teams: Team[];
  pastGuesses: Guess[];
  round: Round;
  gameId: number;
  isEnded: boolean;
  setIsEnded: (shouldEnd: boolean) => void;
}

function GuessActionBar({
  pastGuesses,
  round,
  gameId,
  onGuess,
  teams,
  isEnded,
  setIsEnded,
}: GuessActionBarProps) {
  const { reset } = useTimerContext();
  const [type, setType] = useState(GuessTypes.letter);
  const [teamId, setTeamId] = useState(getNextTeamIdToGuess(round.teamOrdering, pastGuesses));
  const [value, setValue] = useState('');

  const { request } = useRequest<CreateGuessResponse>();
  const { error } = useToast({ actionName: 'Guess' });
  const { handleError } = useFetchErrorHandler<CreateGuessResponse>({
    defaultHandler: () => error(),
  });

  const hashedGuesses = hash(pastGuesses);
  useEffect(() => reset(), [reset, hashedGuesses]);

  const handleSubmit = useEventCallback(async () => {
    try {
      const response = await request(`/api/games/${gameId}/rounds/${round.id}/guesses/`, 'post', {
        teamId,
        type,
        value,
      });
      onGuess();
      if (response.shouldEnd) {
        setIsEnded(true);
      }
      const team = teams.find(t => t.id === response.teamId);
      const teamName = team ? team.name : 'Team';
      if (response.status === GuessStatuses.correct) {
        message.success({
          content: (
            <Message>
              Correct! <br />
              {teamName} obtained <MessageScore>{response.score}</MessageScore> score
            </Message>
          ),
          icon: <CheckCircleFilled style={{ fontSize: 32, marginRight: 12 }} />,
          className: messageRootClass,
        });
      } else if (response.status === GuessStatuses.wrong) {
        message.error({
          content: <Message>Wrong</Message>,
          icon: <CloseCircleFilled style={{ fontSize: 32, marginRight: 12 }} />,
          className: messageRootClass,
        });
      }
    } catch (err) {
      handleError(err);
    }
  });

  const { url } = useRouteMatch();
  return (
    <StyledSpace>
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
      <Button type="primary" onClick={handleSubmit} disabled={value === '' || isEnded}>
        Guess
      </Button>
      <NextTeamTimerButton
        teamId={teamId}
        round={round}
        gameId={gameId}
        onTimeout={onGuess}
        isEnded={isEnded}
      />
      {isEnded && (
        <Button type="primary">
          <Link to={url.replace(/rounds+.+$/, 'leaderboard')}>Go to leaderboard</Link>
        </Button>
      )}
    </StyledSpace>
  );
}

export default GuessActionBar;
