@echo off
echo Starting development servers...

REM Start XAMPP (Apache + MySQL)
start "" "C:\xampp1p\xampp-control.exe"

REM Wait a few seconds for XAMPP to start
timeout /t 5

REM Start Next.js development server
npm run dev
