import { describe, it, expect } from 'vitest'

describe('Environment Validation', () => {
    it('should have JWT_SECRET defined in test environment', () => {
        expect(process.env.JWT_SECRET).toBeDefined()
        expect(process.env.JWT_SECRET!.length).toBeGreaterThanOrEqual(32)
    })

    it('should have DATABASE_URL defined in test environment', () => {
        expect(process.env.DATABASE_URL).toBeDefined()
    })

    it('should have NODE_ENV set to test', () => {
        expect(process.env.NODE_ENV).toBe('test')
    })
})
