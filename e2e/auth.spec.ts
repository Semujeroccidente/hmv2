import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should display login and register links', async ({ page }) => {
        await expect(page.getByRole('link', { name: /iniciar sesión|login/i })).toBeVisible()
        await expect(page.getByRole('link', { name: /registrarse|register/i })).toBeVisible()
    })

    test('should navigate to register page', async ({ page }) => {
        await page.getByRole('link', { name: /registrarse|register/i }).click()
        await expect(page).toHaveURL('/register')
        await expect(page.getByRole('heading', { name: /registr/i })).toBeVisible()
    })

    test('should navigate to login page', async ({ page }) => {
        await page.getByRole('link', { name: /iniciar sesión|login/i }).click()
        await expect(page).toHaveURL('/login')
        await expect(page.getByRole('heading', { name: /iniciar sesión|login/i })).toBeVisible()
    })

    test('should show validation errors on empty login form', async ({ page }) => {
        await page.goto('/login')
        await page.getByRole('button', { name: /iniciar sesión|login/i }).click()

        // Should show validation errors
        await expect(page.locator('text=/email|correo/i')).toBeVisible()
    })

    test('should show validation errors on empty register form', async ({ page }) => {
        await page.goto('/register')
        await page.getByRole('button', { name: /registr/i }).click()

        // Should show validation errors
        await expect(page.locator('text=/nombre|name/i')).toBeVisible()
    })

    test.skip('should register new user (requires test database)', async ({ page }) => {
        await page.goto('/register')

        const timestamp = Date.now()
        await page.fill('input[name="name"]', 'Test User')
        await page.fill('input[name="email"]', `test${timestamp}@example.com`)
        await page.fill('input[name="password"]', 'password123')

        await page.getByRole('button', { name: /registr/i }).click()

        // Should redirect to home or dashboard
        await expect(page).toHaveURL('/')
    })

    test.skip('should login existing user (requires test database)', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[name="email"]', 'test@example.com')
        await page.fill('input[name="password"]', 'password123')

        await page.getByRole('button', { name: /iniciar sesión|login/i }).click()

        // Should redirect to home
        await expect(page).toHaveURL('/')
    })

    test.skip('should logout user (requires authentication)', async ({ page }) => {
        // This test would require logging in first
        await page.goto('/')

        // Click user menu
        await page.getByRole('button', { name: /perfil|profile/i }).click()

        // Click logout
        await page.getByRole('button', { name: /cerrar sesión|logout/i }).click()

        // Should redirect to home
        await expect(page).toHaveURL('/')
    })
})
