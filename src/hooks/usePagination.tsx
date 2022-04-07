import { useState } from 'react';

import isEqual from 'lodash/isEqual';

import useControlProp from 'hooks/useControlProp';
import useEventCallback from 'hooks/useEventCallback';
import useLocalStorage from 'hooks/useLocalStorage';
import { DEFAULT_PER_PAGE } from 'utils/constants';

type SetPageCallback = (page: number) => void;
type SetPageSizeCallback = (pageSize: number) => void;
type HandleOverstepPageCallback = (totalPages: number) => void;

interface usePaginationProps {
  dependencies?: any[];
  page?: number;
  setPage?: SetPageCallback;
  pageSize?: number;
  setPageSize?: SetPageSizeCallback;
  onPageReset?: () => void;
  initialPage?: number;
}

export interface PaginationParams {
  current: number;
  onChange: SetPageCallback;
  pageSize: number;
  onPageSizeChange: SetPageSizeCallback;
}

export interface ApiParams {
  page: number;
  perPage: number;
}

export interface UsePaginationReturn {
  apiParams: ApiParams;
  paginationParams: PaginationParams;
  page: number;
  setPage: SetPageCallback;
  pageSize: number;
  setPageSize: SetPageSizeCallback;
  handleOverstepPage: HandleOverstepPageCallback;
}

function usePagination({
  dependencies = [],
  page,
  setPage,
  pageSize,
  setPageSize,
  onPageReset,
  initialPage = 1,
}: usePaginationProps): UsePaginationReturn {
  const [pageState, setPageState] = useControlProp(page, initialPage, setPage);
  const [previousDependencies, setPreviousDependencies] = useState(dependencies);
  const resetPage = useEventCallback(() => {
    setPageState(1);
    if (onPageReset) {
      onPageReset();
    }
  });

  const [uncontrolledPageSizeState, setUncontrolledPageSizeState] = useLocalStorage<number>({
    key: 'page-size',
    initialValue: DEFAULT_PER_PAGE,
  });
  const pageSizeState = pageSize !== undefined ? pageSize : uncontrolledPageSizeState;
  const setPageSizeState = (newPageSize: number) => {
    setUncontrolledPageSizeState(newPageSize);
    if (setPageSize) {
      setPageSize(newPageSize);
    }
    resetPage();
  };

  if (!isEqual(previousDependencies, dependencies)) {
    setPreviousDependencies(dependencies);
    resetPage();
  }

  const handleOverstepPage = useEventCallback((totalPages: number) => {
    if (totalPages && pageState > totalPages) {
      setPageState(totalPages);
    }
  });

  return {
    paginationParams: {
      current: pageState,
      onChange: setPageState,
      pageSize: pageSizeState,
      onPageSizeChange: setPageSizeState,
    },
    apiParams: {
      page: pageState,
      perPage: pageSizeState,
    },
    page: pageState,
    setPage: setPageState,
    pageSize: pageSizeState,
    setPageSize: setPageSizeState,
    handleOverstepPage,
  };
}

export default usePagination;
