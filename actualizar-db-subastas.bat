@echo off
echo Generando cliente de Prisma...
npx prisma generate
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo generar el cliente de Prisma
    pause
    exit /b 1
)

echo.
echo Actualizando base de datos...
npx prisma db push
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo actualizar la base de datos
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Base de datos actualizada!
echo ========================================
echo.
echo Nuevos campos agregados al modelo Auction:
echo - bidCount: Contador de pujas
echo - lastBidder: Ultimo pujador
echo - lastBidTime: Hora de ultima puja
echo - winnerId: ID del ganador
echo - bidIncrement: Incremento minimo (L. 50)
echo.
pause
