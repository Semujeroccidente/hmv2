@echo off
echo ========================================
echo   Instalando Dependencias Admin Panel
echo ========================================
echo.

echo Instalando date-fns...
call npm install date-fns
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo instalar date-fns
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencias instaladas!
echo ========================================
echo.
pause
