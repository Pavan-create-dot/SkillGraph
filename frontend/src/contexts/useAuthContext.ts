import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './authContextState';

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
