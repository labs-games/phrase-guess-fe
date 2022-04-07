import useApiQuery from 'hooks/useApiQuery';
import { RequestParams, Option } from 'utils/interfaces';

const useThrowableQuery = <TResPayload,>(url: string, params?: RequestParams, options?: Option) => {
  const { error, ...rest } = useApiQuery<TResPayload>(url, params, options);

  if (error) {
    throw error;
  }

  return rest;
};

export default useThrowableQuery;
