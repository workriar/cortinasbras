#!/bin/bash

echo "🚀 Building Cortinas Brás - Flask + React"

# Build frontend
echo "📦 Building React frontend..."
cd frontend
npm run build
cd ..

# Copy build to backend
echo "📁 Copying build to backend..."
rm -rf backend/build
cp -r frontend/build backend/

echo "✅ Build completed successfully!"
echo "Run with: cd backend && gunicorn -w 2 -b 0.0.0.0:5000 app:app"
