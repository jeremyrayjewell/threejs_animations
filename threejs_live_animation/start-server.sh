#!/bin/bash

# Audio Visualizer Setup Script
# This script helps you run the audio visualizer with proper HTTPS/localhost setup

echo "🎵 Audio Visualizer Setup Script"
echo "================================="
echo

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the threejs_live_animation directory"
    echo "   The directory should contain index.html and other project files"
    exit 1
fi

echo "📁 Found project files ✓"
echo

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Try different server options
echo "🚀 Starting local server..."
echo

# Option 1: Python 3
if command_exists python3; then
    echo "✅ Using Python 3 server"
    echo "🌐 Starting server at: http://localhost:8000"
    echo "📱 Access on mobile: http://$(hostname -I | awk '{print $1}'):8000"
    echo
    echo "🎤 IMPORTANT: Allow microphone access when prompted!"
    echo "⌨️  Press Ctrl+C to stop the server"
    echo
    python3 -m http.server 8000

# Option 2: Python (legacy)
elif command_exists python; then
    echo "✅ Using Python server"
    echo "🌐 Starting server at: http://localhost:8000"
    echo "📱 Access on mobile: http://$(hostname -I | awk '{print $1}'):8000"
    echo
    echo "🎤 IMPORTANT: Allow microphone access when prompted!"
    echo "⌨️  Press Ctrl+C to stop the server"
    echo
    python -m http.server 8000

# Option 3: Node.js http-server
elif command_exists npx; then
    echo "✅ Using Node.js http-server"
    echo "🌐 Starting server at: http://localhost:8080"
    echo
    echo "🎤 IMPORTANT: Allow microphone access when prompted!"
    echo "⌨️  Press Ctrl+C to stop the server"
    echo
    npx http-server -p 8080

# Option 4: PHP
elif command_exists php; then
    echo "✅ Using PHP built-in server"
    echo "🌐 Starting server at: http://localhost:8000"
    echo
    echo "🎤 IMPORTANT: Allow microphone access when prompted!"
    echo "⌨️  Press Ctrl+C to stop the server"
    echo
    php -S localhost:8000

# No server found
else
    echo "❌ No suitable server found!"
    echo
    echo "Please install one of the following:"
    echo "  • Python 3: https://www.python.org/downloads/"
    echo "  • Node.js: https://nodejs.org/"
    echo "  • PHP: https://www.php.net/"
    echo
    echo "Then run this script again, or manually start a server:"
    echo "  python3 -m http.server 8000"
    echo "  npx http-server"
    echo "  php -S localhost:8000"
    exit 1
fi