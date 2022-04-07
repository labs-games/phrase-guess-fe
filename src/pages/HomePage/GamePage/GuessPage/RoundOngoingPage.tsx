import React from 'react';

import hash from 'object-hash';
import styled from 'styled-components';

import useApiQuery from 'hooks/useApiQuery';
import { GetResourcesResponse, Guess, Round, Team } from 'utils/apiResponseShapes';

import GuessActionBar from './GuessActionBar';
import LettersRow from './LettersRow';
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
  return (
    response &&
    teamsResponse && (
      <PageWrapper>
        <LettersRow pastGuesses={response.items} round={round} gameId={gameId} />
        <WrongGuessesRow pastGuesses={response.items} />
        <GuessActionBar
          key={hash(response)}
          pastGuesses={response.items}
          round={round}
          gameId={gameId}
          teams={teamsResponse.items}
          onGuess={() => refresh()}
        />
      </PageWrapper>
    )
  );
}

export default RoundOngoingPage;
