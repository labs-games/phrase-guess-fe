import { useRef, useEffect } from 'react';

const useUnmountedRef = () => {
  const unmountedRef = useRef(false);

  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    []
  );

  return unmountedRef;
};

export default useUnmountedRef;
