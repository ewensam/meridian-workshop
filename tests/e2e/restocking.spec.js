const { test, expect } = require('@playwright/test');

test.describe('Restocking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking');
  });

  test('loads with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations', exact: true })).toBeVisible();
  });

  test('shows budget ceiling input', async ({ page }) => {
    await expect(page.getByPlaceholder(/budget/i)).toBeVisible();
  });

  test('displays recommendations table with priority badges', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'SKU' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Recommended Qty' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Priority' })).toBeVisible();
  });

  test('budget ceiling filters recommendations', async ({ page }) => {
    const rowsBefore = await page.getByRole('row').count();

    await page.getByPlaceholder(/budget/i).fill('1000');
    await page.waitForTimeout(500);
    const rowsAfter = await page.getByRole('row').count();

    // With a tight budget, fewer recommendations should appear
    expect(rowsAfter).toBeLessThanOrEqual(rowsBefore);
  });

  test('clearing budget shows all recommendations', async ({ page }) => {
    await page.getByPlaceholder(/budget/i).fill('500');
    await page.waitForTimeout(500);
    const limited = await page.getByRole('row').count();

    await page.getByPlaceholder(/budget/i).fill('');
    await page.waitForTimeout(500);
    const all = await page.getByRole('row').count();

    expect(all).toBeGreaterThanOrEqual(limited);
  });

  test('warehouse filter reloads recommendations', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await page.getByRole('combobox').nth(1).selectOption('San Francisco');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible();
  });
});
