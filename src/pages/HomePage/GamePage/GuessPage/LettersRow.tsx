import React from 'react';

import styled from 'styled-components';

import { Guess } from 'utils/apiResponseShapes';
import { GuessStatuses, GuessTypes } from 'utils/enums';

const RowWrapper = styled.div`
  padding: 24px;
  border: 1px solid black;
  margin-bottom: 24px;
  font-size: 36px;

  > pre {
    white-space: break-spaces;
    margin-bottom: 0;
  }
`;

interface LettersRowProps {
  pastGuesses: Guess[];
  phrase: string;
}

const transformPhrase = (phrase: string, pastGuesses: Guess[]): string => {
  const isPhraseGuessed =
    pastGuesses.find(g => g.status === GuessStatuses.correct && g.type === GuessTypes.phrase) !==
    undefined;
  let transformedPhrase = '';
  for (const char of phrase) {
    const hasLetterGuessed = pastGuesses.find(g => g.value === char) !== undefined;
    if (char === ' ') {
      transformedPhrase += '  ';
    } else if (hasLetterGuessed || isPhraseGuessed) {
      transformedPhrase += `${char} `;
    } else {
      transformedPhrase += '_ ';
    }
  }
  return transformedPhrase;
};

function LettersRow({ pastGuesses, phrase }: LettersRowProps) {
  return (
    <RowWrapper>
      <pre>{transformPhrase(phrase, pastGuesses)}</pre>
    </RowWrapper>
  );
}

export default LettersRow;
