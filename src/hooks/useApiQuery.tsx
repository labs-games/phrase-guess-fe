import useQuery from 'hooks/useQuery';
import { Option, RequestParams, DefaultErrorDetail } from 'utils/interfaces';
import joinUrlParams from 'utils/joinUrlParams';
import request from 'utils/request';

/**
 * Declarative get request - similar to Relay GraphQL.
 */
const useApiQuery = <TResPayload, TResError = DefaultErrorDetail>(
  url: string,
  params?: RequestParams,
  { shouldAbortOnCancel = true, ...options }: Option = {}
) => {
  const paramsObj = params || {};
  const { requestOption = {} } = options;

  const result = useQuery<TResPayload>(
    [url, paramsObj],
    ({ cancelRef }) => {
      const controller = new AbortController();

      if (shouldAbortOnCancel) {
        // eslint-disable-next-line no-param-reassign
        cancelRef.current = () => controller.abort();
      }
      return request<TResPayload, TResError>(joinUrlParams(url, params), 'get', null, {
        ...requestOption,
        init: { signal: controller.signal },
      });
    },
    options
  );

  return result;
};

export default useApiQuery;
