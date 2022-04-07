import React from 'react';

import { useParams } from 'react-router-dom';

import { Typography } from 'antd';

import { Paper } from 'components/common';
import useApiQuery from 'hooks/useApiQuery';
import { GetGameResponse } from 'utils/apiResponseShapes';
import { GameParams } from 'utils/interfaces';

function InfoPage() {
  const { gameId } = useParams<GameParams>();
  const { response } = useApiQuery<GetGameResponse>(`/api/games/${gameId}/`);

  return (
    response && (
      <Paper>
        <Typography.Title level={2}>Welcome to {response.name}</Typography.Title>
      </Paper>
    )
  );
}

export default InfoPage;
