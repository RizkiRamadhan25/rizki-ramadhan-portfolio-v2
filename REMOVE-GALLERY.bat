@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0REMOVE-GALLERY.ps1"
if errorlevel 1 (
  echo.
  echo Gallery cleanup failed. Please keep this window open and check the message above.
  pause
  exit /b 1
)
del /f /q "%~dp0REMOVE-GALLERY.ps1" >nul 2>&1
start "" /b cmd /c "ping 127.0.0.1 -n 2 >nul & del /f /q \"%~f0\""
endlocal
