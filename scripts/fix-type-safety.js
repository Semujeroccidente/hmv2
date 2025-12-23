#!/usr/bin/env node

/**
 * Script para reemplazar 'as any' con tipos apropiados
 */

const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/categoria/[...slug]/page.tsx',
        replacements: [
            {
                from: /categories={allCategories as any}/g,
                to: 'categories={allCategories}'
            }
        ],
        addImport: "import { CategoryWithRelations } from '@/types/prisma'"
    },
    {
        file: 'src/app/search/page.tsx',
        replacements: [
            {
                from: /initialProducts={mappedProducts as any}/g,
                to: 'initialProducts={mappedProducts}'
            },
            {
                from: /category={searchCategory as any}/g,
                to: 'category={searchCategory}'
            },
            {
                from: /categories={mappedCategories as any}/g,
                to: 'categories={mappedCategories}'
            }
        ],
        addImport: "import { ProductWithRelations, CategoryWithRelations } from '@/types/prisma'"
    },
    {
        file: 'src/app/mis-ventas/page.tsx',
        replacements: [
            {
                from: /\(product as any\)\.views/g,
                to: 'product.views'
            }
        ]
    },
    {
        file: 'src/app/vender/page.tsx',
        replacements: [
            {
                from: /resolver: zodResolver\(formSchema\) as any/g,
                to: 'resolver: zodResolver(formSchema)'
            },
            {
                from: /const firstError = Object\.values\(errors\)\[0\] as any/g,
                to: 'const firstError = Object.values(errors)[0] as { message?: string }'
            }
        ]
    }
];

let totalUpdated = 0;
let totalFailed = 0;

console.log('\n🔧 Reemplazando "as any" con tipos apropiados...\n');

updates.forEach(({ file, replacements, addImport }) => {
    const fullPath = path.join(process.cwd(), file);

    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️  Archivo no encontrado: ${file}`);
        totalFailed++;
        return;
    }

    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // Add import if specified
    if (addImport && !content.includes(addImport)) {
        // Find last import statement
        const importRegex = /^import .+ from .+$/gm;
        const imports = content.match(importRegex);
        if (imports && imports.length > 0) {
            const lastImport = imports[imports.length - 1];
            content = content.replace(lastImport, `${lastImport}\n${addImport}`);
            modified = true;
        }
    }

    // Apply replacements
    replacements.forEach(({ from, to }) => {
        if (content.match(from)) {
            content = content.replace(from, to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`✅ Actualizado: ${file}`);
        totalUpdated++;
    } else {
        console.log(`⏭️  Sin cambios: ${file}`);
    }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Archivos actualizados: ${totalUpdated}`);
console.log(`❌ Archivos fallidos: ${totalFailed}`);
console.log('='.repeat(50) + '\n');

if (totalUpdated > 0) {
    console.log('✨ Actualización de tipos completada!\n');
}
