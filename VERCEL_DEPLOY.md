# HonduMarket - Guía de Deployment en Vercel

## 📋 Checklist Pre-Deployment

- [x] Proyecto configurado con Next.js 15
- [x] Prisma configurado
- [x] Variables de entorno documentadas
- [x] .gitignore actualizado
- [x] vercel.json creado

## 🚀 Pasos para Deploy en Vercel

### 1. Preparar Base de Datos en la Nube

**Opción A: Vercel Postgres (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login a Vercel
vercel login

# Crear base de datos Postgres
vercel postgres create
```

**Opción B: Supabase (Gratuito)**
1. Ve a https://supabase.com
2. Crea un nuevo proyecto
3. Copia la Connection String (PostgreSQL)

**Opción C: PlanetScale (MySQL)**
1. Ve a https://planetscale.com
2. Crea una nueva base de datos
3. Copia la Connection String

### 2. Actualizar Prisma Schema

Si usas PostgreSQL o MySQL, actualiza `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // o "mysql"
  url      = env("DATABASE_URL")
}
```

### 3. Configurar Variables de Entorno en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto (o créalo)
3. Settings → Environment Variables
4. Agrega:

```
DATABASE_URL=postgresql://usuario:password@host:5432/database
JWT_SECRET=genera-una-clave-segura-de-32-caracteres
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

### 4. Deploy desde GitHub

**Opción A: Conectar Repositorio**
1. Push tu código a GitHub
2. En Vercel: New Project → Import Git Repository
3. Selecciona el repositorio
4. Vercel detectará Next.js automáticamente
5. Click "Deploy"

**Opción B: Deploy con Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### 5. Ejecutar Migraciones de Base de Datos

Después del primer deploy:

```bash
# Conectar a tu proyecto
vercel link

# Obtener variables de entorno
vercel env pull

# Ejecutar migraciones
npx prisma migrate deploy

# Opcional: Seed inicial
npx prisma db seed
```

### 6. Verificar el Deploy

1. Abre la URL de Vercel
2. Verifica que la página carga correctamente
3. Prueba el login/registro
4. Verifica las categorías
5. Prueba la búsqueda

## 🔧 Configuración Adicional

### Build Command (ya configurado en vercel.json)
```
prisma generate && next build
```

### Environment Variables Necesarias

**Production:**
- `DATABASE_URL` - URL de tu base de datos
- `JWT_SECRET` - Clave secreta para JWT (32+ caracteres)
- `NEXT_PUBLIC_APP_URL` - URL de tu app

**Opcional:**
- `NODE_ENV=production`
- `NEXTAUTH_URL` - Si usas NextAuth

## 🐛 Troubleshooting

### Error: "Prisma Client not found"
```bash
# Asegúrate que vercel.json tiene:
"buildCommand": "prisma generate && next build"
```

### Error: "Database connection failed"
- Verifica que DATABASE_URL esté correctamente configurada
- Asegura que la base de datos permite conexiones externas
- Verifica las credenciales

### Error: "Module not found"
```bash
# Limpia y reinstala
rm -rf node_modules .next
npm install
```

### Base de datos SQLite en Vercel
⚠️ **SQLite NO funciona en Vercel** (filesystem efímero)
Debes migrar a PostgreSQL, MySQL o MongoDB

## 📊 Migrar de SQLite a PostgreSQL

1. Exporta datos de SQLite:
```bash
npx prisma db pull
npx prisma generate
```

2. Actualiza schema.prisma:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Crea nueva migración:
```bash
npx prisma migrate dev --name init
```

4. Importa datos (si necesario)

## 🎯 Próximos Pasos

Después del deploy exitoso:

1. ✅ Configura dominio personalizado (opcional)
2. ✅ Configura Analytics
3. ✅ Configura monitoreo de errores (Sentry)
4. ✅ Configura CI/CD para deploys automáticos
5. ✅ Configura backups de base de datos
6. ✅ Implementa rate limiting
7. ✅ Configura CDN para imágenes

## 📞 Soporte

- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

---

**¡Listo para deploy! 🚀**
