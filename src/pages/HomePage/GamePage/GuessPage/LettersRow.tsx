import React from 'react';

import styled from 'styled-components';

import { Guess } from 'utils/apiResponseShapes';
import { GuessStatuses, GuessTypes } from 'utils/enums';

const RowWrapper = styled.div`
  padding: 24px;
  border: 1px solid black;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
`;

const WordWrapper = styled.div`
  margin-right: 48px;

  > pre {
    font-family: 'Courier New', sans-serif;
    font-size: 36px;
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
    if (hasLetterGuessed || isPhraseGuessed) {
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
      {phrase.split(' ').map((word, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <WordWrapper key={`${word}-${idx}`}>
          <pre>{transformPhrase(word, pastGuesses)}</pre>
        </WordWrapper>
      ))}
    </RowWrapper>
  );
}

export default LettersRow;
