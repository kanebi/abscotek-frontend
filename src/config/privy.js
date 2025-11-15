import { PrivyProvider } from '@privy-io/react-auth';
import { env } from './env';

export const privyAppId = env.PRIVY_APP_ID;
if (!privyAppId) {
  throw new Error('VITE_PRIVY_APP_ID is not defined. Please set it in .env or Cloud Run environment variables');
}

export const PrivyConfig = {
  appId: privyAppId,
  config: {
    // Add any additional config here
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
    loginMethods: ['wallet', 'email', 'sms'],
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
    },
  },
};