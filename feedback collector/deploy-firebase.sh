#!/bin/bash

echo "🚀 Starting Firebase deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Build the project
echo "🔨 Building frontend..."
npm run frontend:build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy to Firebase
echo "📤 Deploying to Firebase..."
firebase deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at: https://customer-satisfaction-dashboard.web.app"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi