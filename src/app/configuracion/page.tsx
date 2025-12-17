'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { User, Bell, Shield, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracionPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        // Mock save delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
        toast.success('Cambios guardados correctamente')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link href="/perfil" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al panel
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="account">Cuenta</TabsTrigger>
                        <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Perfil Público</CardTitle>
                                <CardDescription>
                                    Esta información será visible para otros usuarios.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                                        <AvatarFallback>UD</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Cambiar Avatar</Button>
                                </div>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input id="name" defaultValue="Usuario Demo" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="bio">Biografía</Label>
                                        <Textarea id="bio" placeholder="Cuéntanos un poco sobre ti..." />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Ubicación</Label>
                                        <Input id="location" defaultValue="Tegucigalpa, Honduras" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isLoading}>
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información de la Cuenta</CardTitle>
                                <CardDescription>
                                    Gestiona tu información personal y de contacto.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input id="email" type="email" defaultValue="demo@hondumarket.com" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Teléfono</Label>
                                    <Input id="phone" type="tel" defaultValue="+504 9999-9999" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isLoading}>
                                    Guardar Cambios
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de Notificaciones</CardTitle>
                                <CardDescription>
                                    Elige qué notificaciones quieres recibir.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="new-orders" className="flex flex-col space-y-1">
                                        <span>Nuevos Pedidos</span>
                                        <span className="font-normal text-xs text-muted-foreground">Recibe avisos cuando alguien compre tus productos.</span>
                                    </Label>
                                    <Switch id="new-orders" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="messages" className="flex flex-col space-y-1">
                                        <span>Mensajes</span>
                                        <span className="font-normal text-xs text-muted-foreground">Notificaciones de nuevos mensajes privados.</span>
                                    </Label>
                                    <Switch id="messages" defaultChecked />
                                </div>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                        <span>Promociones</span>
                                        <span className="font-normal text-xs text-muted-foreground">Recibe correos sobre ofertas y novedades.</span>
                                    </Label>
                                    <Switch id="marketing" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} disabled={isLoading}>
                                    Guardar Preferencias
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Seguridad</CardTitle>
                                <CardDescription>
                                    Actualiza tu contraseña y seguridad de la cuenta.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="current-password">Contraseña Actual</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSave} variant="destructive" disabled={isLoading}>
                                    Actualizar Contraseña
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
