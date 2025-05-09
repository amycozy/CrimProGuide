@echo off
title Criminal Procedure Guide Server Launcher
echo ======================================
echo   Launching Criminal Procedure Guide
echo ======================================
echo.
echo This will start a local web server to run the Criminal Procedure Guide.
echo Your browser should open automatically showing the guide.
echo.
echo Close this window when you're done using the guide.
echo.
echo Launching...

:: Try to run using python or python3 (whichever is available)
python -c "import sys; print('Python version:', sys.version)" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Python found. Starting server...
    :: Run server with command window minimized
    start /min python "%~dp0server.py"
    goto end
)

python3 -c "import sys; print('Python version:', sys.version)" >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Python3 found. Starting server...
    :: Run server with command window minimized
    start /min python3 "%~dp0server.py"
    goto end
)

:: If we get here, Python wasn't found
echo ERROR: Python not found. Please install Python and try again.
echo.
echo You can download Python from: https://www.python.org/downloads/
echo Make sure to check "Add Python to PATH" during installation.
echo.
pause
goto end

:end
echo Server started! You can close this window when you're finished using the guide.
echo.
echo If your browser didn't open automatically, please go to:
echo http://localhost:8000
echo.
pause
