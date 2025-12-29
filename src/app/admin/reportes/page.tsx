'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function ReportesPage() {
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Aquí iría el fetch de reportes
        setLoading(false)
    }, [])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Reportes
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Revisa y modera los reportes de usuarios y productos
                </p>
            </div>

            <Tabs defaultValue="pending">
                <TabsList>
                    <TabsTrigger value="pending">
                        <Clock className="h-4 w-4 mr-2" />
                        Pendientes
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobados
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazados
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reportes Pendientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-500">
                                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No hay reportes pendientes</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reportes Aprobados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-500">
                                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No hay reportes aprobados</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reportes Rechazados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center py-12 text-gray-500">
                                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No hay reportes rechazados</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
