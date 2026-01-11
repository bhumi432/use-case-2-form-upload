import { Page, expect } from '@playwright/test';

/**
 * Utility helper functions for common test operations
 */

/**
 * Wait for element to be visible and enabled
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param timeout - Maximum wait time in milliseconds
 */
export async function waitForElementVisible(
  page: Page,
  selector: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  const element = page.locator(selector).first();
  await expect(element).toBeVisible({ timeout });
}

/**
 * Wait for element to be enabled
 * @param page - Playwright page object
 * @param selector - Element selector
 * @param timeout - Maximum wait time in milliseconds
 */
export async function waitForElementEnabled(
  page: Page,
  selector: string,
  timeout: number = 30000
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
  const element = page.locator(selector).first();
  await expect(element).toBeEnabled({ timeout });
}

/**
 * Wait for network response matching a pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern or regex to match
 * @param timeout - Maximum wait time in milliseconds
 * @returns Response object
 */
export async function waitForNetworkResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 30000
) {
  return await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
}

/**
 * Wait for successful API response (status 200-299)
 * @param page - Playwright page object
 * @param urlPattern - URL pattern or regex to match
 * @param timeout - Maximum wait time in milliseconds
 * @returns Response object
 */
export async function waitForSuccessfulResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 30000
) {
  const response = await waitForNetworkResponse(page, urlPattern, timeout);
  expect(response.status()).toBeGreaterThanOrEqual(200);
  expect(response.status()).toBeLessThan(300);
  return response;
}

/**
 * Drag and drop element using mouse simulation
 * @param page - Playwright page object
 * @param sourceSelector - Source element selector
 * @param targetSelector - Target element selector
 */
export async function dragAndDrop(
  page: Page,
  sourceSelector: string,
  targetSelector: string
): Promise<void> {
  const source = page.locator(sourceSelector).first();
  const target = page.locator(targetSelector).first();
  
  // Wait for both elements to be visible
  await expect(source).toBeVisible({ timeout: 30000 });
  await expect(target).toBeVisible({ timeout: 30000 });
  
  // Perform drag and drop
  await source.dragTo(target, { force: true });
  
  // Wait a bit for the drop to complete
  await page.waitForTimeout(1000);
}

/**
 * Alternative drag and drop using mouse events (fallback method)
 * @param page - Playwright page object
 * @param sourceSelector - Source element selector
 * @param targetSelector - Target element selector
 */
export async function dragAndDropWithMouse(
  page: Page,
  sourceSelector: string,
  targetSelector: string
): Promise<void> {
  const source = page.locator(sourceSelector).first();
  const target = page.locator(targetSelector).first();
  
  await expect(source).toBeVisible({ timeout: 30000 });
  await expect(target).toBeVisible({ timeout: 30000 });
  
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();
  
  if (!sourceBox || !targetBox) {
    throw new Error('Could not get bounding boxes for drag and drop');
  }
  
  // Move to source, press mouse, move to target, release
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2);
  await page.mouse.up();
  
  await page.waitForTimeout(1000);
}

/**
 * Upload file using setInputFiles
 * Supports both local files and files from shared/network folders
 * @param page - Playwright page object
 * @param fileInputSelector - File input selector
 * @param filePath - Path to the file to upload (local or network path)
 */
export async function uploadFile(
  page: Page,
  fileInputSelector: string,
  filePath: string
): Promise<void> {
  const fileInput = page.locator(fileInputSelector).first();
  await expect(fileInput).toBeVisible({ timeout: 30000 });
  
  // Verify file exists before attempting upload
  const fs = require('fs');
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found at path: ${filePath}. Please verify the file exists and the path is accessible (for shared folders, ensure network connectivity).`);
  }
  
  // Use setInputFiles for file upload (works with both local and network paths)
  await fileInput.setInputFiles(filePath);
  
  // Wait for file to be processed
  await page.waitForTimeout(2000);
}

/**
 * Verify element is visible and enabled
 * @param page - Playwright page object
 * @param selector - Element selector
 */
export async function verifyElementVisibleAndEnabled(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  await expect(element).toBeVisible();
  await expect(element).toBeEnabled();
}

/**
 * Take a screenshot with timestamp
 * @param page - Playwright page object
 * @param name - Screenshot name (without extension)
 */
export async function takeScreenshot(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `screenshots/${name}-${timestamp}.png`, fullPage: true });
}
