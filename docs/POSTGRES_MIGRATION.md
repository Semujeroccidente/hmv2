# Migración a PostgreSQL

**Estado:** Documentado - Pendiente de ejecución

---

## 📋 Resumen

Esta guía documenta el proceso de migración de SQLite a PostgreSQL para el proyecto HonduMarket.

### ¿Por qué PostgreSQL?

- ✅ Mejor rendimiento en producción
- ✅ Soporte para JSON nativo
- ✅ Escalabilidad horizontal
- ✅ Características avanzadas (full-text search, etc.)
- ✅ Compatible con Vercel/Railway/Render

---

## 🚀 Proceso de Migración

### Paso 1: Backup de Datos Actuales

```bash
# Exportar datos de SQLite
npx prisma db pull
npx prisma generate

# Crear backup de la base de datos
cp prisma/dev.db prisma/dev.db.backup
```

### Paso 2: Configurar PostgreSQL

**Opción A: PostgreSQL Local**
```bash
# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql

# Iniciar servicio
# Windows: Automático
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Crear base de datos
createdb hondumarket
```

**Opción B: PostgreSQL en la Nube (Recomendado)**

**Vercel Postgres:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Crear proyecto en Vercel
vercel

# Agregar Postgres
vercel postgres create
```

**Railway:**
1. Ir a https://railway.app
2. Crear nuevo proyecto
3. Agregar PostgreSQL
4. Copiar DATABASE_URL

**Render:**
1. Ir a https://render.com
2. Crear PostgreSQL database
3. Copiar External Database URL

### Paso 3: Actualizar Prisma Schema

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"  // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}

// Actualizar campos que usan String para JSON
model Product {
  // ...
  images     Json      // Cambiar de String a Json
  attributes Json?     // Cambiar de String a Json
  // ...
}

model Order {
  // ...
  shippingAddress Json  // Cambiar de String a Json
  // ...
}
```

### Paso 4: Actualizar Variables de Entorno

```env
# .env
# Comentar SQLite
# DATABASE_URL="file:./dev.db"

# Agregar PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/hondumarket"

# O usar URL de servicio en la nube
# DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

### Paso 5: Crear Nueva Migración

```bash
# Resetear migraciones (opcional)
rm -rf prisma/migrations

# Crear nueva migración inicial
npx prisma migrate dev --name init_postgres

# O aplicar schema directamente
npx prisma db push
```

### Paso 6: Migrar Datos

**Opción A: Script de Migración Manual**

```typescript
// scripts/migrate-to-postgres.ts
import { PrismaClient as SQLiteClient } from '@prisma/client'
import { PrismaClient as PostgresClient } from '@prisma/client'

const sqlite = new SQLiteClient({
  datasources: { db: { url: 'file:./dev.db' } }
})

const postgres = new PostgresClient()

async function migrate() {
  console.log('Starting migration...')

  // Migrar usuarios
  const users = await sqlite.user.findMany()
  for (const user of users) {
    await postgres.user.create({ data: user })
  }
  console.log(`Migrated ${users.length} users`)

  // Migrar categorías
  const categories = await sqlite.category.findMany()
  for (const category of categories) {
    await postgres.category.create({ data: category })
  }
  console.log(`Migrated ${categories.length} categories`)

  // Migrar productos
  const products = await sqlite.product.findMany()
  for (const product of products) {
    await postgres.product.create({
      data: {
        ...product,
        images: JSON.parse(product.images as string),
        attributes: product.attributes ? JSON.parse(product.attributes as string) : null
      }
    })
  }
  console.log(`Migrated ${products.length} products`)

  // ... migrar otras tablas

  console.log('Migration completed!')
}

migrate()
  .catch(console.error)
  .finally(async () => {
    await sqlite.$disconnect()
    await postgres.$disconnect()
  })
```

**Opción B: Usar herramienta de migración**

```bash
# Instalar pgloader (Linux/Mac)
# Ubuntu: sudo apt-get install pgloader
# Mac: brew install pgloader

