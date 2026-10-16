@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo node_modules mangler. Kjor 01_INSTALL.bat forst.
  pause
  exit /b 1
)
echo Starter Forma OAuth-helper...
call npm start
pause
