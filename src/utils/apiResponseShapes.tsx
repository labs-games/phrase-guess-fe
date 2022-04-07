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
