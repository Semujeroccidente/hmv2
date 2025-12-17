# HonduraMarket - Marketplace estilo eBay/Amazon para Honduras

Un marketplace completo y moderno construido con Next.js 15, TypeScript, Tailwind CSS y Prisma. Diseñado específicamente para el mercado hondureño.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **🏠 Página Principal Moderna** con diseño responsive y atractivo
- **🔐 Sistema de Autenticación Completo** (registro, login, logout)
- **📦 Gestión de Productos** con categorías, imágenes y búsqueda
- **🛒 Carrito de Compras** funcional
- **🏆 Sistema de Subastas** en tiempo real
- **⭐ Sistema de Reseñas y Valoraciones**
- **👤 Perfiles de Usuario** con estadísticas
- **📱 Diseño Mobile-First** y totalmente responsive
- **🎨 UI/UX Profesional** con shadcn/ui components

### 📋 Características Técnicas

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** para estilos modernos
- **Prisma ORM** con base de datos SQLite
- **shadcn/ui** components library
- **JWT Authentication** con cookies seguras
- **API RESTful** completa
- **Validación de datos** con Zod
- **Password hashing** con bcryptjs

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js 18+ o Bun
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repositorio-url>
   cd hondumarket
   ```

2. **Instalar dependencias**
   ```bash
   bun install
   # o con npm
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Configurar las siguientes variables en `.env`:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="tu-secreto-super-seguro"
   NEXTAUTH_SECRET="tu-secreto-de-nextauth"
   ```

4. **Inicializar base de datos**
   ```bash
   bun run db:push
   ```

5. **Poblar datos de ejemplo**
   ```bash
   # Visita http://localhost:3000/api/seed en tu navegador
   # o usa curl:
   curl -X POST http://localhost:3000/api/seed
   ```

6. **Iniciar servidor de desarrollo**
   ```bash
   bun run dev
   ```

7. **Abrir en navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
hondumarket/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # Rutas API
│   │   │   ├── auth/         # Autenticación
│   │   │   ├── products/      # Productos
│   │   │   ├── categories/    # Categorías
│   │   │   └── seed/         # Seed de datos
│   │   ├── login/            # Página de login
│   │   ├── register/         # Página de registro
│   │   └── page.tsx          # Página principal
│   ├── components/
│   │   ├── ui/               # Componentes shadcn/ui
│   │   └── marketplace/      # Componentes del marketplace
│   │       ├── header.tsx
│   │       ├── product-card.tsx
│   │       ├── auction-card.tsx
│   │       └── user-profile.tsx
│   └── lib/
│       ├── db.ts             # Cliente Prisma
│       └── utils.ts          # Utilidades
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   └── seed.ts              # Script de seed
└── public/                  # Archivos estáticos
```

## 🎯 Uso del Sistema

### Para Compradores

1. **Registrarse** en la plataforma
2. **Explorar productos** por categorías o búsqueda
3. **Ver detalles** del producto y vendedor
4. **Añadir al carrito** y finalizar compra
5. **Dejar reseñas** de productos comprados
6. **Participar en subastas** si lo desea

### Para Vendedores

1. **Registrarse** como vendedor
2. **Publicar productos** con fotos y descripción
3. **Gestionar inventario** y precios
4. **Crear subastas** para productos especiales
5. **Comunicarse con compradores**
6. **Recibir pagos** y gestionar envíos

### Características Especiales

- **🔍 Búsqueda Avanzada**: Filtra por categoría, precio, condición
- **💬 Mensajería Interna**: Comunícate directamente con vendedores
- **❤️ Favoritos**: Guarda productos que te interesen
- **⏰ Subastas en Tiempo Real**: Puja por productos únicos
- **📊 Estadísticas de Vendedor**: Seguimiento de ventas y calificaciones

## 🔧 Desarrollo Local

### Comandos Útiles

```bash
# Iniciar servidor de desarrollo
bun run dev

# Ejecutar linting
bun run lint

# Generar cliente Prisma
bun run db:generate

# Hacer push a la base de datos
bun run db:push

# Ver logs de desarrollo
tail -f dev.log
```

### Flujo de Trabajo

1. **Crear rama** para nuevas funcionalidades
2. **Desarrollar** con componentes reutilizables
3. **Probar** en entorno local
4. **Hacer commit** con mensajes claros
5. **Crear Pull Request** para revisión

## 📱 Accesibilidad y Responsive

- **Mobile-First Design**: Optimizado para móviles primero
- **Responsive Design**: Se adapta a tablets y desktops
- **Accessibility**: Cumple con estándares WCAG 2.1
- **Keyboard Navigation**: Totalmente navegable por teclado
- **Screen Reader Support**: Compatible con lectores de pantalla

## 🔒 Seguridad Implementada

- **JWT Authentication**: Tokens seguros con expiración
- **Password Hashing**: Contraseñas hasheadas con bcrypt
- **Input Validation**: Validación estricta con Zod
- **SQL Injection Prevention**: Protección con Prisma ORM
- **XSS Prevention**: Sanitización de datos
- **CSRF Protection**: Tokens CSRF en formularios

## 🚀 Despliegue

### Variables de Entorno para Producción

```env
DATABASE_URL="tu-database-url-produccion"
JWT_SECRET="tu-jwt-secret-produccion"
NEXTAUTH_URL="https://tudominio.com"
NODE_ENV="production"
```

### Plataformas de Despliegue

- **Vercel**: Recomendado para frontend
- **Railway**: Para backend completo
- **Render**: Alternativa a Vercel
- **Netlify**: Para frontend estático

## 🤝 Contribución

1. **Fork** el proyecto
2. **Crear rama** (`git checkout -b feature/amazing-feature`)
3. **Hacer commit** (`git commit -m 'Add amazing feature'`)
4. **Push** a la rama (`git push origin feature/amazing-feature`)
5. **Abrir Pull Request**

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. **Revisa la documentación** en este README
2. **Busca issues** existentes en GitHub
3. **Crea un issue** nuevo con detalles del problema
4. **Contacta al equipo** de desarrollo

## 🎈 Roadmap Futuro

- [ ] **💳 Integración de Pasarelas de Pago** (Stripe, PayPal)
- [ ] **📱 App Móvil Nativa** (React Native)
- [ ] **🤖 Inteligencia Artificial** para recomendaciones
- [ ] **📊 Analytics Avanzado** para vendedores
- [ ] **🌐 Internacionalización** a otros países
- [ ] **🚚 Integración con Servicios de Envío**
- [ ] **🔔 Sistema de Notificaciones Push**
- [ ] **📹 Videollamadas** para ver productos

---

**Desarrollado con ❤️ para el mercado hondureño**