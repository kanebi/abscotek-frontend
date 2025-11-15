#!/bin/sh
# Generate runtime config from environment variables for Cloud Run

cat > /app/config.js << EOF
// Runtime configuration generated from environment variables
window.ENV_CONFIG = {
  VITE_API_URL: '${VITE_API_URL:-http://localhost:5832/}',
  VITE_PRIVY_APP_ID: '${VITE_PRIVY_APP_ID:-}',
  VITE_PRIVY_CLIENT_ID: '${VITE_PRIVY_CLIENT_ID:-}',
  VITE_APP_EXCHANGE_RATE_API_KEY: '${VITE_APP_EXCHANGE_RATE_API_KEY:-}',
  VITE_PAYSTACK_PUBLIC_KEY: '${VITE_PAYSTACK_PUBLIC_KEY:-}',
  VITE_GOOGLE_PLACES_API_KEY: '${VITE_GOOGLE_PLACES_API_KEY:-}',
  VITE_PROJECT_ID: '${VITE_PROJECT_ID:-}'
};
EOF

echo "Runtime configuration generated successfully"
cat /app/config.js
