@echo off
title GourmetScore Restaurant Review Platform Launcher
echo ======================================================================
echo          Starting GourmetScore Restaurant Review Platform...
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Launching Backend API Server (Port 5000)...
start "GourmetScore Backend API (Port 5000)" cmd /k "cd backend && node server.js"

echo [2/3] Launching Frontend Web Client (Port 3000)...
start "GourmetScore Frontend (Port 3000)" cmd /k "cd frontend && npm.cmd run dev"

echo [3/3] Waiting 4 seconds for servers to initialize...
timeout /t 4 /nobreak >nul

echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ======================================================================
echo   Platform successfully launched!
echo   Frontend URL: http://localhost:3000
echo   Backend URL:  http://localhost:5000/api/health
echo   Keep the two opened command windows running while using the app.
echo ======================================================================
echo.
pause
