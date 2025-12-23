@echo off
echo ========================================
echo Configurando Cloudinary para HonduMarket
echo ========================================
echo.

cd /d "%~dp0"

echo Agregando credenciales de Cloudinary al archivo .env...
echo.

REM Agregar variables de Cloudinary al .env
echo. >> .env
echo # Cloudinary Configuration >> .env
echo NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxrukup8s >> .env
echo CLOUDINARY_API_KEY=244916334595748 >> .env
echo CLOUDINARY_API_SECRET=DMq6eQMlsPH38uWRZVZPYBwUlL8 >> .env
echo NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hondumarket_products >> .env

echo.
echo ✓ Cloudinary configurado correctamente!
echo.
echo Cloud Name: dxrukup8s
echo Upload Preset: hondumarket_products
echo.
echo IMPORTANTE: Debes crear el upload preset en Cloudinary:
echo 1. Ve a: https://console.cloudinary.com/settings/upload
echo 2. Click en "Add upload preset"
echo 3. Nombre: hondumarket_products
echo 4. Signing Mode: Unsigned
echo 5. Folder: hondumarket/products
echo 6. Guarda los cambios
echo.
pause
