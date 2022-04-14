import React, { useState } from 'react';

import hash from 'object-hash';
import styled from 'styled-components';

import useApiQuery from 'hooks/useApiQuery';
import {
  GetGameResponse,
  GetPhraseResponse,
  GetResourcesResponse,
  Guess,
  Round,
  Team,
} from 'utils/apiResponseShapes';

import Leaderboard from '../../../../components/Leaderboard';
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
  const { response: gameResponse, refresh: refreshGame } = useApiQuery<GetGameResponse>(
    `/api/games/${gameId}/`
  );
  const { response: guessesResponse, refresh: refreshGuess } = useApiQuery<
    GetResourcesResponse<Guess>
  >(`/api/games/${gameId}/rounds/${round.id}/guesses/`);
  const { response: teamsResponse } = useApiQuery<GetResourcesResponse<Team>>(
    `/api/games/${gameId}/teams/`
  );
  const { response: phraseResponse } = useApiQuery<GetPhraseResponse>(
    `/api/games/${gameId}/phrases/${round.phraseId}/`
  );

  const [isEnded, setIsEnded] = useState(false);
  return (
    guessesResponse &&
    gameResponse &&
    teamsResponse &&
    phraseResponse && (
      <PageWrapper>
        <TimerProvider>
          <TimerDisplay />
          <LettersRow pastGuesses={guessesResponse.items} phrase={phraseResponse.value} />
          <WrongGuessesRow pastGuesses={guessesResponse.items} />
          <GuessActionBar
            key={hash(guessesResponse)}
            pastGuesses={guessesResponse.items}
            round={round}
            gameId={gameId}
            teams={teamsResponse.items}
            onGuess={() => {
              refreshGuess();
              refreshGame();
            }}
            isEnded={isEnded}
            setIsEnded={setIsEnded}
          />
          <Leaderboard
            height={400}
            teamLeaderboards={gameResponse.leaderboard}
            teams={teamsResponse.items}
          />
        </TimerProvider>
      </PageWrapper>
    )
  );
}

export default RoundOngoingPage;
