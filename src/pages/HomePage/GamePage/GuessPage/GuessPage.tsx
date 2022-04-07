import React from 'react';

import { useParams } from 'react-router-dom';

import { PageHeader } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import { GetRoundResponse } from 'utils/apiResponseShapes';
import { RoundParams } from 'utils/interfaces';

import RoundEndPage from './RoundEndPage';
import RoundOngoingPage from './RoundOngoingPage';

function GuessPage() {
  const { roundId, gameId } = useParams<RoundParams>();
  const { response } = useApiQuery<GetRoundResponse>(`/api/games/${gameId}/rounds/${roundId}/`);
  return (
    response && (
      <Paper>
        <PageHeader title={response.name} />
        {response.isEnded ? (
          <RoundEndPage round={response} gameId={+gameId} />
        ) : (
          <RoundOngoingPage round={response} gameId={+gameId} />
        )}
      </Paper>
    )
  );
}

export default GuessPage;
