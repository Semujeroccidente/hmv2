'use client'

import { useState, useEffect } from 'react'
import { UserManagement } from '@/components/admin/user-management'

export default function UsuariosPage() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/admin/users')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                setUsers(Array.isArray(data.users) ? data.users : [])
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching users:', err)
                setUsers([])
                setLoading(false)
            })
    }, [])

    const handleUserUpdate = async (userId: string, updates: any) => {
        try {
            const response = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            })

            if (response.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
            }
        } catch (error) {
            console.error('Error updating user:', error)
        }
    }

    const handleUserCreate = async (userData: any) => {
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })

            if (response.ok) {
                const newUser = await response.json()
                setUsers([...users, newUser])
            }
        } catch (error) {
            console.error('Error creating user:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Usuarios
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra todos los usuarios de la plataforma
                </p>
            </div>

            <UserManagement
                users={users}
                onUserUpdate={handleUserUpdate}
                onUserCreate={handleUserCreate}
            />
        </div>
    )
}
