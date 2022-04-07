import React, { createContext, ReactNode, useCallback, useContext } from 'react';

import UnauthenticatedBoundary from 'components/boundaries/UnauthenticatedBoundary';
import useApiQuery from 'hooks/useApiQuery';
import { User, GetMeResponse } from 'utils/apiResponseShapes';

type LoginCallback = () => void;

interface AuthContextShape {
  user: User;
  login: LoginCallback;
  isAuthenticating: boolean;
}

const AuthContext = createContext<AuthContextShape>(null);
export const useAuthContext = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  login: LoginCallback;
}

function AuthProvider({ children, login }: AuthProviderProps) {
  const { response, loading: isAuthenticating } = useApiQuery<GetMeResponse>('/api/me/');

  if (isAuthenticating) return null;

  return (
    <AuthContext.Provider
      value={{
        user: { id: response.id, username: response.username },
        login,
        isAuthenticating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function Auth({ children }: { children: ReactNode }) {
  const login = useCallback(() => {
    window.location.href = `/login`;
  }, []);

  return (
    <UnauthenticatedBoundary login={login}>
      <AuthProvider login={login}>{children}</AuthProvider>
    </UnauthenticatedBoundary>
  );
}

export default Auth;
