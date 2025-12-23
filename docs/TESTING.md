# Testing Guide - HonduMarket

**Estado:** Configuración básica completada ✅

---

## 📋 Resumen

Este proyecto tiene configurado **Vitest** para testing unitario e integración, y **Playwright** para tests E2E.

### ✅ Completado

- Vitest configurado
- Testing Library instalado
- Tests básicos creados
- Scripts de npm agregados

### ⏳ Pendiente

- Instalar dependencias (`npm install`)
- Crear más tests unitarios
- Tests de integración para APIs
- Tests E2E con Playwright

---

## 🚀 Comandos Disponibles

```bash
# Ejecutar tests en modo watch
npm test

# Ejecutar tests una vez
npm run test:run

# Ver UI de tests
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e

# Tests E2E con UI
npm run test:e2e:ui
```

---

## 📁 Estructura de Tests

```
src/
├── lib/
│   └── __tests__/
│       ├── auth-utils.test.ts  ✅ Creado
│       └── env.test.ts         ✅ Creado
├── app/
│   └── api/
│       └── __tests__/
│           ├── auth.test.ts    ⏳ Por crear
│           ├── products.test.ts ⏳ Por crear
│           └── cart.test.ts    ⏳ Por crear
└── testing/
    └── setup.ts                ✅ Creado

e2e/
├── auth.spec.ts                ⏳ Por crear
├── product-creation.spec.ts    ⏳ Por crear
└── checkout.spec.ts            ⏳ Por crear
```

---

## 🧪 Tests Existentes

### 1. auth-utils.test.ts

Tests para la función `handleAdminError`:
- ✅ Error UNAUTHORIZED → 401
- ✅ Error INVALID_TOKEN → 401
- ✅ Error FORBIDDEN → 403
- ✅ Error USER_NOT_FOUND → 404
- ✅ Errores desconocidos → 500

### 2. env.test.ts

Tests para validación de entorno:
- ✅ JWT_SECRET definido
- ✅ DATABASE_URL definido
- ✅ NODE_ENV = test

---

## 📝 Cómo Agregar Tests

### Test Unitario

```typescript
// src/lib/__tests__/utils.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from '../utils'

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input')
    expect(result).toBe('expected')
  })
})
```

### Test de API (Integración)

```typescript
// src/app/api/__tests__/auth.test.ts
import { describe, it, expect, vi } from 'vitest'
import { POST as loginHandler } from '../auth/login/route'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn()
    }
  }
}))

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    // Test implementation
  })
})
```

### Test E2E

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('should register new user', async ({ page }) => {
  await page.goto('/register')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.fill('input[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/')
})
```

---

## 🔧 Configuración

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/testing/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
})
```

---

## 📊 Cobertura Objetivo

| Tipo | Objetivo | Actual |
|------|----------|--------|
| Utilidades | 80% | ~10% |
| APIs | 70% | 0% |
| E2E | Flujos críticos | 0% |

---

## 🎯 Próximos Pasos

### 1. Instalar Dependencias

```bash
npm install
```

Si hay problemas con npm, intentar:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 2. Ejecutar Tests Existentes

```bash
npm test
```

Deberías ver 2 archivos de test con ~8 tests pasando.

### 3. Agregar Tests de Integración

Crear tests para las APIs más críticas:
- `/api/auth/login`
- `/api/auth/register`
- `/api/products`
- `/api/cart`

### 4. Configurar Playwright

```bash
npx playwright install
```

Luego crear tests E2E para:
- Flujo de registro/login
- Creación de producto
- Proceso de compra

---

## 🐛 Troubleshooting

### Error: Cannot find module 'vitest'

**Solución:** Ejecutar `npm install`

### Tests no se ejecutan

**Solución:** Verificar que vitest.config.ts esté en la raíz del proyecto

### Errores de tipos en tests

**Solución:** Agregar `/// <reference types="vitest" />` al inicio del archivo

---

## 📚 Recursos

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [MSW (API Mocking)](https://mswjs.io/)

---

**Última actualización:** 22 de diciembre de 2025
