import { useAuthContext } from 'components/Auth';
import useEventCallback from 'hooks/useEventCallback';
import { ErrorCodes } from 'utils/enums';
import { FetchError } from 'utils/errors';
import { DefaultErrorDetail } from 'utils/interfaces';

interface useFetchErrorHandlerProps<TResPayload, TResError> {
  specificHandlers?: { [key in ErrorCodes]?: (error: FetchError<TResPayload, TResError>) => void };
  defaultHandler: () => void;
}

function useFetchErrorHandler<TResPayload, TResError = DefaultErrorDetail>({
  specificHandlers = {},
  defaultHandler,
}: useFetchErrorHandlerProps<TResPayload, TResError>) {
  const handleError = useEventCallback(error => {
    if (error instanceof FetchError && specificHandlers[error.code] !== undefined) {
      const handleSpecificError = specificHandlers[error.code];
      handleSpecificError(error);
      return;
    }

    defaultHandler();
  });
  return { handleError };
}

export function useLoggedInFetchErrorHandler<TResPayload, TResError = DefaultErrorDetail>({
  specificHandlers = {},
  defaultHandler,
}: useFetchErrorHandlerProps<TResPayload, TResError>) {
  const { login } = useAuthContext();

  const handlers = {
    [ErrorCodes.Unauthenticated]: () => login(),
    ...specificHandlers,
  };

  return useFetchErrorHandler<TResPayload, TResError>({
    specificHandlers: handlers,
    defaultHandler,
  });
}

export default useFetchErrorHandler;
