import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import useEventCallback from 'hooks/useEventCallback';
import useRefreshKey from 'hooks/useRefreshKey';

interface TimerContextShape {
  countdown: number;
  reset: () => void;
  isTimeout: boolean;
}

const TimerContext = createContext<TimerContextShape>(null);
export const useTimerContext = () => useContext(TimerContext);

interface TimerProviderProps {
  children: ReactNode;
}

function TimerProvider({ children }: TimerProviderProps) {
  const startTime = 3;

  const [countdown, setCountdown] = useState(startTime);
  const reduceCountdown = useEventCallback(() => {
    if (countdown > 0) {
      setCountdown(c => c - 1);
    }
  });

  const { refreshKey, refresh } = useRefreshKey();
  useEffect(() => {
    const timer = setInterval(reduceCountdown, 1000);
    return () => clearInterval(timer);
  }, [reduceCountdown, refreshKey]);

  const reset = useEventCallback(() => {
    setCountdown(startTime);
    refresh();
  });

  return (
    <TimerContext.Provider value={{ countdown, reset, isTimeout: countdown === 0 }}>
      {children}
    </TimerContext.Provider>
  );
}

export default TimerProvider;
