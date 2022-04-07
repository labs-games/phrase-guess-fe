import React from 'react';

import styled from 'styled-components';

import { Typography } from 'antd';

import useApiQuery from 'hooks/useApiQuery';
import { GetResourcesResponse, Guess, Round } from 'utils/apiResponseShapes';

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
  return (
    response && (
      <PageWrapper>
        <LettersRow pastGuesses={response.items} round={round} gameId={gameId} />
        <Typography.Title level={3}>This phrase has been guessed</Typography.Title>
      </PageWrapper>
    )
  );
}

export default RoundEndPage;
