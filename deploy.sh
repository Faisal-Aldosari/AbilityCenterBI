#!/bin/bash

echo "Building AbilityCenterBI..."
cd /Users/faisal/Desktop/AbilityCenterBI
npm run build > build.log 2>&1
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build successful"
    echo "Deploying to Vercel..."
    vercel --prod > deploy.log 2>&1
    DEPLOY_STATUS=$?
    
    if [ $DEPLOY_STATUS -eq 0 ]; then
        echo "✅ Deployment successful"
        echo "URL: https://ability-center-j05ctl5ht-faisal-aldosaris-projects.vercel.app"
    else
        echo "❌ Deployment failed"
        cat deploy.log
    fi
else
    echo "❌ Build failed"
    cat build.log
fi
