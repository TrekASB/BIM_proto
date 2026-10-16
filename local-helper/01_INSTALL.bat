@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js mangler. Installer Node.js LTS og prov igjen.
  pause
  exit /b 1
)
echo Installerer lokal Forma OAuth-helper...
call npm install
echo.
echo Ferdig. Kjor 02_START.bat.
pause
