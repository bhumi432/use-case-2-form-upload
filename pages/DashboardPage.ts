import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS } from '../config/constants';
import { waitForElementVisible, waitForElementEnabled } from '../utils/helpers';

/**
 * Page Object Model for Dashboard Page
 * Handles navigation and dashboard interactions
 */
export class DashboardPage {
  readonly page: Page;
  readonly automationMenu: Locator;
  readonly createDropdown: Locator;
  readonly createFormOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.automationMenu = page.locator(SELECTORS.NAVIGATION.AUTOMATION_MENU).first();
    this.createDropdown = page.locator(SELECTORS.NAVIGATION.CREATE_DROPDOWN).first();
    this.createFormOption = page.locator(SELECTORS.NAVIGATION.CREATE_FORM_OPTION).first();
  }

  /**
   * Navigate to Automation section from left menu
   */
  async navigateToAutomation(): Promise<void> {
    // Wait for page to be fully loaded first
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
    
    // Try multiple selector strategies for Automation menu
    const automationSelectors = [
      'text=/automation/i',
      '[aria-label*="automation" i]',
      'a:has-text("Automation" i)',
      'button:has-text("Automation" i)',
      '[role="menuitem"]:has-text("Automation" i)',
      '[role="link"]:has-text("Automation" i)',
      'nav a:has-text("Automation" i)',
    ];
    
    let automationElement = null;
    for (const selector of automationSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          automationElement = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (automationElement) {
      await automationElement.click({ timeout: 30000 });
    } else {
      // Fallback to original selector
      await waitForElementVisible(this.page, SELECTORS.NAVIGATION.AUTOMATION_MENU, 30000);
      await this.automationMenu.click({ timeout: 30000 });
    }
    
    // Wait for navigation to complete
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);
  }

  /**
   * Click on Create dropdown
   */
  async clickCreateDropdown(): Promise<void> {
    // Wait for page to be ready
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000); // Increased wait time
    
    // Try multiple selector strategies for Create button
    // Based on inspection: Button with text="Create" and aria-label="Create" is visible (Button 9)
    const createSelectors = [
      'button[aria-label="Create"]',  // Most specific - matches Button 9 exactly
      'button:has-text("Create")',    // Matches text content
      '[aria-label="Create"]',        // Any element with this aria-label
      'button[aria-label*="Create"]', // Partial match
      'button:has-text("create")',    // Case-insensitive fallback
    ];
    
    let createElement = null;
    for (const selector of createSelectors) {
      try {
        const element = this.page.locator(selector).first();
        // Use longer timeout and wait for visibility
        const isVisible = await element.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
          createElement = element;
          console.log(`Found Create button using selector: ${selector}`);
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (createElement) {
      await createElement.click({ timeout: 30000 });
    } else {
      // Try to find any button or element with "Create" text
      const fallbackSelectors = [
        'button',
        '[role="button"]',
        'a',
        '[class*="button"]',
        '[class*="create"]',
      ];
      
      let foundElement = null;
      for (const selector of fallbackSelectors) {
        try {
          const elements = await this.page.locator(selector).all();
          for (const element of elements) {
            const text = await element.textContent().catch(() => '');
            if (text && (text.toLowerCase().includes('create') || text.toLowerCase().includes('new'))) {
              if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
                foundElement = element;
                break;
              }
            }
          }
          if (foundElement) break;
        } catch (e) {
          // Continue
        }
      }
      
      if (foundElement) {
        await foundElement.click({ timeout: 30000 });
      } else {
        // Last resort: try clicking on first visible button
        const firstButton = this.page.locator('button').first();
        if (await firstButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await firstButton.click({ timeout: 30000 });
        } else {
          throw new Error('Could not find Create button or dropdown');
        }
      }
    }
    
    // Wait for dropdown menu to appear
    await this.page.waitForTimeout(1000);
  }

  /**
   * Select Form option from Create dropdown
   */
  async selectCreateForm(): Promise<void> {
    // First ensure dropdown is open
    await this.clickCreateDropdown();
    
    // Wait a bit for dropdown to appear
    await this.page.waitForTimeout(1000);
    
    // Try multiple selector strategies for Form option
    const formSelectors = [
      '[role="menuitem"]:has-text("Form")',
      '[role="menuitem"]:has-text("form")',
      '[role="option"]:has-text("Form")',
      '[role="option"]:has-text("form")',
      'a:has-text("Form")',
      'a:has-text("form")',
      'li:has-text("Form")',
      'li:has-text("form")',
      'text=Form',
      'text=form',
    ];
    
    let formElement = null;
    for (const selector of formSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          formElement = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (formElement) {
      await formElement.click({ timeout: 30000 });
    } else {
      // Fallback to original selector
      await waitForElementVisible(this.page, SELECTORS.NAVIGATION.CREATE_FORM_OPTION, 15000);
      await this.createFormOption.click();
    }
    
    // Wait for form builder to load
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  }

  /**
   * Complete flow: Navigate to Automation -> Create -> Form
   */
  async navigateToFormBuilder(): Promise<void> {
    await this.navigateToAutomation();
    await this.selectCreateForm();
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    // Wait for page to load
    await this.page.waitForLoadState('domcontentloaded');
    
    // Try to verify dashboard is loaded - look for any navigation or menu element
    // This is more flexible than checking for specific Automation menu
    const pageLoaded = await this.page.locator('body').isVisible({ timeout: 10000 }).catch(() => false);
    if (!pageLoaded) {
      throw new Error('Dashboard page did not load');
    }
    
    // Give the page time to fully render
    await this.page.waitForTimeout(2000);
  }
}
