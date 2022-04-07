import { useRef, useEffect, EffectCallback } from 'react';

export default function useUpdateEffect(cb: EffectCallback, deps: any[]) {
  const mountedRef = useRef(false);

  useEffect(
    () => {
      if (mountedRef.current) {
        return cb();
      }
      mountedRef.current = true;
      return undefined;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}
