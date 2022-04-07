import React from 'react';

import styled from 'styled-components';

import { Row } from 'components/common';
import { Guess } from 'utils/apiResponseShapes';
import { GuessStatuses } from 'utils/enums';

const StyledRow = styled(Row)`
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const WrongGuess = styled.div`
  font-size: 20px;
  color: red;
  border: 1px solid black;
  padding: 0 8px;
`;

interface WrongGuessesRowProps {
  pastGuesses: Guess[];
}

function WrongGuessesRow({ pastGuesses }: WrongGuessesRowProps) {
  return (
    <StyledRow>
      {pastGuesses
        .filter(g => g.status === GuessStatuses.wrong)
        .map(g => (
          <WrongGuess>{g.value}</WrongGuess>
        ))}
    </StyledRow>
  );
}

export default WrongGuessesRow;
