import { ReactNode } from 'react';

import { ErrorCodes, FieldErrorCodes } from 'utils/enums';

export type Path = (string | number)[];
export interface ValidationErrorDetail {
  path: Path;
  fieldErrorCode: FieldErrorCodes;
  extraData: object;
}

export interface DefaultErrorDetail {}

export interface ErrorData<TResError> {
  errorDetails: TResError;
  validationErrorDetails: ValidationErrorDetail[];
}

export type HttpResponse<TResPayload, TResError> =
  | HttpResponseSuccess<TResPayload>
  | HttpResponseFailure<TResError>;

export interface HttpResponseSuccess<TResPayload> {
  code: ErrorCodes.NoError;
  data: TResPayload;
}

export interface HttpResponseFailure<TResError> {
  code: Exclude<ErrorCodes, ErrorCodes.NoError>;
  data: ErrorData<TResError>;
}

export interface RequestParams {
  [key: string]: string | number | string[] | number[];
}

export interface Option {
  skip?: boolean;
  requestOption?: RequestOption;
  infiniteListOption?: InfiniteListOption;
  shouldThrowError?: (error: Error) => boolean;
  shouldAbortOnCancel?: boolean;
}

export interface InfiniteListOption {
  onResetPage?: () => void;
  pageSize?: number;
  batchSize?: number;
}

export interface RequestOption {
  header?: object;
  init?: object;
}

export interface ClosableComponentProps {
  isOpen: boolean;
  handleClose: () => void;
}

export interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalEntriesSize: number;
  currentEntriesSize: number;
  dbEntriesSize: number;
}

export interface PaginatedResponse {
  pagination: Pagination;
}

export interface CreationResponse {
  id: number;
}

export interface GameParams {
  gameId: string;
}

export interface RoundParams {
  gameId: string;
  roundId: string;
}
