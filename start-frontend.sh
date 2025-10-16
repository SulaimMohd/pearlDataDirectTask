#!/bin/bash

echo "🎨 Starting PearlData Frontend..."
echo "📁 Navigate to frontend directory"
cd frontend

echo "📦 Installing dependencies..."
npm install

echo "🚀 Starting Vite development server..."
npm run dev
