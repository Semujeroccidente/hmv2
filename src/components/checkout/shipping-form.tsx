'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'

interface ShippingFormProps {
    address: ShippingAddress
    onChange: (data: ShippingAddress) => void
    errors?: Record<string, string>
}

export interface ShippingAddress {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export function ShippingForm({ address, onChange, errors = {} }: ShippingFormProps) {
    const handleChange = (field: keyof ShippingAddress, value: string) => {
        onChange({ ...address, [field]: value })
    }

    const departamentos = [
        'Francisco Morazán',
        'Cortés',
        'Atlántida',
        'Yoro',
        'Copán',
        'Olancho',
        'Santa Bárbara',
        'Gracias a Dios',
        'Lempira',
        'Intibucá',
        'La Paz',
        'Islas de la Bahía',
        'Valle',
        'Choluteca'
    ]

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <CardTitle>Dirección de Envío</CardTitle>
                </div>
                <CardDescription>
                    Ingresa la dirección donde deseas recibir tu pedido
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="street">Dirección *</Label>
                        <Input
                            id="street"
                            placeholder="Calle, número, colonia..."
                            value={address.street}
                            onChange={(e) => handleChange('street', e.target.value)}
                            className={errors.street ? 'border-red-500' : ''}
                        />
                        {errors.street && (
                            <p className="text-sm text-red-500">{errors.street}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">Ciudad *</Label>
                            <Input
                                id="city"
                                placeholder="Ej: Tegucigalpa"
                                value={address.city}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={errors.city ? 'border-red-500' : ''}
                            />
                            {errors.city && (
                                <p className="text-sm text-red-500">{errors.city}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="state">Departamento *</Label>
                            <select
                                id="state"
                                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.state ? 'border-red-500' : ''}`}
                                value={address.state}
                                onChange={(e) => handleChange('state', e.target.value)}
                            >
                                <option value="">Selecciona un departamento</option>
                                {departamentos.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            {errors.state && (
                                <p className="text-sm text-red-500">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Código Postal *</Label>
                            <Input
                                id="zipCode"
                                placeholder="11101"
                                value={address.zipCode}
                                onChange={(e) => handleChange('zipCode', e.target.value)}
                                className={errors.zipCode ? 'border-red-500' : ''}
                            />
                            {errors.zipCode && (
                                <p className="text-sm text-red-500">{errors.zipCode}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">País</Label>
                            <Input
                                id="country"
                                value="Honduras"
                                disabled
                                className="bg-gray-50"
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
