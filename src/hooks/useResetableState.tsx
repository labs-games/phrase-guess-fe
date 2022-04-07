import { useState } from 'react';

import useEventCallback from 'hooks/useEventCallback';

function useResetableState<T = unknown>(initialState: T): [T, (nextState: T) => void, () => void] {
  const [state, setState] = useState<T>(initialState);
  const resetState = useEventCallback(() => setState(initialState));
  return [state, setState, resetState];
}

export default useResetableState;
