# 📋 **INSTRUCCIONES PARA WINDOWS - HonduraMarket**

## 🔧 **SOLUCIÓN AL PROBLEMA DE `tee`**

El comando `tee` no está disponible en Windows por defecto. Aquí tienes las soluciones:

---

## 🚀 **SOLUCIÓN 1: Modificar package.json (Recomendada)**

Reemplaza el contenido de tu archivo `package.json` con este:

```json
{
  "name": "hondumarket",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "dev:log": "next dev -p 3000 > dev.log 2>&1",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio",
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@hookform/resolvers": "^5.1.1",
    "@mdxeditor/editor": "^3.39.1",
    "@prisma/client": "^6.11.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@reactuses/core": "^6.0.5",
    "@tanstack/react-query": "^5.82.0",
    "@tanstack/react-table": "^8.21.3",
    "@types/bcryptjs": "^3.0.0",
    "@types/jsonwebtoken": "^9.0.10",
    "bcryptjs": "^3.0.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.2",
    "input-otp": "^1.4.2",
    "jsonwebtoken": "^9.0.3",
    "lucide-react": "^0.525.0",
    "next": "15.3.5",
    "next-auth": "^4.24.11",
    "next-intl": "^4.3.4",
    "next-themes": "^0.4.6",
    "prisma": "^6.11.1",
    "react": "^19.0.0",
    "react-day-picker": "^9.8.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "react-markdown": "^10.1.0",
    "react-resizable-panels": "^3.0.3",
    "react-syntax-highlighter": "^15.6.1",
    "recharts": "^2.15.4",
    "sharp": "^0.34.3",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.21.0",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "z-ai-web-dev-sdk": "^0.0.10",
    "zod": "^4.0.2",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "bun-types": "^1.3.4",
    "eslint": "^9",
    "eslint-config-next": "15.3.5",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.5",
    "typescript": "^5"
  }
}
```

---

## 🚀 **SOLUCIÓN 2: Comandos Directos**

Si no quieres modificar el package.json, usa estos comandos:

### **Para iniciar desarrollo normal:**
```bash
bun run dev
```

### **Para iniciar con logs (opcional):**
```bash
bun run dev:log
```

---

## 🚀 **SOLUCIÓN 3: Instalar Git Bash o WSL**

### **Opción A: Usar Git Bash (Recomendado)**
1. **Descarga Git for Windows**: https://git-scm.com/download/win
2. **Instala Git Bash** (viene incluido)
3. **Abre Git Bash** en lugar de CMD
4. **Usa los comandos originales**

### **Opción B: Usar WSL (Windows Subsystem for Linux)**
1. **Instala WSL**: `wsl --install`
2. **Abre WSL terminal**
3. **Navega al proyecto**: `cd /mnt/c/Users/SEMUJER/Desktop/hondumarket`
4. **Usa comandos Linux normales**

---

## 🚀 **PASOS PARA CONTINUAR**

### **1. Modifica package.json**
Reemplaza el contenido del archivo `package.json` con la versión de arriba.

### **2. Inicia el servidor**
```bash
bun run dev
```

### **3. Poblar datos de ejemplo**
En otro terminal:
```bash
curl -X POST http://localhost:3000/api/seed
```

### **4. Abre la aplicación**
Visita: `http://localhost:3000`

---

## 🔑 **Usuarios de Prueba**

| Email | Contraseña | Rol |
|-------|------------|------|
| juan@ejemplo.com | password123 | Vendedor |
| maria@ejemplo.com | password123 | Vendedora |
| carlos@ejemplo.com | password123 | Comprador |

---

## 🛠️ **Comandos Útiles en Windows**

```bash
# Iniciar desarrollo
bun run dev

# Verificar código
bun run lint

# Base de datos
bun run db:push
bun run db:studio

# Logs (opcional)
bun run dev:log

# Construir para producción
bun run build
bun run start
```

---

## 🚨 **Solución de Problemas Comunes en Windows**

### **Problema: "Bun not found"**
```bash
# Instalar Bun
powershell -c "irm bun.sh/install.ps1 | iex"
```

### **Problema: "Port 3000 in use"**
```bash
# Usar otro puerto
PORT=3001 bun run dev
```

### **Problema: "Prisma cannot find database"**
```bash
# Recrear base de datos
bun run db:push
```

### **Problema: "Module not found"**
```bash
# Reinstalar dependencias
rm -rf node_modules bun.lockb
bun install
```

---

## 📱 **Verificación Funcional**

Una vez funcionando, deberías ver:

✅ **Página principal** con diseño hondureño  
✅ **Sistema de registro/login**  
✅ **Productos de ejemplo**  
✅ **Navegación responsive**  
✅ **Footer completo**  

---

**¡Listo! Con estas instrucciones tu HonduraMarket funcionará perfectamente en Windows.** 🎉