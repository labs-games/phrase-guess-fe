import React, { ReactNode } from 'react';

import ErrorBoundary from 'components/boundaries/ErrorBoundary';
import { ErrorCodes } from 'utils/enums';
import { FetchError } from 'utils/errors';

const isUnauthenticated = (error: Error | null) =>
  error instanceof FetchError && error?.code === ErrorCodes.Unauthenticated;

function UnauthenticatedFallback({ error }: { error: Error | null }): null {
  if (isUnauthenticated(error)) {
    return null;
  }

  throw error;
}

export interface UnauthenticatedBoundaryProps {
  children: ReactNode;
  login: Function;
}

function UnauthenticatedBoundary({ children, login }: UnauthenticatedBoundaryProps) {
  return (
    <ErrorBoundary
      onError={(error: Error) => {
        if (isUnauthenticated(error)) {
          login();
        }
      }}
      renderFallback={({ error }) => <UnauthenticatedFallback error={error} />}
    >
      {children}
    </ErrorBoundary>
  );
}

export default UnauthenticatedBoundary;
