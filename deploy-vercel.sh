#!/bin/bash
# Deploy AI Concierge to Vercel
# Run this script to deploy your app

set -e

echo "🚀 AI Concierge - Vercel Deployment"
echo "===================================="
echo ""

# Check if logged in
echo "1. Checking Vercel authentication..."
if ! npx vercel token show &> /dev/null; then
    echo "   Not logged in. Opening Vercel login..."
    npx vercel login
fi

echo "   ✅ Logged in to Vercel"

# Deploy
echo ""
echo "2. Deploying to Vercel..."
cd "$(dirname "$0")/app"

# Deploy with environment variables
npx vercel --prod \
  --env "DATABASE_URL=$DATABASE_URL" \
  --env "GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID" \
  --env "GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET" \
  --env "INNGEST_EVENT_KEY=$INNGEST_EVENT_KEY" \
  --env "INNGEST_SIGNING_KEY=$INNGEST_SIGNING_KEY" \
  --env "OPENCLAW_GATEWAY_URL=$OPENCLAW_GATEWAY_URL" \
  --env "OPENCLAW_WEBHOOK_URL=$OPENCLAW_WEBHOOK_URL"

echo ""
echo "===================================="
echo "✅ Deployed successfully!"
echo "===================================="
