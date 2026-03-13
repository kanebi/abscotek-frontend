import { PrivyProvider } from '@privy-io/react-auth';
import { env } from './env';

export const privyAppId = env.PRIVY_APP_ID;
if (!privyAppId) {
  throw new Error('VITE_PRIVY_APP_ID is not defined. Please set it in .env or Cloud Run environment variables');
}

/** Client ID for this app client (optional for web; recommended for allowed origins, session, OAuth). From Privy Dashboard > Configuration > App settings > Clients. */
export const privyClientId = env.PRIVY_CLIENT_ID || undefined;

export const PrivyConfig = {
  appId: privyAppId,
  clientId: privyClientId,
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