@echo off
echo ========================================
echo   Instalacion de Dependencias
echo   Sistema de Subastas
echo ========================================
echo.

echo Instalando framer-motion para animaciones...
call npm install framer-motion
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo instalar framer-motion
    pause
    exit /b 1
)

echo.
echo Instalando dependencias del servicio de subastas...
cd mini-services\auction-service
call npm install
if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias del servicio
    pause
    exit /b 1
)

cd ..\..

echo.
echo ========================================
echo   Dependencias instaladas!
echo ========================================
echo.
echo Dependencias instaladas:
echo - framer-motion (animaciones)
echo - socket.io (WebSocket)
echo - @prisma/client (base de datos)
echo.
echo Siguiente paso: Ejecuta actualizar-db-subastas.bat
echo.
pause
