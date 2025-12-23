# 🚀 Configuración de Cloudinary - INSTRUCCIONES

## ⚠️ IMPORTANTE: Debes completar estos pasos antes de usar el sistema de imágenes

### Paso 1: Ejecutar Scripts de Configuración

1. **Ejecuta `configurar-cloudinary.bat`**
   - Esto agregará tus credenciales al archivo `.env`
   - Doble clic en el archivo o ejecútalo desde la terminal

2. **Ejecuta `instalar-cloudinary.bat`**
   - Esto instalará la dependencia `next-cloudinary`
   - Espera a que termine la instalación

### Paso 2: Crear Upload Preset en Cloudinary

**MUY IMPORTANTE:** Debes crear un "upload preset" en tu cuenta de Cloudinary:

1. Ve a: https://console.cloudinary.com/settings/upload

2. Click en **"Add upload preset"**

3. Configura así:
   - **Preset name:** `hondumarket_products`
   - **Signing Mode:** **Unsigned** (muy importante!)
   - **Folder:** `hondumarket/products`
   - **Use filename:** Yes
   - **Unique filename:** Yes

4. En la sección **"Eager transformations"** (opcional pero recomendado):
   - Click "Add eager transformation"
   - Format: `Auto`
   - Quality: `Auto`
   - Width: `2000`
   - Height: `2000`
   - Crop: `limit`

5. Click **"Save"**

### Paso 3: Verificar Configuración

Abre el archivo `.env` y verifica que tenga estas líneas:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxrukup8s
CLOUDINARY_API_KEY=244916334595748
CLOUDINARY_API_SECRET=DMq6eQMlsPH38uWRZVZPYBwUlL8
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hondumarket_products
```

### Paso 4: Reiniciar Servidor

```bash
# Detén el servidor si está corriendo (Ctrl+C)
# Luego inicia de nuevo:
npm run dev
```

---

## ✅ Probar el Sistema

1. Ve a: http://localhost:3000/vender

2. Deberías ver una zona de "drag & drop" para imágenes

3. Prueba:
   - Arrastrando una imagen
   - Haciendo clic para seleccionar
   - Subiendo múltiples imágenes

4. Las imágenes se subirán automáticamente a Cloudinary

---

## 🐛 Solución de Problemas

### Error: "Cloudinary no está configurado"
- Verifica que el archivo `.env` tenga las variables
- Reinicia el servidor después de agregar las variables

### Error: "Upload preset not found"
- Asegúrate de haber creado el preset en Cloudinary
- Verifica que el nombre sea exactamente: `hondumarket_products`
- Verifica que "Signing Mode" esté en "Unsigned"

### Error: "Invalid API key"
- Verifica que las credenciales en `.env` sean correctas
- Cópialas de nuevo desde tu dashboard de Cloudinary

---

## 📊 Límites del Plan Gratuito

- **Storage:** 25 GB
- **Bandwidth:** 25 GB/mes
- **Transformaciones:** Ilimitadas

Esto es suficiente para ~5,000 productos con 5 imágenes cada uno.

---

**¿Listo?** Ejecuta los scripts y crea el upload preset, luego prueba subiendo una imagen en `/vender`!
