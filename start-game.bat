@echo off
echo ===================================================
echo     Launching Fish Game (Backend + Frontend)
echo ===================================================
echo.

echo Starting Backend Server (Port 5000)...
start "Fish Game Backend" cmd /k "cd fishback && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend Server (Port 5173)...
start "Fish Game Frontend" cmd /k "cd fish && npm run dev"

timeout /t 2 /nobreak >nul

echo Opening Game in your Browser...
start http://localhost:5173

echo.
echo Both servers are running! 
echo Close this window or keep it open.
echo ===================================================
pause

