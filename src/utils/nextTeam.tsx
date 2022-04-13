import findIndex from 'lodash/findIndex';
import last from 'lodash/last';

import { Guess, Round } from './apiResponseShapes';
import { GuessTypes } from './enums';

export const getNextTeamIdToGuess = (teamIdOrderings: number[], pastGuesses: Guess[]): number => {
  const nonPhraseGuesses = pastGuesses.filter(g => g.type !== GuessTypes.phrase);
  if (nonPhraseGuesses.length === 0) {
    return teamIdOrderings[0];
  }

  const lastGuess = last(nonPhraseGuesses);
  const lastTeamId = lastGuess.teamId;
  const lastTeamIndex = findIndex(teamIdOrderings, id => id === lastTeamId);
  if (lastTeamIndex === undefined) {
    return teamIdOrderings[0];
  }

  const nextTeamIndex = (lastTeamIndex + 1) % teamIdOrderings.length;
  return teamIdOrderings[nextTeamIndex];
};

export const getNextTeamIdToStartRound = (
  teamIdOrderings: number[],
  pastRounds: Round[]
): number => {
  const noOfPastRounds = pastRounds.length;
  const noOfTeams = teamIdOrderings.length;
  return teamIdOrderings[noOfPastRounds % noOfTeams];
};
