import { useState } from 'react';

import useEventCallback from 'hooks/useEventCallback';

function useRefreshKey() {
  const [refreshKey, setRefreshKey] = useState(0);
  return {
    refreshKey,
    refresh: useEventCallback(() => setRefreshKey(r => (r + 1) % 1000000)),
  };
}

export default useRefreshKey;
