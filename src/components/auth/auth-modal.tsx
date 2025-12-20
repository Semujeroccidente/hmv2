'use client'

import { useState } from 'react'
import { X, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [step, setStep] = useState<'email' | 'password' | 'register'>('email')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleEmailContinue = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa tu email",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        try {
            // Verificar si el usuario existe
            const response = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (response.ok) {
                const data = await response.json()
                if (data.exists) {
                    setStep('password')
                } else {
                    setStep('register')
                }
            } else {
                // Si la API no existe, asumir que vamos a login
                setStep('password')
            }
        } catch (error) {
            console.error('Error checking email:', error)
            // En caso de error, continuar al paso de contraseña
            setStep('password')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa tu contraseña",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "¡Bienvenido!",
                    description: `Has iniciado sesión como ${data.user.name}`,
                })
                // Recargar la página para actualizar el estado del usuario
                window.location.reload()
            } else {
                toast({
                    title: "Error al iniciar sesión",
                    description: data.error || "Credenciales inválidas",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error('Error logging in:', error)
            toast({
                title: "Error",
                description: "Ocurrió un error al iniciar sesión",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !password.trim()) {
            toast({
                title: "Error",
                description: "Por favor completa todos los campos",
                variant: "destructive"
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name
                })
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "¡Cuenta creada!",
                    description: `Bienvenido ${data.user.name}`,
                })
                // Recargar la página para actualizar el estado del usuario
                window.location.reload()
            } else {
                toast({
                    title: "Error al registrarse",
                    description: data.error || "No se pudo crear la cuenta",
                    variant: "destructive"
                })
            }
        } catch (error) {
            console.error('Error registering:', error)
            toast({
                title: "Error",
                description: "Ocurrió un error al crear la cuenta",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = (provider: string) => {
        toast({
            title: "Próximamente",
            description: `Inicio de sesión con ${provider} estará disponible pronto`,
        })
    }

    const resetModal = () => {
        setStep('email')
        setEmail('')
        setPassword('')
        setName('')
        setShowPassword(false)
        setIsLoading(false)
    }

    const handleClose = () => {
        resetModal()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                    aria-label="Cerrar"
                >
                    <X className="h-5 w-5 text-gray-600" />
                </button>

                {/* Content */}
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-azul-700 mb-3">
                            {step === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
                        </h1>
                        <div className="flex items-center gap-2 text-verde-700">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-medium">Todos los datos están protegidos</span>
                        </div>
                    </div>

                    {/* Email Step */}
                    {step === 'email' && (
                        <form onSubmit={handleEmailContinue} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 text-base border-gray-300 focus:border-azul-700 focus:ring-azul-700"
                                    required
                                    autoFocus
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold rounded-full"
                                style={{ backgroundColor: '#FF7F00', color: 'white' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verificando...' : 'Continuar'}
                            </Button>
                        </form>
                    )}

                    {/* Password Step (Login) */}
                    {step === 'password' && (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="h-12 text-base bg-gray-50"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep('email')}
                                        className="text-sm text-azul-700"
                                    >
                                        Cambiar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 text-base border-gray-300 focus:border-azul-700 focus:ring-azul-700 pr-10"
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold rounded-full"
                                style={{ backgroundColor: '#FF7F00', color: 'white' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    className="text-sm text-azul-700 hover:text-azul-600 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Register Step */}
                    {step === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="h-12 text-base bg-gray-50"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep('email')}
                                        className="text-sm text-azul-700"
                                    >
                                        Cambiar
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Nombre completo
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Juan Pérez"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 text-base border-gray-300 focus:border-azul-700 focus:ring-azul-700"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Crea una contraseña segura"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 text-base border-gray-300 focus:border-azul-700 focus:ring-azul-700 pr-10"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold rounded-full"
                                style={{ backgroundColor: '#FF7F00', color: 'white' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                            </Button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-600">
                                    ¿Ya tienes cuenta?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setStep('password')}
                                        className="text-verde-700 hover:text-verde-600 font-semibold hover:underline"
                                    >
                                        Inicia sesión
                                    </button>
                                </p>
                            </div>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">O continúa de otra manera</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-xl hover:border-azul-700 hover:bg-azul-50 transition-all"
                            aria-label="Google"
                        >
                            <svg className="h-6 w-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-xl hover:border-azul-700 hover:bg-azul-50 transition-all"
                            aria-label="Facebook"
                        >
                            <svg className="h-6 w-6" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Apple')}
                            className="flex items-center justify-center p-4 border-2 border-gray-300 rounded-xl hover:border-azul-700 hover:bg-azul-50 transition-all"
                            aria-label="Apple"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="text-xs text-center text-gray-600 leading-relaxed">
                        Al continuar, acepta nuestro{' '}
                        <a href="/terminos" className="text-azul-700 hover:underline font-medium">
                            Términos de uso
                        </a>{' '}
                        y reconoce que ha leído nuestro{' '}
                        <a href="/privacidad" className="text-azul-700 hover:underline font-medium">
                            Política de privacidad
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
