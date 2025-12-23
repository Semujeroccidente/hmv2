#!/usr/bin/env node

/**
 * Script de actualización masiva para implementar mejoras de seguridad
 * Actualiza rutas admin, archivos auth y TODOs de autenticación
 */

const fs = require('fs');
const path = require('path');

// Colores para output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Archivos a actualizar
const adminRoutes = [
    'src/app/api/admin/orders/route.ts',
    'src/app/api/admin/categories/route.ts',
    'src/app/api/admin/categories/[id]/route.ts',
    'src/app/api/admin/reports/[id]/route.ts',
    'src/app/api/admin/dashboard/stats/route.ts',
    'src/app/api/admin/auctions/route.ts'
];

const authFiles = [
    'src/app/api/auth/me/route.ts',
    'src/app/api/auth/register/route.ts',
    'src/app/api/products/route.ts'
];

const todoFiles = [
    'src/app/api/auctions/[id]/route.ts',
    'src/app/api/social/messages/route.ts'
];

let stats = {
    updated: 0,
    failed: 0,
    skipped: 0
};

/**
 * Actualiza rutas admin con verificación de rol
 */
function updateAdminRoute(filePath) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        log(`  ⚠️  Archivo no encontrado: ${filePath}`, 'yellow');
        stats.skipped++;
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 1. Agregar import si no existe
    if (!content.includes('requireAdmin')) {
        content = content.replace(
            /import { prisma } from ['"]@\/lib\/prisma['"]/,
            `import { prisma } from '@/lib/prisma'\nimport { requireAdmin, handleAdminError } from '@/lib/auth-utils'`
        );
        modified = true;
    }

    // 2. Agregar verificación en GET
    if (content.includes('export async function GET') && !content.match(/GET[^{]*{\s*try\s*{\s*(?:\/\/[^\n]*\n\s*)?await requireAdmin/)) {
        content = content.replace(
            /(export async function GET\([^)]+\)\s*{\s*try\s*{)/,
            `$1\n    // Verify admin role\n    await requireAdmin(request)\n    `
        );
        modified = true;
    }

    // 3. Agregar verificación en POST
    if (content.includes('export async function POST') && !content.match(/POST[^{]*{\s*try\s*{\s*(?:\/\/[^\n]*\n\s*)?await requireAdmin/)) {
        content = content.replace(
            /(export async function POST\([^)]+\)\s*{\s*try\s*{)/,
            `$1\n    // Verify admin role\n    await requireAdmin(request)\n    `
        );
        modified = true;
    }

    // 4. Agregar verificación en PUT
    if (content.includes('export async function PUT') && !content.match(/PUT[^{]*{\s*try\s*{\s*(?:\/\/[^\n]*\n\s*)?await requireAdmin/)) {
        content = content.replace(
            /(export async function PUT\([^)]+\)\s*{\s*try\s*{)/,
            `$1\n    // Verify admin role\n    await requireAdmin(request)\n    `
        );
        modified = true;
    }

    // 5. Agregar verificación en DELETE
    if (content.includes('export async function DELETE') && !content.match(/DELETE[^{]*{\s*try\s*{\s*(?:\/\/[^\n]*\n\s*)?await requireAdmin/)) {
        content = content.replace(
            /(export async function DELETE\([^)]+\)\s*{\s*try\s*{)/,
            `$1\n    // Verify admin role\n    await requireAdmin(request)\n    `
        );
        modified = true;
    }

    // 6. Actualizar manejo de errores
    content = content.replace(
        /} catch \(error\) {/g,
        '} catch (error: any) {'
    );

    // 7. Agregar manejo de errores de admin si no existe
    if (!content.includes('handleAdminError')) {
        content = content.replace(
            /(} catch \(error: any\) {\s*)/g,
            `$1// Handle admin auth errors\n    const authError = handleAdminError(error)\n    if (authError.status !== 500) {\n      return NextResponse.json({ error: authError.error }, { status: authError.status })\n    }\n    \n    `
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        log(`  ✅ Actualizado: ${filePath}`, 'green');
        stats.updated++;
    } else {
        log(`  ⏭️  Sin cambios: ${filePath}`, 'cyan');
        stats.skipped++;
    }
}

/**
 * Actualiza archivos de auth para eliminar secrets hardcodeados
 */
function updateAuthFile(filePath) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        log(`  ⚠️  Archivo no encontrado: ${filePath}`, 'yellow');
        stats.skipped++;
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 1. Reemplazar secret hardcodeado
    if (content.includes("|| 'your-secret-key'") || content.includes('|| "your-secret-key"')) {
        content = content.replace(
            /const JWT_SECRET = process\.env\.JWT_SECRET \|\| ['"]your-secret-key['"]/,
            `const JWT_SECRET = process.env.JWT_SECRET\nif (!JWT_SECRET) {\n  throw new Error('JWT_SECRET environment variable is required')\n}`
        );
        modified = true;
    }

    // 2. Agregar non-null assertion en jwt.sign
    content = content.replace(
        /jwt\.sign\(([^,]+),\s*JWT_SECRET,/g,
        'jwt.sign($1, JWT_SECRET!,'
    );

    // 3. Agregar non-null assertion en jwt.verify
    content = content.replace(
        /jwt\.verify\(([^,]+),\s*JWT_SECRET\)/g,
        'jwt.verify($1, JWT_SECRET!)'
    );

    // 4. Reemplazar 'as any' con validación
    if (content.includes('jwt.verify') && content.includes('as any')) {
        content = content.replace(
            /const decoded = jwt\.verify\([^)]+\) as any/,
            `let decoded: any\n    try {\n      decoded = jwt.verify(token, JWT_SECRET!)\n    } catch {\n      throw new Error('INVALID_TOKEN')\n    }\n    \n    // Validate token structure\n    if (!decoded.userId || !decoded.email || !decoded.role) {\n      throw new Error('INVALID_TOKEN')\n    }`
        );
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        log(`  ✅ Actualizado: ${filePath}`, 'green');
        stats.updated++;
    } else {
        log(`  ⏭️  Sin cambios: ${filePath}`, 'cyan');
        stats.skipped++;
    }
}

/**
 * Actualiza TODOs de autenticación
 */
function updateTodoFile(filePath) {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        log(`  ⚠️  Archivo no encontrado: ${filePath}`, 'yellow');
        stats.skipped++;
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 1. Agregar import si no existe
    if (!content.includes('requireAuth') && !content.includes('auth-middleware')) {
        content = content.replace(
            /import { prisma } from ['"]@\/lib\/prisma['"]/,
            `import { prisma } from '@/lib/prisma'\nimport { requireAuth, handleAuthError } from '@/lib/auth-middleware'`
        );
        modified = true;
    }

    // 2. Reemplazar TODOs con implementación real
    content = content.replace(
        /\/\/ TODO: Get user from session\/auth\s*const userId = ['"]user-id-temporal['"]/g,
        `const authUser = await requireAuth(request)\n    const userId = authUser.userId`
    );

    content = content.replace(
        /\/\/ TODO: Obtener usuario real de la sesión\s*const userId = ['"]user-id-temporal['"]/g,
        `const authUser = await requireAuth(request)\n    const userId = authUser.userId`
    );

    content = content.replace(
        /\/\/ TODO: Session User\s*const userId = ['"]user-id-temporal['"]/g,
        `const authUser = await requireAuth(request)\n    const userId = authUser.userId`
    );

    // 3. Actualizar manejo de errores si es necesario
    if (modified && !content.includes('handleAuthError')) {
        content = content.replace(
            /(} catch \(error\) {)/g,
            `} catch (error: any) {\n    const authError = handleAuthError(error)\n    if (authError.status !== 500) {\n      return NextResponse.json({ error: authError.error }, { status: authError.status })\n    }\n    `
        );
    }

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        log(`  ✅ Actualizado: ${filePath}`, 'green');
        stats.updated++;
    } else {
        log(`  ⏭️  Sin cambios: ${filePath}`, 'cyan');
        stats.skipped++;
    }
}

/**
 * Función principal
 */
function main() {
    log('\n🚀 Iniciando actualización masiva de seguridad...\n', 'blue');

    // Actualizar rutas admin
    log('📁 Actualizando rutas admin...', 'cyan');
    adminRoutes.forEach(updateAdminRoute);

    log('\n🔐 Actualizando archivos de autenticación...', 'cyan');
    authFiles.forEach(updateAuthFile);

    log('\n📝 Actualizando TODOs de autenticación...', 'cyan');
    todoFiles.forEach(updateTodoFile);

    // Resumen
    log('\n' + '='.repeat(50), 'blue');
    log('📊 Resumen de actualización:', 'blue');
    log('='.repeat(50), 'blue');
    log(`  ✅ Archivos actualizados: ${stats.updated}`, 'green');
    log(`  ⏭️  Archivos sin cambios: ${stats.skipped}`, 'cyan');
    log(`  ❌ Archivos fallidos: ${stats.failed}`, 'red');
    log('='.repeat(50) + '\n', 'blue');

    if (stats.updated > 0) {
        log('✨ Actualización completada exitosamente!', 'green');
        log('\n📋 Próximos pasos:', 'yellow');
        log('  1. Revisar los cambios con: git diff', 'yellow');
        log('  2. Ejecutar build: npm run build', 'yellow');
        log('  3. Probar autenticación admin manualmente', 'yellow');
        log('  4. Commit cambios si todo funciona\n', 'yellow');
    }
}

// Ejecutar
try {
    main();
} catch (error) {
    log(`\n❌ Error fatal: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}
