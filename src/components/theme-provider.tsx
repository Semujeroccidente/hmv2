'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

/**
 * Theme Provider para HonduMarket
 * 
 * Proporciona soporte para modo claro/oscuro usando next-themes
 * - Detecta preferencia del sistema automáticamente
 * - Persiste selección en localStorage
 * - Previene flash de contenido sin estilo (FOUC)
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}
