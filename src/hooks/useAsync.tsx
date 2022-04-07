import { useState } from 'react';

import useEventCallback from 'hooks/useEventCallback';
import { HttpRequestStatus } from 'utils/enums';

const useAsync = <T extends unknown[], U>(asyncCb: (...args: T) => U) => {
  const [status, setStatus] = useState<HttpRequestStatus>('idle');

  const request = useEventCallback(async (...args: T) => {
    try {
      setStatus('pending');
      const result = await asyncCb(...args);

      setStatus('success');
      return result;
    } catch (err) {
      setStatus('failed');
      throw err;
    }
  });

  return {
    request,
    status,
    pending: status === 'pending',
  };
};

export default useAsync;
