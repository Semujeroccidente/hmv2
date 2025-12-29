import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyAuth } from '@/lib/auth-middleware'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Verificar autenticación y rol de admin
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
        redirect('/login?redirect=/admin')
    }

    // Crear un request mock para verifyAuth
    const mockRequest = {
        cookies: {
            get: (name: string) => ({ value: token })
        }
    } as any

    const user = await verifyAuth(mockRequest)

    if (!user || user.role !== 'ADMIN') {
        redirect('/')
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
