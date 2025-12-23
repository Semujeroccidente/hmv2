import { test, expect } from '@playwright/test'

test.describe('Product Creation Flow', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should navigate to sell page', async ({ page }) => {
        await page.getByRole('link', { name: /vender|sell/i }).click()
        await expect(page).toHaveURL('/vender')
        await expect(page.getByRole('heading', { name: /vender|publicar/i })).toBeVisible()
    })

    test('should display product creation form', async ({ page }) => {
        await page.goto('/vender')

        // Check form fields are present
        await expect(page.locator('input[name="title"]')).toBeVisible()
        await expect(page.locator('textarea[name="description"]')).toBeVisible()
        await expect(page.locator('input[name="price"]')).toBeVisible()
        await expect(page.locator('select[name="condition"]')).toBeVisible()
    })

    test('should show validation errors on empty form', async ({ page }) => {
        await page.goto('/vender')

        // Try to submit empty form
        await page.getByRole('button', { name: /publicar|crear/i }).click()

        // Should show validation errors
        await expect(page.locator('text=/título|title/i')).toBeVisible()
    })

    test.skip('should create new product (requires authentication)', async ({ page }) => {
        // This test requires authentication
        await page.goto('/vender')

        // Fill form
        await page.fill('input[name="title"]', 'Test Product')
        await page.fill('textarea[name="description"]', 'This is a test product description')
        await page.fill('input[name="price"]', '100')
        await page.selectOption('select[name="condition"]', 'NEW')

        // Add image URL
        await page.fill('input[name="imageUrl"]', 'https://via.placeholder.com/300')
        await page.getByRole('button', { name: /agregar imagen/i }).click()

        // Submit form
        await page.getByRole('button', { name: /publicar|crear/i }).click()

        // Should redirect to product page or success message
        await expect(page).not.toHaveURL('/vender')
    })

    test('should allow adding multiple images', async ({ page }) => {
        await page.goto('/vender')

        // Add first image
        await page.fill('input[name="imageUrl"]', 'https://via.placeholder.com/300')
        await page.getByRole('button', { name: /agregar imagen/i }).click()

        // Add second image
        await page.fill('input[name="imageUrl"]', 'https://via.placeholder.com/400')
        await page.getByRole('button', { name: /agregar imagen/i }).click()

        // Should show both images
        const images = page.locator('img[src*="placeholder"]')
        await expect(images).toHaveCount(2)
    })

    test('should validate price is positive', async ({ page }) => {
        await page.goto('/vender')

        await page.fill('input[name="price"]', '-10')
        await page.getByRole('button', { name: /publicar|crear/i }).click()

        // Should show validation error
        await expect(page.locator('text=/precio|price/i')).toBeVisible()
    })
})
