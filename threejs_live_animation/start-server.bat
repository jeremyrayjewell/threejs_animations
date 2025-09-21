@echo off
title Audio Visualizer Setup

echo 🎵 Audio Visualizer Setup Script
echo =================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ❌ Error: Please run this script from the threejs_live_animation directory
    echo    The directory should contain index.html and other project files
    pause
    exit /b 1
)

echo 📁 Found project files ✓
echo.

echo 🚀 Starting local server...
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using Python server
    echo 🌐 Starting server at: http://localhost:8000
    echo.
    echo 🎤 IMPORTANT: Allow microphone access when prompted!
    echo ⌨️  Press Ctrl+C to stop the server
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 >nul
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Try Node.js
where npx >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using Node.js http-server
    echo 🌐 Starting server at: http://localhost:8080
    echo.
    echo 🎤 IMPORTANT: Allow microphone access when prompted!
    echo ⌨️  Press Ctrl+C to stop the server
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 >nul
    start http://localhost:8080
    npx http-server -p 8080
    goto :end
)

REM Try PHP
where php >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Using PHP built-in server
    echo 🌐 Starting server at: http://localhost:8000
    echo.
    echo 🎤 IMPORTANT: Allow microphone access when prompted!
    echo ⌨️  Press Ctrl+C to stop the server
    echo.
    echo Opening browser in 3 seconds...
    timeout /t 3 >nul
    start http://localhost:8000
    php -S localhost:8000
    goto :end
)

REM No server found
echo ❌ No suitable server found!
echo.
echo Please install one of the following:
echo   • Python 3: https://www.python.org/downloads/
echo   • Node.js: https://nodejs.org/
echo   • PHP: https://www.php.net/
echo.
echo Then run this script again, or manually start a server:
echo   python -m http.server 8000
echo   npx http-server
echo   php -S localhost:8000
echo.
pause

:end