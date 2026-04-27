const { test, expect } = require('@playwright/test');

test.describe('Dashboard', () => {
  test('loads with correct heading and nav links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Inventory' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Restocking' })).toBeVisible();
  });

  test('filter bar is present with all four dropdowns', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('combobox').nth(0)).toBeVisible(); // Time Period
    await expect(page.getByRole('combobox').nth(1)).toBeVisible(); // Location
    await expect(page.getByRole('combobox').nth(2)).toBeVisible(); // Category
    await expect(page.getByRole('combobox').nth(3)).toBeVisible(); // Order Status
  });

  test('reset filter button is disabled by default', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: /reset all filters/i })).toBeDisabled();
  });

  test('reset button enables after applying a filter', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('combobox').nth(1).selectOption('San Francisco');
    await expect(page.getByRole('button', { name: /reset all filters/i })).toBeEnabled();
  });
});
