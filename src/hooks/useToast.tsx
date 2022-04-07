import { message } from 'antd';

import useEventCallback from './useEventCallback';

interface useToastProps {
  actionName: string;
}

function useToast({ actionName = 'Action' }: useToastProps) {
  const handleSuccess = useEventCallback(() => message.success(`${actionName} successful!`));
  const handleError = useEventCallback(() =>
    message.error(`${actionName} failed. Please contact developer for debugging`)
  );
  return { success: handleSuccess, error: handleError };
}

export default useToast;
