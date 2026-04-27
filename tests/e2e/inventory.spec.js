const { test, expect } = require('@playwright/test');

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory');
  });

  test('loads stock levels table with items', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /stock levels/i })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('row').nth(1)).toBeVisible();
  });

  test('shows correct column headers', async ({ page }) => {
    await expect(page.getByRole('columnheader', { name: 'SKU' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Item Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Status' })).toBeVisible();
  });

  test('search filters the item list', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /stock levels/i });
    await expect(heading).toContainText('32 SKUs');

    await page.getByPlaceholder('Search by item name...').fill('Sensor');
    await expect(heading).not.toContainText('32 SKUs');
    await expect(page.getByRole('cell', { name: /sensor/i }).first()).toBeVisible();
  });

  test('warehouse filter reduces results', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /stock levels/i });
    const allCount = await heading.textContent();

    await page.getByRole('combobox').nth(1).selectOption('Tokyo');
    await page.waitForTimeout(300);
    const filteredCount = await heading.textContent();

    expect(filteredCount).not.toEqual(allCount);
  });

  test('displays stock status badges', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.locator('.badge').first()).toBeVisible();
  });
});
