#!/bin/bash
set -e

PROJECT_ID="openchat-project"
REGION="asia-southeast1"
SERVICE_NAME="openchat-server"

echo "🚀 Starting OpenChat deployment..."

# ── Step 1: Deploy server to Cloud Run ────────────────────
echo ""
echo "📦 Step 1/3 — Deploying server to Cloud Run..."

cd server

gcloud run deploy $SERVICE_NAME \
  --source . \
  --project $PROJECT_ID \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "\
FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,\
FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL,\
FIREBASE_PRIVATE_KEY=$FIREBASE_PRIVATE_KEY,\
FIREBASE_WEB_API_KEY=$FIREBASE_WEB_API_KEY,\
FIREBASE_DATABASE_URL=$FIREBASE_DATABASE_URL,\
EMAIL_USER=$EMAIL_USER,\
EMAIL_APP_PASSWORD=$EMAIL_APP_PASSWORD,\
GEMINI_API_KEY=$GEMINI_API_KEY,\
JWT_SECRET=$JWT_SECRET,\
PORT=8080"

# Get the Cloud Run URL
SERVER_URL=$(gcloud run services describe $SERVICE_NAME \
  --project $PROJECT_ID \
  --region $REGION \
  --format 'value(status.url)')

echo "✅ Server deployed at: $SERVER_URL"

cd ..

# ── Step 2: Build dashboard with real server URL ──────────
echo ""
echo "🔨 Step 2/3 — Building dashboard..."

cd dashboard

# Write .env.production with the real server URL
echo "VITE_API_URL=$SERVER_URL" > .env.production

yarn install
yarn build

cd ..

# ── Step 3: Deploy dashboard to Firebase Hosting ─────────
echo ""
echo "🌐 Step 3/3 — Deploying dashboard to Firebase Hosting..."

firebase deploy --only hosting --project $PROJECT_ID

echo ""
echo "✅ Deployment complete!"
echo "   Dashboard: https://$PROJECT_ID.web.app"
echo "   Server:    $SERVER_URL"
