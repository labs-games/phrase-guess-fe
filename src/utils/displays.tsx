import { GuessTypes, Orderings } from './enums';

export const OrderingDisplays = {
  [Orderings.ordered]: 'Ordered',
  [Orderings.random]: 'Random',
};

export const GuessTypeDisplays = {
  [GuessTypes.letter]: 'Letter',
  [GuessTypes.phrase]: 'Phrase',
  [GuessTypes.timedOut]: 'Timed Out',
};
