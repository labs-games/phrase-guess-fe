import { useState } from 'react';

import useEventCallback from './useEventCallback';

export default function useControlProp<T extends unknown>(
  prop?: T,
  initial?: T,
  handler?: (value: T) => void
): [T, (value: T) => void] {
  const [valueState, setValueState] = useState(initial);
  const isControlled = prop !== undefined;
  const value = (isControlled ? prop : valueState) as T;

  const setValue = useEventCallback((next: T) => {
    if (!isControlled) {
      setValueState(next);
    }

    if (handler) {
      handler(next);
    }
  });

  return [value, setValue];
}
