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

export interface GetGamesResponse extends PaginatedResponse {
  items: Game[];
}
