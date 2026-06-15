@echo off
setlocal EnableExtensions
cd /d "%~dp0"

title Smart DSR Portal - Full Stack Start

echo.
echo Smart DSR Portal - Full Stack Start
echo ====================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed or not available in PATH.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

echo Starting Backend API Server...
start "DSR API Server" cmd /k "cd /d ""%~dp0"" && npm run dev:api"

echo Starting Background Worker...
start "DSR Background Worker" cmd /k "cd /d ""%~dp0"" && npm run dev:worker"

echo Starting Modern Next.js Frontend...
start "DSR Next.js Frontend" cmd /k "cd /d ""%~dp0"" && npm run dev:web"

cd /d "%~dp0apps\web\public\legacy"

echo Building static legacy portal files...
node build.js
if errorlevel 1 (
  echo Build failed.
)

echo.
echo Starting lightweight local legacy portal on http://localhost:8081 ...
start "DSR Legacy Simple Portal" cmd /k "cd /d ""%~dp0apps\web\public\legacy"" && set DSR_NO_WATCH=1&& node server.js"

echo.
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo Opening the legacy portal...
start http://localhost:8081/home.html

echo Opening the Next.js modern frontend...
start http://localhost:3000

echo.
echo Done. Keep the opened terminal windows running for all services.
echo.
echo Demo login:
echo admin@demo.com / password123
echo iit@demo.com / password123
echo sdlc@demo.com / password123
echo.
pause
exit /b 0
