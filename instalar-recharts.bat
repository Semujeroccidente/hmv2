@echo off
echo ========================================
echo   Instalacion de Dependencias
echo   Features Avanzadas de Subastas
echo ========================================
echo.

echo Instalando recharts para graficos...
call npm install recharts
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo instalar recharts
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Dependencias instaladas!
echo ========================================
echo.
echo Siguiente paso: Ejecuta actualizar-db-avanzado.bat
echo.
pause
