import React from 'react';

import hash from 'object-hash';
import styled from 'styled-components';

import useApiQuery from 'hooks/useApiQuery';
import {
  GetPhraseResponse,
  GetResourcesResponse,
  Guess,
  Round,
  Team,
} from 'utils/apiResponseShapes';

import GuessActionBar from './GuessActionBar';
import LettersRow from './LettersRow';
import TimerProvider from './TimerContext';
import TimerDisplay from './TimerDisplay';
import WrongGuessesRow from './WrongGuessesRow';

const PageWrapper = styled.div`
  margin-left: 24px;
`;

interface RoundOngoingPageProps {
  round: Round;
  gameId: number;
}

function RoundOngoingPage({ round, gameId }: RoundOngoingPageProps) {
  const { response, refresh } = useApiQuery<GetResourcesResponse<Guess>>(
    `/api/games/${gameId}/rounds/${round.id}/guesses/`
  );
  const { response: teamsResponse } = useApiQuery<GetResourcesResponse<Team>>(
    `/api/games/${gameId}/teams/`
  );
  const { response: phraseResponse } = useApiQuery<GetPhraseResponse>(
    `/api/games/${gameId}/phrases/${round.phraseId}/`
  );
  return (
    response &&
    teamsResponse &&
    phraseResponse && (
      <PageWrapper>
        <TimerProvider>
          <TimerDisplay />
          <LettersRow pastGuesses={response.items} phrase={phraseResponse.value} />
          <WrongGuessesRow pastGuesses={response.items} />
          <GuessActionBar
            key={hash(response)}
            pastGuesses={response.items}
            round={round}
            gameId={gameId}
            teams={teamsResponse.items}
            onGuess={() => refresh()}
          />
        </TimerProvider>
      </PageWrapper>
    )
  );
}

export default RoundOngoingPage;
