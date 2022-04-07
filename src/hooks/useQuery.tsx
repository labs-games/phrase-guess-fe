import { DependencyList, MutableRefObject, useReducer } from 'react';

import useDeepCompareEffect from 'use-deep-compare-effect';

import useEventCallback from 'hooks/useEventCallback';
import { NetworkError } from 'utils/errors';
import { Option } from 'utils/interfaces';

import useRefreshKey from './useRefreshKey';

interface ReducerState<TResPayload> {
  response: TResPayload | null;
  loading: boolean;
  error: Error | null;
}

type ReducerAction<TResPayload> =
  | { type: 'pending' }
  | { type: 'success'; response: TResPayload }
  | { type: 'failed'; error: Error };

interface QueryInput {
  cancelRef: MutableRefObject<() => void>;
}

/**
 * Low-level declarative fetching (similar to react-query).
 *
 * Normally, adding new option is not encouraged because most
 * of the times it leads to too many cases.
 * However, `skip` option is very important because there's no
 * way to prevent request being sent unless:
 *
 * - You don't mount the component - may be too restrictive
 *   especially for animation.
 *
 * - Get around with not updating state - this is of course
 *   a really bad solution because it complicates the logic
 *   and will still request at least once on mount.
 */
const useQuery = <TResPayload,>(
  dependency: DependencyList,
  query: (inp: QueryInput) => Promise<TResPayload>,
  { skip = false, shouldThrowError = error => !(error instanceof NetworkError) }: Option = {}
) => {
  const [state, dispatch] = useReducer(
    (
      st: ReducerState<TResPayload>,
      action: ReducerAction<TResPayload>
    ): ReducerState<TResPayload> => {
      switch (action.type) {
        case 'pending':
          return { ...st, loading: true, error: null };
        case 'success':
          return { ...st, loading: false, response: action.response };
        case 'failed':
          return { ...st, loading: false, error: action.error };
        default:
          throw new Error('Unexpected action');
      }
    },
    {
      response: null,
      error: null,
      loading: true,
    }
  );

  const { refreshKey, refresh } = useRefreshKey();
  if (state.error && shouldThrowError(state.error)) {
    throw state.error;
  }

  useDeepCompareEffect(() => {
    if (skip) return undefined;

    dispatch({ type: 'pending' });

    let cancelled = false;

    const cancelRef = { current: () => {} };
    const promise = query({ cancelRef });
    // Don't do `const promise = query(...).then(...)` since
    // it will lose the cancellation.
    promise
      .then(res => !cancelled && dispatch({ type: 'success', response: res }))
      .catch(err => !cancelled && dispatch({ type: 'failed', error: err }));

    return () => {
      cancelRef.current();
      cancelled = true;
    };
  }, [dependency, skip, refreshKey]);

  return {
    ...state,
    refresh,
    updateResponse: useEventCallback((updater: (payload: TResPayload) => TResPayload) =>
      dispatch({ type: 'success', response: updater(state.response) })
    ),
  };
};

export default useQuery;
