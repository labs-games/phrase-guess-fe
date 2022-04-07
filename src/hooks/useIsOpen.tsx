import { useState } from 'react';

import useEventCallback from 'hooks/useEventCallback';

const useIsOpen = ({ initialIsOpen = false } = {}): [
  boolean,
  (shouldOpen: boolean) => void,
  () => void
] => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const handleClose = useEventCallback(() => setIsOpen(false));

  return [isOpen, setIsOpen, handleClose];
};

export default useIsOpen;
