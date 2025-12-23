@echo off
echo.
echo ========================================
echo   Ejecutando Seed de Base de Datos
echo ========================================
echo.

npx tsx prisma/seed.ts

echo.
echo Presiona cualquier tecla para salir...
pause >nul
