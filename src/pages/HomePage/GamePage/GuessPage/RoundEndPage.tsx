import React from 'react';

import styled from 'styled-components';

import { Typography } from 'antd';

import useApiQuery from 'hooks/useApiQuery';
import { GetPhraseResponse, GetResourcesResponse, Guess, Round } from 'utils/apiResponseShapes';

import LettersRow from './LettersRow';

const PageWrapper = styled.div`
  margin-left: 24px;
`;

interface RoundEndPageProps {
  round: Round;
  gameId: number;
}
function RoundEndPage({ round, gameId }: RoundEndPageProps) {
  const { response } = useApiQuery<GetResourcesResponse<Guess>>(
    `/api/games/${gameId}/rounds/${round.id}/guesses/`
  );
  const { response: phraseResponse } = useApiQuery<GetPhraseResponse>(
    `/api/games/${gameId}/phrases/${round.phraseId}/`
  );
  return (
    response &&
    phraseResponse && (
      <PageWrapper>
        <LettersRow pastGuesses={response.items} phrase={phraseResponse.value} />
        <Typography.Title level={3}>This phrase has been guessed</Typography.Title>
      </PageWrapper>
    )
  );
}

export default RoundEndPage;
