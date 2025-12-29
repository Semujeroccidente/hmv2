'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Globe, Mail, Bell, Shield } from 'lucide-react'

export default function ConfiguracionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Configuración
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Ajustes generales de la plataforma
                </p>
            </div>

            <Tabs defaultValue="general">
                <TabsList>
                    <TabsTrigger value="general">
                        <Settings className="h-4 w-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="site">
                        <Globe className="h-4 w-4 mr-2" />
                        Sitio Web
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notificaciones
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="h-4 w-4 mr-2" />
                        Seguridad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración General</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Nombre del Sitio</Label>
                                <Input id="siteName" defaultValue="HonduMarket" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Descripción</Label>
                                <Input id="siteDescription" defaultValue="Marketplace de Honduras" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="maintenance">Modo Mantenimiento</Label>
                                <Switch id="maintenance" />
                            </div>
                            <Button>Guardar Cambios</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="site" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración del Sitio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Configuración del sitio web próximamente</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="email" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Configuración de email próximamente</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de Notificaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Configuración de notificaciones próximamente</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración de Seguridad</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Configuración de seguridad próximamente</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
