@echo off
setlocal

echo.
echo ============================================
echo   PostureGuard SDK One-Click Setup
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js is not installed.
  echo Please install Node.js 18+ from https://nodejs.org/ and run this setup again.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm is not available.
  echo Reinstall Node.js from https://nodejs.org/ and run this setup again.
  pause
  exit /b 1
)

set "TARGET_DIR=%USERPROFILE%\PostureGuard-SDK-Starter"
if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"
cd /d "%TARGET_DIR%"

if not exist package.json (
  echo [INFO] Creating starter npm project in:
  echo        %TARGET_DIR%
  call npm init -y >nul
  if errorlevel 1 (
    echo [ERROR] Failed to initialize npm project.
    pause
    exit /b 1
  )
)

echo [INFO] Installing PostureGuard SDK and required dependencies...
call npm install posture-guard-sdk @tensorflow/tfjs @tensorflow-models/pose-detection
if errorlevel 1 (
  echo [ERROR] SDK installation failed.
  pause
  exit /b 1
)

if not exist "%TARGET_DIR%\example.js" (
  >"%TARGET_DIR%\example.js" echo import { PostureDetector } from "posture-guard-sdk";
  >>"%TARGET_DIR%\example.js" echo.
  >>"%TARGET_DIR%\example.js" echo const detector = new PostureDetector({ threshold: 120 });
  >>"%TARGET_DIR%\example.js" echo detector.on("alert", (alert) =^> console.warn(alert.message));
  >>"%TARGET_DIR%\example.js" echo.
  >>"%TARGET_DIR%\example.js" echo // Start posture detection in your app flow:
  >>"%TARGET_DIR%\example.js" echo // await detector.start();
)

echo.
echo [SUCCESS] Setup completed.
echo Project folder: %TARGET_DIR%
echo You can now use posture-guard-sdk in your project.
echo.
pause
