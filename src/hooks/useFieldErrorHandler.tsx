import { ReactNode, useState } from 'react';

import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import slice from 'lodash/slice';

import useEventCallback from 'hooks/useEventCallback';
import { DEFAULT_ERROR_MESSAGE } from 'utils/constants';
import { ErrorCodes, FieldErrorCodes } from 'utils/enums';
import { FetchError } from 'utils/errors';
import { ValidationErrorDetail, Path } from 'utils/interfaces';

export const DefaultErrorMessages = {
  [FieldErrorCodes.FieldRequired]: 'Mandatory field is required',
  [FieldErrorCodes.FieldInvalid]: 'Invalid value',
  [FieldErrorCodes.FieldBelowMinLength]: 'This is too short',
  [FieldErrorCodes.FieldAboveMaxLength]: 'This is too long',
  [FieldErrorCodes.FieldBelowMinItems]: 'Please select more items',
  [FieldErrorCodes.FieldAboveMaxItems]: 'Please select less items',
};

export enum SpecificErrorMessageTypes {
  path = 1,
  subpath = 2,
}

export interface SpecificErrorMessage {
  path: Path;
  type?: SpecificErrorMessageTypes;
  fieldErrorCode: FieldErrorCodes;
  message: ReactNode;
}

interface useFieldErrorHandlerProps {
  specificMessages?: SpecificErrorMessage[];
}

const isSubpathOf = <T,>(subpathCandidate: T[], path: T[]): boolean =>
  subpathCandidate.length >= path.length && isEqual(slice(subpathCandidate, 0, path.length), path);

function useFieldErrorHandler<TResPayload>({ specificMessages = [] }: useFieldErrorHandlerProps) {
  const [errorDetails, setErrorDetails] = useState([]);

  const refreshError = useEventCallback(() => setErrorDetails([]));
  const removeAllSubPathErrors = useEventCallback((path: Path) =>
    setErrorDetails(curr => curr.filter(d => !isSubpathOf(d.path, path)))
  );
  const handleError = useEventCallback((error: FetchError<TResPayload>) => {
    refreshError();
    if (error.code !== ErrorCodes.ValidationError) {
      throw error;
    }

    if (error.validationErrorDetails) {
      setErrorDetails(error.validationErrorDetails);
    }
  });

  const getErrorMessage = useEventCallback((path: Path): ReactNode => {
    const errorDetail = find<ValidationErrorDetail>(errorDetails, detail =>
      isEqual(detail.path, path)
    );
    if (errorDetail === undefined) {
      return null;
    }

    const specificMessageDetail = find<SpecificErrorMessage>(specificMessages, detail => {
      if (detail.fieldErrorCode !== errorDetail.fieldErrorCode) {
        return false;
      }
      return (
        isEqual(path, detail.path) ||
        (detail.type === SpecificErrorMessageTypes.subpath && isSubpathOf(path, detail.path))
      );
    });

    if (specificMessageDetail === undefined) {
      return DefaultErrorMessages[errorDetail.fieldErrorCode] || DEFAULT_ERROR_MESSAGE;
    }
    return specificMessageDetail.message;
  });

  return { refreshError, handleError, getErrorMessage, removeAllSubPathErrors };
}

export default useFieldErrorHandler;
