import { Page, Locator, expect } from '@playwright/test';
import { SELECTORS, TEST_CREDENTIALS, APP_URLS } from '../config/constants';
import { waitForElementVisible, waitForElementEnabled } from '../utils/helpers';

/**
 * Page Object Model for Login Page
 * Handles all interactions with the login page
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(SELECTORS.LOGIN.USERNAME_INPUT).first();
    this.passwordInput = page.locator(SELECTORS.LOGIN.PASSWORD_INPUT).first();
    this.loginButton = page.locator(SELECTORS.LOGIN.LOGIN_BUTTON).first();
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    // Use full URL from constants for more reliable navigation
    await this.page.goto(APP_URLS.LOGIN_URL, { waitUntil: 'domcontentloaded' });
    // Wait for page to load
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
      // If networkidle times out, continue anyway as page might still be usable
      console.log('Network idle timeout, but page may still be usable');
    });
  }

  /**
   * Enter username/email
   * @param username - Username or email address
   */
  async enterUsername(username: string = TEST_CREDENTIALS.USERNAME): Promise<void> {
    // Try multiple selector strategies for username/email input
    const usernameSelectors = [
      'input[type="email"]',
      'input[name*="email" i]',
      'input[name*="username" i]',
      'input[id*="email" i]',
      'input[id*="username" i]',
      'input[placeholder*="email" i]',
      'input[placeholder*="username" i]',
    ];
    
    let usernameElement = null;
    for (const selector of usernameSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          usernameElement = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (usernameElement) {
      await usernameElement.fill(username);
    } else {
      // Fallback to original selector
      await waitForElementVisible(this.page, SELECTORS.LOGIN.USERNAME_INPUT);
      await this.usernameInput.fill(username);
    }
  }

  /**
   * Enter password
   * @param password - Password
   */
  async enterPassword(password: string = TEST_CREDENTIALS.PASSWORD): Promise<void> {
    // Password input is usually more straightforward, but try multiple strategies
    const passwordSelectors = [
      'input[type="password"]',
      'input[name*="password" i]',
      'input[id*="password" i]',
    ];
    
    let passwordElement = null;
    for (const selector of passwordSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          passwordElement = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (passwordElement) {
      await passwordElement.fill(password);
    } else {
      // Fallback to original selector
      await waitForElementVisible(this.page, SELECTORS.LOGIN.PASSWORD_INPUT);
      await this.passwordInput.fill(password);
    }
  }

  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    // Try multiple selector strategies for login button
    const loginButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign In" i)',
      'button:has-text("Log In" i)',
      'button:has-text("Login" i)',
      'button[aria-label*="login" i]',
      'button[aria-label*="sign in" i]',
    ];
    
    let loginButtonElement = null;
    for (const selector of loginButtonSelectors) {
      try {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 3000 }).catch(() => false)) {
          loginButtonElement = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (loginButtonElement) {
      await loginButtonElement.click({ timeout: 30000 });
    } else {
      // Fallback to original selector
      await waitForElementEnabled(this.page, SELECTORS.LOGIN.LOGIN_BUTTON);
      await this.loginButton.click();
    }
  }

  /**
   * Complete login flow
   * @param username - Optional username (uses default from constants if not provided)
   * @param password - Optional password (uses default from constants if not provided)
   */
  async login(
    username: string = TEST_CREDENTIALS.USERNAME,
    password: string = TEST_CREDENTIALS.PASSWORD
  ): Promise<void> {
    await this.goto();
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    
    // Wait for navigation after login
    await this.page.waitForLoadState('networkidle');
    // Wait a bit more for dashboard to fully load
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageLoaded(): Promise<void> {
    await expect(this.usernameInput).toBeVisible({ timeout: 30000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 30000 });
    await expect(this.loginButton).toBeVisible({ timeout: 30000 });
  }
}
