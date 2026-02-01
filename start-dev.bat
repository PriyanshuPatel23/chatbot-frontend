@echo off
REM GLP-1 Chatbot Frontend - Quick Start Script (Windows)

echo.
echo ========================================
echo GLP-1 Chatbot Frontend Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo X Node.js is not installed.
    echo   Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo OK Node.js version:
node --version

echo OK npm version:
npm --version

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

REM Create .env.local if it doesn't exist
if not exist .env.local (
    echo.
    echo Creating .env.local file...
    (
        echo # GLP-1 Chatbot Frontend Environment Variables
        echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
        echo NEXT_PUBLIC_DEBUG_MODE=false
    ) > .env.local
    echo OK .env.local created
)

REM Start development server
echo.
echo Starting development server...
echo Frontend will be available at: http://localhost:3000
echo Press Ctrl+C to stop
echo.

call npm run dev

pause
