// Environment configuration utility
// This handles both build-time (Vite) and runtime (Cloud Run) environment variables

const getEnvVar = (key, defaultValue = '') => {
  // First try runtime config (for Cloud Run)
  if (typeof window !== 'undefined' && window.ENV_CONFIG && window.ENV_CONFIG[key]) {
    return window.ENV_CONFIG[key];
  }
  
  // Fall back to Vite build-time env vars
  if (import.meta.env[key]) {
    return import.meta.env[key];
  }
  
  return defaultValue;
};

export const ENV = {
  API_URL: getEnvVar('VITE_API_URL', 'http://localhost:5832/'),
  PRIVY_APP_ID: getEnvVar('VITE_PRIVY_APP_ID'),
  PRIVY_CLIENT_ID: getEnvVar('VITE_PRIVY_CLIENT_ID'),
  EXCHANGE_RATE_API_KEY: getEnvVar('VITE_APP_EXCHANGE_RATE_API_KEY'),
  PAYSTACK_PUBLIC_KEY: getEnvVar('VITE_PAYSTACK_PUBLIC_KEY'),
  GOOGLE_PLACES_API_KEY: getEnvVar('VITE_GOOGLE_PLACES_API_KEY'),
  PROJECT_ID: getEnvVar('VITE_PROJECT_ID', ''),
};

export default ENV;
