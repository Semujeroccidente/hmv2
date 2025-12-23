@echo off
echo ========================================
echo   Actualizando Base de Datos
echo   Features Avanzadas de Subastas
echo ========================================
echo.

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
echo Nuevos campos agregados:
echo.
echo PROXY BIDDING:
echo - Bid.maxAmount (puja maxima)
echo - Bid.isProxy (es puja automatica)
echo - Auction.hasProxyBids (tiene pujas automaticas)
echo.
echo TIME EXTENSION:
echo - Auction.originalEndDate (fecha original)
echo - Auction.extensionMinutes (minutos de extension)
echo - Auction.timesExtended (veces extendida)
echo - Auction.maxExtensions (maximo extensiones)
echo.
echo SCHEDULED AUCTIONS:
echo - Auction.startDate (fecha de inicio)
echo - Auction.autoStart (inicio automatico)
echo - AuctionStatus.SCHEDULED (nuevo status)
echo.
echo BUY IT NOW:
echo - Auction.buyNowPrice (precio compra inmediata)
echo - Auction.buyNowEnabled (habilitado)
echo - Auction.buyNowUserId (quien compro)
echo.
pause
