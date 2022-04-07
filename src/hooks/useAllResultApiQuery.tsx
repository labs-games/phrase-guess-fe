import { useState } from 'react';

import useApiQuery from 'hooks/useApiQuery';
import useEventCallback from 'hooks/useEventCallback';
import usePagination from 'hooks/usePagination';
import useUpdateEffect from 'hooks/useUpdateEffect';
import { Option, RequestParams, DefaultErrorDetail, PaginatedResponse } from 'utils/interfaces';

const useAllResultApiQuery = <
  TResPayload extends PaginatedResponse,
  TDataPayload,
  TResError = DefaultErrorDetail
>(
  url: string,
  getThisPageData: (payload: TResPayload) => TDataPayload[] = () => [],
  params: RequestParams = {},
  { infiniteListOption: { pageSize = 100, onResetPage = () => {} } = {}, ...options }: Option = {}
) => {
  const [lastResponse, setLastResponse] = useState<TResPayload | null>(null);
  const [data, setData] = useState<TDataPayload[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const { apiParams, setPage, page } = usePagination({
    dependencies: [params, url],
    pageSize,
    onPageReset: useEventCallback(() => {
      setIsFinished(false);
      setData([]);
      onResetPage();
    }),
  });

  const { refresh, response, loading, error } = useApiQuery<TResPayload, TResError>(
    url,
    { ...params, ...apiParams },
    options
  );
  const triggerNextPageSearch = useEventCallback(() => {
    if (isFinished || loading) {
      return;
    }
    setPage(page + 1);
  });

  useUpdateEffect(() => {
    if (!response) {
      return;
    }

    setLastResponse(response);
    const thisPageData = getThisPageData(response);
    setData(arr => (page === 1 ? thisPageData : arr.concat(thisPageData)));
    if (page >= response.pagination.totalPages && !error) {
      setIsFinished(true);
    }
  }, [response, setIsFinished]);

  return {
    data,
    error,
    lastResponse,
    refresh,
    loading,
    isFinished,
    triggerNextPageSearch,
  };
};

export default useAllResultApiQuery;
