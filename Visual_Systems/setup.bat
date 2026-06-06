@echo off
REM ANARCHI VISUAL SYSTEMS ENGINE - SETUP SCRIPT
REM This script initializes the necessary DNA configuration files for a new user.
REM It will copy example files if the primary data files are missing.

echo.
echo [ANARCHI SETUP] Initializing DNA Configuration...
echo.

set IDENTITY_EXAMPLE="src\identity\identity.example.json"
set IDENTITY_DATA="src\identity\identity.data.json"
set PARTSBIN_EXAMPLE="src\core\library\partsBin.example.json"
set PARTSBIN_DATA="src\core\library\partsBin.data.json"

if not exist %IDENTITY_DATA% (
    echo    ^> Creating %IDENTITY_DATA% from example...
    copy %IDENTITY_EXAMPLE% %IDENTITY_DATA% > nul
) else (
    echo    ^> %IDENTITY_DATA% already exists. Skipping.
)

if not exist %PARTSBIN_DATA% (
    echo    ^> Creating %PARTSBIN_DATA% from example...
    copy %PARTSBIN_EXAMPLE% %PARTSBIN_DATA% > nul
) else (
    echo    ^> %PARTSBIN_DATA% already exists. Skipping.
)

echo.
echo [ANARCHI SETUP] DNA Initialization Complete.
echo.
pause