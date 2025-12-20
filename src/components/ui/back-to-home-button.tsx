'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BackToHomeButton() {
    return (
        <Link href="/" className="inline-block mb-6">
            <Button
                variant="outline"
                className="group flex items-center gap-2 border-2 transition-all duration-200 hover:scale-105"
                style={{
                    borderColor: '#003366',
                    color: '#003366'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#003366'
                    e.currentTarget.style.color = '#ffffff'
                    e.currentTarget.style.borderColor = '#00A896'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#003366'
                    e.currentTarget.style.borderColor = '#003366'
                }}
            >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <Home className="h-4 w-4" />
                Volver al inicio
            </Button>
        </Link>
    )
}
