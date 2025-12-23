#!/usr/bin/env node

/**
 * Script para corregir validación de JWT_SECRET en archivos auth
 * Mueve la validación de module-load time a runtime
 */

const fs = require('fs');
const path = require('path');

const files = [
    'src/lib/auth-middleware.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/me/route.ts',
    'src/app/api/auth/register/route.ts',
    'src/app/api/products/route.ts'
];

files.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Archivo no encontrado: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');

    // Reemplazar validación en module load con función
    content = content.replace(
        /const JWT_SECRET = process\.env\.JWT_SECRET\s*\nif \(!JWT_SECRET\) \{\s*\n\s*throw new Error\('JWT_SECRET environment variable is required'\)\s*\n\}/g,
        `function getJWTSecret(): string {\n  const secret = process.env.JWT_SECRET\n  if (!secret) {\n    throw new Error('JWT_SECRET environment variable is required')\n  }\n  return secret\n}`
    );

    // Reemplazar JWT_SECRET! con getJWTSecret()
    content = content.replace(/JWT_SECRET!/g, 'getJWTSecret()');

    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Actualizado: ${filePath}`);
});

console.log('\n✨ Corrección completada!');
