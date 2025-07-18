#!/bin/bash

# Production Deployment Setup Script for AbilityCenterBI
# This script sets up environment variables in Vercel

echo "🚀 Setting up AbilityCenterBI Production Environment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Set environment variables in Vercel
echo "📝 Setting environment variables in Vercel..."

# Google OAuth Configuration
vercel env add VITE_GOOGLE_CLIENT_ID production
vercel env add VITE_GOOGLE_API_KEY production

# Additional environment variables
vercel env add VITE_APP_NAME production
vercel env add VITE_GOOGLE_DISCOVERY_DOCS production
vercel env add VITE_GOOGLE_SCOPES production

echo "✅ Environment variables configured!"
echo ""
echo "🔧 Next steps:"
echo "1. Update Google OAuth redirect URIs to include your production domain"
echo "2. Test all features on the production site"
echo "3. Monitor deployment logs for any issues"
echo ""
echo "🌐 Your application is live at:"
echo "Production: https://ability-center-bi.vercel.app"
echo "Preview: https://ability-center-ku5khl1jw-faisal-aldosaris-projects.vercel.app"
