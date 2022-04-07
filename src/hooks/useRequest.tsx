import useAsync from 'hooks/useAsync';
import useEventCallback from 'hooks/useEventCallback';
import useUnmountedRef from 'hooks/useUnmountedRef';
import { HttpMethod } from 'utils/enums';
import { RequestOption, DefaultErrorDetail } from 'utils/interfaces';
import { forever } from 'utils/promise';
import request from 'utils/request';

const useBaseSafeRequest = <TResPayload, TResError = DefaultErrorDetail>() => {
  const unmountedRef = useUnmountedRef();
  return useEventCallback(
    async (url: string, method: HttpMethod, data: any, options: RequestOption) => {
      const res = await request<TResPayload, TResError>(url, method, data, options);
      if (unmountedRef.current) await forever;

      return res;
    }
  );
};

const useRequest = <TResPayload, TResError = DefaultErrorDetail>() => {
  const result = useAsync(useBaseSafeRequest<TResPayload, TResError>());
  return result;
};

export default useRequest;
