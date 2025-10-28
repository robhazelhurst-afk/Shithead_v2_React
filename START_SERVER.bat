@echo off
echo ========================================
echo   Shithead 2 - Local Server Launcher
echo ========================================
echo.

:: Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Python web server...
    echo.
    echo Open your browser to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    python -m http.server 8000
    goto :end
)

:: Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Node.js web server...
    echo.
    echo Open your browser to: http://localhost:8000
    echo Press Ctrl+C to stop the server
    echo.
    npx http-server -p 8000
    goto :end
)

:: Neither found
echo ERROR: Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
echo Or manually run the server using the commands in QUICK_START.md
echo.
pause

:end
