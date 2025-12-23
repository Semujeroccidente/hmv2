@echo off
echo Ejecutando build de Next.js...
echo.

cd /d "%~dp0"
call npx next build

echo.
echo Build completado!
pause
