'use client'

import { Messaging } from '@/components/social/Messaging'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function MensajesPage() {
    return (
        <div className="container mx-auto py-8">
            <Link href="/perfil" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver al panel
            </Link>
            <h1 className="text-3xl font-bold mb-6">Mis Mensajes</h1>
            <Messaging />
        </div>
    )
}
