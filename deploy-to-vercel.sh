#!/bin/bash
# Deploy Mission Control UI to Vercel
# Usage: ./deploy-to-vercel.sh

echo "🚀 Deploying Mission Control UI..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Build first
echo "📦 Building..."
cd mission-control-ui
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Done! Check the URL above."