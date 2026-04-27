const { test, expect } = require('@playwright/test');

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports');
  });

  test('loads quarterly performance table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
    await expect(page.getByRole('table').first()).toBeVisible();
    await expect(page.getByText(/Q[1-4]-2025/).first()).toBeVisible();
  });

  test('shows correct quarterly table headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'Quarter' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Total Orders' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Fulfillment Rate' })).toBeVisible();
  });

  test('loads month-over-month analysis table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /month-over-month/i })).toBeVisible();
  });

  test('warehouse filter reloads report data', async ({ page }) => {
    await expect(page.getByText(/Q[1-4]-2025/).first()).toBeVisible();
    await page.getByRole('combobox').nth(1).selectOption('Tokyo');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Quarterly Performance' })).toBeVisible();
  });

  test('shows summary stats cards', async ({ page }) => {
    await expect(page.getByText('Total Revenue (YTD)')).toBeVisible();
    await expect(page.getByText('Total Orders (YTD)')).toBeVisible();
    await expect(page.getByText('Best Performing Quarter')).toBeVisible();
  });
});
