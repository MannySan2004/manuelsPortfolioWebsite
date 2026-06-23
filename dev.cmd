@echo off
REM Double-click (or run) this to start the local dev server.
REM Uses the portable Node.js in C:\code\tools (no admin / no PATH setup needed).
set "PATH=C:\code\tools\node-v24.17.0-win-x64;%PATH%"
cd /d "%~dp0"
echo Starting dev server at http://localhost:5173/  (press Ctrl+C to stop)
npm run dev