# Migrar datos
pgloader sqlite://./prisma/dev.db postgresql://user:password@localhost/hondumarket
```

### Paso 7: Actualizar Código

**Archivos a actualizar:**

1. **src/app/api/products/route.ts**
```typescript
// Antes (SQLite)
images: JSON.stringify(images)

// Después (PostgreSQL)
images: images  // PostgreSQL maneja JSON nativamente
```

2. **src/app/api/orders/route.ts**
```typescript
// Antes
shippingAddress: JSON.stringify(address)

// Después
shippingAddress: address
```

3. **Componentes que leen JSON**
```typescript
// Antes
const images = JSON.parse(product.images)

// Después
const images = product.images  // Ya es un objeto
```

### Paso 8: Verificar Migración

```bash
# Verificar conexión
npx prisma db pull

# Ver datos
npx prisma studio

# Ejecutar tests
npm test

# Probar aplicación
npm run dev
```

---

## 🔧 Cambios en el Código

### Schema Changes

```diff
// prisma/schema.prisma

datasource db {
-  provider = "sqlite"
+  provider = "postgresql"
   url      = env("DATABASE_URL")
}

model Product {
-  images     String
+  images     Json
-  attributes String?
+  attributes Json?
}

model Order {
-  shippingAddress String
+  shippingAddress Json
}
```

### API Changes

```diff
// src/app/api/products/route.ts

const product = await prisma.product.create({
  data: {
    title,
    description,
    price,
-    images: JSON.stringify(images),
+    images: images,
-    attributes: JSON.stringify(attributes),
+    attributes: attributes,
  }
})
```

### Component Changes

```diff
// src/components/ProductCard.tsx

-const imageList = JSON.parse(product.images)
+const imageList = product.images
const thumbnail = imageList[0]
```

---

## ⚠️ Consideraciones Importantes

### Diferencias SQLite vs PostgreSQL

| Característica | SQLite | PostgreSQL |
|----------------|--------|------------|
| JSON | String | Json nativo |
| Case sensitivity | No | Sí |
| Boolean | 0/1 | true/false |
| DateTime | String | Timestamp |
| Auto-increment | AUTOINCREMENT | SERIAL |

### Problemas Comunes

**1. Error de conexión SSL**
```env
DATABASE_URL="postgresql://...?sslmode=require"
```

**2. Timeout de conexión**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // Si es necesario
}
```

**3. JSON parsing errors**
- Verificar que todos los campos JSON se actualicen
- Buscar `JSON.parse` y `JSON.stringify` en el código

---

## 📊 Checklist de Migración

### Pre-Migración
- [ ] Backup de base de datos SQLite
- [ ] Backup de código (git commit)
- [ ] PostgreSQL instalado/configurado
- [ ] DATABASE_URL actualizado

### Migración
- [ ] Schema actualizado (sqlite → postgresql)
- [ ] Campos String → Json actualizados
- [ ] Migración de Prisma ejecutada
- [ ] Datos migrados

### Post-Migración
- [ ] Código actualizado (JSON.parse/stringify removidos)
- [ ] Tests ejecutados y pasando
- [ ] Aplicación funciona correctamente
- [ ] Prisma Studio muestra datos correctos

### Deployment
- [ ] Variables de entorno en producción
- [ ] Migración ejecutada en producción
- [ ] Datos verificados en producción
- [ ] Rollback plan documentado

---

## 🔄 Rollback Plan

Si algo sale mal:

```bash
# 1. Restaurar .env
DATABASE_URL="file:./dev.db"

# 2. Restaurar schema.prisma
git checkout prisma/schema.prisma

# 3. Restaurar base de datos
cp prisma/dev.db.backup prisma/dev.db

# 4. Regenerar Prisma Client
npx prisma generate

# 5. Reiniciar aplicación
npm run dev
```

---

## 📚 Recursos

- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)

---

**Última actualización:** 22 de diciembre de 2025
