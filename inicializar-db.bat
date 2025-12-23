@echo off
echo.
echo ========================================
echo   Creando Base de Datos
echo ========================================
echo.

echo Aplicando migraciones de Prisma...
npx prisma db push

echo.
echo Ejecutando seed...
npx tsx prisma/seed.ts

echo.
echo ========================================
echo   Base de datos lista!
echo ========================================
echo.
echo Presiona cualquier tecla para salir...
pause >nul
