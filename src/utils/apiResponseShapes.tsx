import { GuessStatuses, GuessTypes, Orderings } from './enums';
import { PaginatedResponse } from './interfaces';

export interface GetMeResponse {
  id: number;
  username: string;
  isActive: boolean;
}

export interface User {
  id: number;
  username: string;
}

export interface LoginResponse {
  sessionToken: string;
}

export interface Game {
  id: number;
  name: string;
  phraseOrder: Orderings;
  teamOrder: Orderings;
}

export interface GetResourcesResponse<Resource> extends PaginatedResponse {
  items: Resource[];
}

export interface TeamLeaderboard {
  teamId: number;
  totalScore: number;
}

export interface GetGameResponse extends Game {
  leaderboard: TeamLeaderboard[];
}

export interface Team {
  id: number;
  name: string;
}

export interface Phrase {
  id: number;
  value: string;
}

export interface Round {
  id: number;
  name: string;
  isEnded: boolean;
  phraseId: number;
  teamOrdering: number[];
}

export interface GetRoundResponse extends Round {}

export interface GetPhraseResponse extends Phrase {}

export interface Guess {
  id: number;
  teamId: number;
  type: GuessTypes;
  status: GuessStatuses;
  value: string;
  score: number;
}

export interface CreateGuessResponse {
  status: GuessStatuses;
  score: number;
  teamId: number;
  shouldEnd: boolean;
}
