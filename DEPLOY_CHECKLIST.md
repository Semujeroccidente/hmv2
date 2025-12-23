# ✅ Checklist de Deployment - HonduMarket en Vercel

## Pre-Deployment

- [x] Proyecto Next.js 15 configurado
- [x] Prisma configurado
- [x] Scripts de build actualizados en package.json
- [x] vercel.json creado
- [x] .gitignore actualizado
- [ ] Código pusheado a GitHub/GitLab/Bitbucket

## Configuración de Base de Datos

- [ ] Base de datos en la nube creada (elige una):
  - [ ] Vercel Postgres
  - [ ] Supabase
  - [ ] Neon
  - [ ] PlanetScale
- [ ] DATABASE_URL obtenida
- [ ] Schema de Prisma actualizado (si cambias de SQLite)

## Variables de Entorno en Vercel

- [ ] DATABASE_URL configurada
- [ ] JWT_SECRET generada y configurada (mínimo 32 caracteres)
- [ ] NEXT_PUBLIC_APP_URL configurada (opcional)
- [ ] Variables aplicadas a Production/Preview/Development

## Deploy

- [ ] Proyecto conectado a Vercel
- [ ] Primer deploy ejecutado
- [ ] Build completado exitosamente
- [ ] Migraciones de Prisma ejecutadas (`npx prisma migrate deploy`)
- [ ] Seed de datos ejecutado (opcional)

## Verificación Post-Deploy

- [ ] Sitio carga correctamente
- [ ] Header y navegación funcionan
- [ ] Búsqueda funciona
- [ ] Categorías se muestran correctamente
- [ ] Login/Registro funciona
- [ ] Iconos de categorías se muestran (outline style)
- [ ] Botones con micro-interacciones funcionan
- [ ] Dropdown de categorías funciona
- [ ] Responsive design funciona en mobile
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en Vercel logs

## Optimizaciones Opcionales

- [ ] Dominio personalizado configurado
- [ ] Analytics configurado (Vercel Analytics)
- [ ] Speed Insights habilitado
- [ ] Error tracking (Sentry) configurado
- [ ] CDN para imágenes configurado
- [ ] Rate limiting implementado
- [ ] Backups de base de datos configurados

## Comandos Útiles

```bash
# Deploy desde CLI
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs

# Ver variables de entorno
vercel env ls

# Obtener variables localmente
vercel env pull

# Ejecutar migraciones
npx prisma migrate deploy

# Ver base de datos
npx prisma studio
```

## Links Importantes

- [ ] URL de producción: ___________________________
- [ ] Dashboard de Vercel: https://vercel.com/dashboard
- [ ] Dashboard de base de datos: ___________________________
- [ ] Repositorio Git: ___________________________

## Notas

```
Fecha de deploy: ___________________________
Versión: 1.0.0
Deploy por: ___________________________
Notas adicionales:



```

---

**¡Todo listo para producción! 🚀**
