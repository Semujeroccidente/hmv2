@echo off
echo.
echo ========================================
echo   Configurando Variables de Entorno
echo ========================================
echo.

echo Creando archivo .env...

(
echo # HonduMarket - Variables de Entorno
echo.
echo # Base de Datos
echo DATABASE_URL="file:./dev.db"
echo.
echo # JWT Secret ^(IMPORTANTE: Cambiar en produccion^)
echo JWT_SECRET="hondumarket-secret-key-2024-super-secure-change-in-production"
echo.
echo # NextAuth ^(opcional^)
echo NEXTAUTH_SECRET="hondumarket-nextauth-secret-2024"
echo NEXTAUTH_URL="http://localhost:3000"
echo.
echo # Entorno
echo NODE_ENV="development"
) > .env

echo.
echo ✅ Archivo .env creado exitosamente!
echo.
echo Presiona cualquier tecla para salir...
pause >nul
