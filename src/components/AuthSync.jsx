
import { useRef } from 'react';
import { useSubscribeToJwtAuthWithFlag } from '@privy-io/react-auth';
import useStore from '../store/useStore';

const AuthSync = () => {
  const { isAuthenticated, token, isLoading } = useStore();
  const hasSyncedOnceRef = useRef(false);

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading,
    getExternalJwt: async () => {
      // Only provide a JWT to Privy once per session to avoid repeated
      // /custom_jwt_account/authenticate and /sessions/logout calls.
      if (!isAuthenticated || isLoading || !token) {
        return null;
      }
      if (hasSyncedOnceRef.current) {
        return null;
      }
      hasSyncedOnceRef.current = true;
      return token;
    }
  });

  return null;
};

export default AuthSync;
