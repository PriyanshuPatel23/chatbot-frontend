#!/bin/bash

# GLP-1 Chatbot Frontend - Quick Start Script

echo "🚀 GLP-1 Chatbot Frontend Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if backend is running
echo ""
echo "🔍 Checking backend availability..."
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is running at http://localhost:8000"
else
    echo "⚠️  Backend does not appear to be running"
    echo "   Make sure your backend is started before running the frontend"
    echo "   Backend URL: http://localhost:8000"
    echo "   If your backend is on a different address, update .env.local"
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# GLP-1 Chatbot Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_DEBUG_MODE=false
EOF
    echo "✅ .env.local created"
fi

# Start development server
echo ""
echo "🎯 Starting development server..."
echo "   Frontend will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

npm run dev
