import { describe, it, expect } from 'vitest'
import { handleAuthError } from '../auth-middleware'

describe('auth-middleware', () => {
    describe('handleAuthError', () => {
        it('should return 401 for UNAUTHORIZED error', () => {
            const error = new Error('UNAUTHORIZED')
            const result = handleAuthError(error)

            expect(result.status).toBe(401)
            expect(result.error).toBe('No estás autenticado')
        })

        it('should return 403 for FORBIDDEN error', () => {
            const error = new Error('FORBIDDEN')
            const result = handleAuthError(error)

            expect(result.status).toBe(403)
            expect(result.error).toBe('No tienes permisos para realizar esta acción')
        })

        it('should return 500 for unknown errors', () => {
            const error = new Error('UNKNOWN_ERROR')
            const result = handleAuthError(error)

            expect(result.status).toBe(500)
            expect(result.error).toBe('Error interno del servidor')
        })
    })
})
