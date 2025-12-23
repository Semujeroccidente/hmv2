# Variables de Entorno - HonduMarket

## 🔐 Variables Requeridas para Vercel

Configura estas variables en **Vercel Dashboard → Settings → Environment Variables**

### 1. DATABASE_URL (CRÍTICO)
```
DATABASE_URL="postgresql://usuario:password@host:5432/database?schema=public"
```

**Opciones de Base de Datos:**

**A. Vercel Postgres (Recomendado - Integración nativa)**
- Ve a tu proyecto en Vercel
- Storage → Create Database → Postgres
- Copia automáticamente la DATABASE_URL

**B. Supabase (Gratuito)**
- https://supabase.com → New Project
- Settings → Database → Connection String
- Usa "Connection Pooling" para mejor rendimiento

**C. Neon (PostgreSQL Serverless - Gratuito)**
- https://neon.tech → New Project
- Connection String está en el dashboard

**D. PlanetScale (MySQL - Gratuito)**
- https://planetscale.com → New Database
- Copia la Connection String
- Actualiza `prisma/schema.prisma` a `provider = "mysql"`

### 2. JWT_SECRET (CRÍTICO)
```
JWT_SECRET="tu-clave-secreta-de-minimo-32-caracteres-aqui"
```

**Generar una clave segura:**
```bash
# Opción 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opción 2: OpenSSL
openssl rand -hex 32

# Opción 3: Online (usa con precaución)
# https://generate-secret.vercel.app/32
```

### 3. NEXT_PUBLIC_APP_URL (Opcional pero recomendado)
```
NEXT_PUBLIC_APP_URL="https://tu-app.vercel.app"
```

## 📝 Configuración por Entorno

### Production
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="clave-super-segura-de-produccion"
NEXT_PUBLIC_APP_URL="https://hondumarket.vercel.app"
NODE_ENV="production"
```

### Preview (Branches)
```env
DATABASE_URL="postgresql://preview-db..."
JWT_SECRET="clave-de-preview"
NEXT_PUBLIC_APP_URL="https://hondumarket-preview.vercel.app"
```

### Development (Local)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="desarrollo-local-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🚀 Pasos para Configurar

### 1. En Vercel Dashboard

1. Ve a tu proyecto
2. Settings → Environment Variables
3. Para cada variable:
   - Name: `DATABASE_URL`
   - Value: Tu connection string
   - Environments: Marca Production, Preview, Development según necesites
   - Click "Save"

### 2. Después de Configurar

```bash
# Si usas Vercel CLI
vercel env pull

# Esto crea .env.local con tus variables
```

### 3. Ejecutar Migraciones

```bash
# Conectar a Vercel
vercel link

# Obtener variables
vercel env pull

# Ejecutar migraciones
npx prisma migrate deploy

# Opcional: Seed de datos
npx prisma db seed
```

## ⚠️ Notas Importantes

### SQLite NO funciona en Vercel
- Vercel usa un filesystem efímero
- Los archivos se borran después de cada deploy
- **DEBES usar PostgreSQL, MySQL o MongoDB**

### Seguridad
- ✅ Nunca compartas tu `JWT_SECRET`
- ✅ Usa claves diferentes para dev/preview/production
- ✅ Rota las claves periódicamente
- ✅ No hagas commit de archivos `.env`

### Connection Pooling
Para mejor rendimiento con PostgreSQL:
```
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

## 🔄 Migrar de SQLite a PostgreSQL

### 1. Actualizar Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Cambiar de "sqlite"
  url      = env("DATABASE_URL")
}
```

### 2. Crear Nueva Migración
```bash
# Resetear migraciones
rm -rf prisma/migrations

# Crear nueva migración inicial
npx prisma migrate dev --name init
```

### 3. Deploy
```bash
npx prisma migrate deploy
```

## 📊 Verificar Configuración

```bash
# Ver variables configuradas
vercel env ls

# Probar conexión a DB
npx prisma db pull

# Ver schema actual
npx prisma studio
```

## 🆘 Troubleshooting

### Error: "Environment variable not found: DATABASE_URL"
- Verifica que la variable esté configurada en Vercel
- Ejecuta `vercel env pull`
- Reinicia el build

### Error: "Can't reach database server"
- Verifica que la DATABASE_URL sea correcta
- Asegura que la DB permite conexiones externas
- Verifica firewall/whitelist

### Error: "Prisma Client not generated"
- Verifica que `postinstall` esté en package.json
- Limpia cache: `vercel --force`

---

**¿Necesitas ayuda?**
- Vercel Support: https://vercel.com/support
- Prisma Discord: https://pris.ly/discord
