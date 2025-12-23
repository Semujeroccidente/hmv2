@echo off
echo ========================================
echo   Iniciando Servicio de Subastas
echo ========================================
echo.

cd /d "%~dp0mini-services\auction-service"

echo Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Iniciando servicio en puerto 3003...
echo.
echo IMPORTANTE: Deja esta ventana abierta mientras uses las subastas
echo Presiona Ctrl+C para detener el servicio
echo.

call npm run dev

pause
