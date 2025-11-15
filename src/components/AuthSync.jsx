
import { useSubscribeToJwtAuthWithFlag } from '@privy-io/react-auth';
import useStore from '../store/useStore';

const AuthSync = () => {
  const { isAuthenticated, token, isLoading } = useStore();

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading,
    getExternalJwt: async () => {
      if (isAuthenticated) {
        return token;
      }
      return null;
    }
  });

  return null;
};

export default AuthSync;
