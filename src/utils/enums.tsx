export enum ErrorCodes {
  NoError = 0,
  UnknownError = 1,
  Unauthenticated = 2,
  PermissionDenied = 3,
  BadRequestError = 4,
  ValidationError = 5,
  ResourceNotFound = 6,
  ExternalRequestError = 7,
  EmptyTeams = 10001,
  PhrasesAllUsed = 10002,
  SomeRoundStillOngoing = 10003,
}

export enum FieldErrorCodes {
  FieldRequired = 1,
  FieldInvalid = 2,
  FieldBelowMinLength = 3,
  FieldAboveMaxLength = 4,
  FieldBelowMinItems = 5,
  FieldAboveMaxItems = 6,
}

export type HttpMethod = 'get' | 'post' | 'patch' | 'delete';
export type HttpRequestStatus = 'idle' | 'pending' | 'success' | 'failed';

export enum Orderings {
  ordered = 1,
  random = 2,
}

export enum GuessTypes {
  letter = 1,
  phrase = 2,
}

export enum GuessStatuses {
  correct = 1,
  wrong = 2,
}
