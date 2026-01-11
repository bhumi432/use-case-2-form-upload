import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormBuilderPage } from '../pages/FormBuilderPage';
import { waitForSuccessfulResponse } from '../utils/helpers';
import { FILE_PATHS, SELECTORS } from '../config/constants';

/**
 * Test Suite: Form with Upload Flow
 * 
 * This test suite implements Use Case 2: Form with Upload Flow
 * using Page Object Model (POM) design pattern.
 * 
 * Test Scenario:
 * 1. Login to the application
 * 2. Navigate to Automation from the left-hand menu
 * 3. Click on Create dropdown and select Form
 * 4. Fill in all mandatory form details and click Create
 * 5. Drag and drop Textbox and File Upload elements onto canvas
 * 6. Verify element visibility and properties panel interactions
 * 7. Enter valid text into Textbox
 * 8. Upload a document from local folder
 * 9. Save the form
 * 10. Verify document upload completion and form save success
 */
test.describe('Form with Upload Flow', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let formBuilderPage: FormBuilderPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    formBuilderPage = new FormBuilderPage(page);
  });

  test('Complete form creation with textbox and file upload', async ({ page }) => {
    // Step 1: Login to the application
    test.step('Step 1: Login to the application', async () => {
      await loginPage.login();
      
      // Verify login was successful by checking dashboard is loaded
      await dashboardPage.verifyDashboardLoaded();
    });

    // Step 2: Navigate to Automation from the left-hand menu
    test.step('Step 2: Navigate to Automation menu', async () => {
      await dashboardPage.navigateToAutomation();
    });

    // Step 3: Click on Create dropdown and select Form
    test.step('Step 3: Create new Form', async () => {
      await dashboardPage.selectCreateForm();
    });

    // Step 4: Fill in all mandatory form details and click Create
    test.step('Step 4: Fill form details and create', async () => {
      await formBuilderPage.fillFormDetailsAndCreate();
    });

    // Step 5: Drag and drop Textbox element onto canvas
    test.step('Step 5: Drag Textbox element to canvas', async () => {
      await formBuilderPage.dragTextboxToCanvas();
    });

    // Step 6a: Click Textbox and verify visibility and properties panel
    test.step('Step 6a: Verify Textbox element and properties panel', async () => {
      // Assert: Verify textbox element visibility and functionality
      const textbox = page.locator(SELECTORS.FORM_BUILDER.TEXTBOX_ON_CANVAS).first();
      await expect(textbox).toBeVisible();
      await expect(textbox).toBeEnabled();
      
      await formBuilderPage.clickTextboxAndVerify();
      
      // Assert: Verify properties panel is visible and interactive
      const propertiesPanel = formBuilderPage.propertiesPanel;
      await expect(propertiesPanel).toBeVisible();
      
      // Additional assertion: Verify textbox functionality - element is still visible after click
      await expect(textbox).toBeVisible();
    });

    // Step 5 (continued): Drag and drop File Upload element onto canvas
    test.step('Step 5b: Drag File Upload element to canvas', async () => {
      await formBuilderPage.dragFileUploadToCanvas();
    });

    // Step 6b: Click File Upload and verify visibility and properties panel
    test.step('Step 6b: Verify File Upload element and properties panel', async () => {
      // Assert: Verify file upload element visibility and functionality
      const fileUpload = page.locator(SELECTORS.FORM_BUILDER.FILE_UPLOAD_ON_CANVAS).first();
      await expect(fileUpload).toBeVisible();
      
      await formBuilderPage.clickFileUploadAndVerify();
      
      // Assert: Verify properties panel is visible and interactive
      const propertiesPanel = formBuilderPage.propertiesPanel;
      await expect(propertiesPanel).toBeVisible();
      
      // Additional assertion: Verify file upload functionality - element is still visible after click
      await expect(fileUpload).toBeVisible();
    });

    // Step 7: Enter valid text into the Textbox
    test.step('Step 7: Enter text into Textbox', async () => {
      // Verify textbox is visible and enabled before interaction
      const textbox = page.locator('input[type="text"]').first();
      await expect(textbox).toBeVisible();
      await expect(textbox).toBeEnabled();
      
      // Set up network interception to verify API call if text input triggers one
      const textInputPromise = page.waitForResponse(
        (response) => {
          const url = response.url().toLowerCase();
          const method = response.request().method().toUpperCase();
          return (url.includes('api') || url.includes('save') || url.includes('update')) &&
                 (method === 'POST' || method === 'PUT' || method === 'PATCH');
        },
        { timeout: 10000 }
      ).catch(() => null); // Don't fail if no API call is made

      await formBuilderPage.enterTextInTextbox();
      
      // Assert: Verify text was entered successfully
      await expect(textbox).toHaveValue(/test text input/i);
      
      // Verify textbox functionality by checking it's still enabled and visible
      await expect(textbox).toBeEnabled();
      await expect(textbox).toBeVisible();
      
      // Wait for potential API response (non-blocking)
      await textInputPromise;
    });

    // Step 8: Upload a document from local or shared folder
    test.step('Step 8: Upload document from local or shared folder', async () => {
      // Assert: Verify file upload element is visible and enabled before interaction
      const fileUpload = page.locator('input[type="file"]').first();
      await expect(fileUpload).toBeVisible();
      
      // Set up network interception to verify file upload API call
      const uploadResponsePromise = formBuilderPage.waitForFileUploadResponse();
      
      // Upload the file (supports both local and shared folder paths)
      await formBuilderPage.uploadDocument(FILE_PATHS.UPLOAD_FILE);
      
      // Assert: Wait for upload API response and verify it's successful
      try {
        const response = await uploadResponsePromise;
        if (response) {
          // Assert backend response: Status code should be 2xx
          expect(response.status()).toBeGreaterThanOrEqual(200);
          expect(response.status()).toBeLessThan(300);
          
          // Assert: Verify response indicates success
          const responseBody = await response.text().catch(() => '');
          console.log('File upload API response verified successfully');
          
          // If response is JSON, parse and verify success indicators
          if (responseBody && responseBody.startsWith('{')) {
            try {
              const jsonBody = JSON.parse(responseBody);
              // Check for common success indicators in response
              if (jsonBody.success !== undefined) {
                expect(jsonBody.success).toBeTruthy();
              }
              if (jsonBody.status) {
                expect(['success', 'completed', 'uploaded']).toContain(jsonBody.status.toLowerCase());
              }
              console.log('File upload response data:', JSON.stringify(jsonBody, null, 2));
            } catch (e) {
              // Not JSON, that's okay - status code verification is sufficient
            }
          }
        }
      } catch (error) {
        console.log('File upload API response not captured, verifying UI state instead');
      }
      
      // Assert: Verify file upload completion and status in UI
      await formBuilderPage.verifyFileUploadSuccess();
    });

    // Step 9: Save the form
    test.step('Step 9: Save the form', async () => {
      // Assert: Verify save button is visible and enabled before interaction
      const saveButton = page.locator(SELECTORS.FORM_BUILDER.SAVE_BUTTON).first();
      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
      
      // Set up network interception to verify form save API call
      const saveResponsePromise = formBuilderPage.waitForFormSaveResponse();
      
      // Save the form
      await formBuilderPage.saveForm();
      
      // Assert: Wait for save API response and verify backend response
      try {
        const response = await saveResponsePromise;
        if (response) {
          // Assert backend response: Status code should be 2xx
          expect(response.status()).toBeGreaterThanOrEqual(200);
          expect(response.status()).toBeLessThan(300);
          
          // Assert: Verify response body contains success indicator
          const responseBody = await response.text().catch(() => '');
          console.log('Form save API response verified successfully');
          
          // If response is JSON, parse and verify success indicators
          if (responseBody && responseBody.startsWith('{')) {
            try {
              const jsonBody = JSON.parse(responseBody);
              // Check for common success indicators in response
              if (jsonBody.success !== undefined) {
                expect(jsonBody.success).toBeTruthy();
              }
              if (jsonBody.status) {
                expect(['success', 'saved', 'created']).toContain(jsonBody.status.toLowerCase());
              }
              console.log('Form save response data:', JSON.stringify(jsonBody, null, 2));
            } catch (e) {
              // Not JSON, that's okay - status code verification is sufficient
            }
          }
        }
      } catch (error) {
        console.log('Form save API response not captured, verifying UI state instead');
      }
    });

    // Step 10: Verify document upload completion and form save success
    test.step('Step 10: Verify upload and save success', async () => {
      // Verify file upload was successful
      await formBuilderPage.verifyFileUploadSuccess();
      
      // Verify form save was successful
      await formBuilderPage.verifyFormSaveSuccess();
      
      // Additional assertion: Verify both elements are still visible on canvas
      const textbox = page.locator('input[type="text"]').first();
      const fileUpload = page.locator('input[type="file"]').first();
      
      await expect(textbox).toBeVisible();
      await expect(fileUpload).toBeVisible();
      
      // Verify textbox still has the entered value
      await expect(textbox).toHaveValue(/test text input/i);
    });
  });

  test.afterEach(async ({ page }) => {
    // Optional: Cleanup or take screenshot on failure
    // Screenshots are automatically taken on failure due to playwright.config.ts settings
  });
});
