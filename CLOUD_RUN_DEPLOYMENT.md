# Google Cloud Run Deployment Guide

## Environment Variables Configuration

The frontend now supports runtime environment variables for Cloud Run deployment.

### How It Works

1. **Build Time**: The app is built with default values from `public/config.js`
2. **Runtime**: When the container starts, `generate-config.sh` creates a new `config.js` from environment variables
3. **Application**: The app reads from `window.ENV_CONFIG` which is populated at runtime

### Required Environment Variables

Set these in your Cloud Run service:

```bash
VITE_API_URL=https://your-backend-api.run.app/
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PRIVY_CLIENT_ID=your_privy_client_id
VITE_APP_EXCHANGE_RATE_API_KEY=your_exchange_rate_key
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key
VITE_GOOGLE_PLACES_API_KEY=your_google_places_key
VITE_PROJECT_ID=your_project_id
```

### Deployment Commands

#### 1. Build and Push Docker Image

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id
export REGION=us-central1
export SERVICE_NAME=abscotek-frontend

# Build the image
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest .

# Push to Google Container Registry
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
```

#### 2. Deploy to Cloud Run

```bash
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "VITE_API_URL=https://your-backend-api.run.app/" \
  --set-env-vars "VITE_PRIVY_APP_ID=your_privy_app_id" \
  --set-env-vars "VITE_PRIVY_CLIENT_ID=your_privy_client_id" \
  --set-env-vars "VITE_APP_EXCHANGE_RATE_API_KEY=your_exchange_rate_key" \
  --set-env-vars "VITE_PAYSTACK_PUBLIC_KEY=your_paystack_key" \
  --set-env-vars "VITE_GOOGLE_PLACES_API_KEY=your_google_places_key" \
  --set-env-vars "VITE_PROJECT_ID=your_project_id"
```

#### 3. Update Environment Variables (After Deployment)

```bash
gcloud run services update $SERVICE_NAME \
  --region $REGION \
  --update-env-vars "VITE_API_URL=https://new-backend-url.run.app/"
```

### Using Cloud Run Console

1. Go to Cloud Run in GCP Console
2. Select your service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add environment variables:
   - Name: `VITE_API_URL`, Value: `https://your-backend-api.run.app/`
   - Name: `VITE_PRIVY_APP_ID`, Value: `your_privy_app_id`
   - etc.
6. Deploy

### Verification

After deployment, check if config is loaded:

1. Open browser console
2. Type: `window.ENV_CONFIG`
3. You should see your environment variables

### Local Testing

To test the runtime config locally:

```bash
# Build the Docker image
docker build -t abscotek-frontend .

# Run with environment variables
docker run -p 8080:8080 \
  -e VITE_API_URL=http://localhost:5832/ \
  -e VITE_PRIVY_APP_ID=your_app_id \
  abscotek-frontend
```

### Troubleshooting

**Config not loading:**
- Check browser console for `window.ENV_CONFIG`
- Verify `/config.js` is accessible at `https://your-app.run.app/config.js`
- Check Cloud Run logs for config generation output

**API calls failing:**
- Verify `VITE_API_URL` ends with `/`
- Check CORS settings on backend
- Verify backend URL is accessible

**Environment variables not updating:**
- Cloud Run caches environment variables
- Deploy a new revision after changing env vars
- Clear browser cache
