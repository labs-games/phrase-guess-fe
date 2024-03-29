import camelCase from 'lodash/camelCase';

import { ErrorCodes } from 'utils/enums';
import { DefaultErrorDetail, HttpResponse, ValidationErrorDetail } from 'utils/interfaces';

class FetchError<TResPayload, TResError = DefaultErrorDetail> extends Error {
  code: ErrorCodes;

  validationErrorDetails?: ValidationErrorDetail[];

  data?: TResPayload;

  errorDetails?: TResError;

  constructor(response: HttpResponse<TResPayload, TResError>) {
    super();
    this.code = response.code;
    this.validationErrorDetails =
      response.code === ErrorCodes.NoError
        ? undefined
        : response.data.validationErrorDetails?.map(detail => ({
            ...detail,
            path: detail.path.map(val => (typeof val === 'string' ? camelCase(val) : val)),
          }));
    this.data = response.code === ErrorCodes.NoError ? response.data : undefined;
    this.errorDetails =
      response.code === ErrorCodes.NoError ? undefined : response.data.errorDetails;
  }
}

export default FetchError;
