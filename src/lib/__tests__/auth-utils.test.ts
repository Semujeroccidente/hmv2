import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleAdminError } from '../auth-utils'

describe('auth-utils', () => {
    describe('handleAdminError', () => {
        it('should return 401 for UNAUTHORIZED error', () => {
            const error = new Error('UNAUTHORIZED')
            const result = handleAdminError(error)

            expect(result.status).toBe(401)
            expect(result.error).toBe('No autenticado')
        })

        it('should return 401 for INVALID_TOKEN error', () => {
            const error = new Error('INVALID_TOKEN')
            const result = handleAdminError(error)

            expect(result.status).toBe(401)
            expect(result.error).toBe('Token inválido')
        })

        it('should return 403 for FORBIDDEN error', () => {
            const error = new Error('FORBIDDEN')
            const result = handleAdminError(error)

            expect(result.status).toBe(403)
            expect(result.error).toBe('No autorizado - Se requiere rol de administrador')
        })

        it('should return 404 for USER_NOT_FOUND error', () => {
            const error = new Error('USER_NOT_FOUND')
            const result = handleAdminError(error)

            expect(result.status).toBe(404)
            expect(result.error).toBe('Usuario no encontrado')
        })

        it('should return 500 for unknown errors', () => {
            const error = new Error('SOME_OTHER_ERROR')
            const result = handleAdminError(error)

            expect(result.status).toBe(500)
            expect(result.error).toBe('Error interno del servidor')
        })

        it('should return 500 for errors without message', () => {
            const error = { message: '' }
            const result = handleAdminError(error)

            expect(result.status).toBe(500)
        })
    })

    // Note: requireAdmin tests would require mocking Prisma and JWT
    // which is more complex and better suited for integration tests
})
