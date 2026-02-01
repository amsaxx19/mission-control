#!/bin/bash
# Auto-deploy Mission Control UI
# Lu tinggal klik link di browser, selesai.

echo "🚀 Mission Control Auto-Deploy"
echo "==============================="
echo ""

# Check Vercel login status
echo "🔍 Checking Vercel login..."
if ! npx vercel whoami &> /dev/null; then
    echo "⚠️  Perlu login dulu (cuma sekali)"
    echo ""
    echo "⏳ Opening browser untuk login..."
    npx vercel login
    echo ""
    echo "✅ Setelah login di browser, tunggu 5 detik..."
    sleep 5
fi

# Build project
echo ""
echo "📦 Building project..."
cd "$(dirname "$0")/mission-control-ui"
npm run build

# Deploy
echo ""
echo "🚀 Deploying..."
npx vercel --prod --yes

echo ""
echo "==============================="
echo "✅ SELESAI!"
echo "URL di atas bisa diakses dari HP/manapun"
echo "==============================="