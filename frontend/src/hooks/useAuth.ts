import { useAuthContext } from '../contexts/AuthContext';

/**
 * Hook to access authentication state and actions.
 * Re-exports from AuthContext for convenience.
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
