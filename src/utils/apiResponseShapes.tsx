import { Ordering } from './enums';
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
  phraseOrder: Ordering;
  teamOrder: Ordering;
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
