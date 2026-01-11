/**
 * Constants and configuration values for the automation framework
 */

// Application URLs
// Automation Anywhere Community Edition URLs
export const APP_URLS = {
  BASE_URL: 'https://community.cloud.automationanywhere.digital',
  LOGIN_URL: 'https://community.cloud.automationanywhere.digital/#/home',
} as const;

// Test data - Update these with your actual credentials
export const TEST_CREDENTIALS = {
  USERNAME: process.env.AA_USERNAME || 'csai22032@glbitm.ac.in',
  PASSWORD: process.env.AA_PASSWORD || 'Bhumi1542@shu',
} as const;

// File paths - Supports local and shared/network folders
// Examples:
// - Local: C:\Users\folder\file.txt
// - Network/Shared: \\server\share\file.txt or \\192.168.1.100\share\file.txt
// - Mapped drive: Z:\folder\file.txt
export const FILE_PATHS = {
  // Default test file path - update this to your local file or shared folder path
  UPLOAD_FILE: process.env.UPLOAD_FILE_PATH || 'C:\\Users\\BHUMI\\playwright-automation\\test-upload.txt',
  // Alternative: Use a sample text file if PDF is not available
  SAMPLE_TEXT_FILE: process.env.SAMPLE_FILE_PATH || 'C:\\Users\\BHUMI\\playwright-automation\\test-upload.txt',
  // Shared folder example (uncomment and update as needed):
  // SHARED_FOLDER_FILE: '\\\\server-name\\share-name\\folder\\file.txt',
  // SHARED_FOLDER_FILE: '\\\\192.168.1.100\\shared\\test-file.txt',
} as const;

// Timeouts (in milliseconds)
export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000,
  VERY_LONG: 60000,
} as const;

// Form test data
export const FORM_DATA = {
  FORM_NAME: `TestForm_${Date.now()}`,
  FORM_DESCRIPTION: 'Automated test form with file upload',
  TEXTBOX_VALUE: 'This is a test text input for automation',
} as const;

// Selectors - Updated for Automation Anywhere Community Edition
export const SELECTORS = {
  // Login page - Flexible selectors for various login form structures
  // Note: Case-insensitive matching is handled in page object methods
  LOGIN: {
    USERNAME_INPUT: 'input[type="email"], input[name*="email"], input[name*="Email"], input[name*="username"], input[name*="Username"], input[id*="email"], input[id*="Email"], input[id*="username"], input[id*="Username"]',
    PASSWORD_INPUT: 'input[type="password"], input[name*="password"], input[name*="Password"], input[id*="password"], input[id*="Password"]',
    LOGIN_BUTTON: 'button[type="submit"], button[aria-label*="login"], button[aria-label*="Login"], button[aria-label*="sign in"], button[aria-label*="Sign In"]',
  },
  
  // Dashboard/Navigation - Flexible selectors for Automation Anywhere navigation
  // Note: Case-insensitive text matching is handled in page object methods
  NAVIGATION: {
    AUTOMATION_MENU: 'a, button, [role="menuitem"], [role="link"]',
    CREATE_DROPDOWN: 'button[aria-label*="Create"], button[aria-label*="create"]',
    CREATE_FORM_OPTION: '[role="menuitem"], [role="option"], a, li',
  },
  
  // Form builder
  FORM_BUILDER: {
    CANVAS: '[class*="canvas"], [id*="canvas"], .form-canvas',
    CREATE_BUTTON: 'button:has-text("Create"), button[type="submit"]:has-text("Create")',
    SAVE_BUTTON: 'button:has-text("Save"), button[type="submit"]:has-text("Save")',
    
    // Element library/sidebar
    ELEMENT_LIBRARY: '[class*="element"], [class*="library"], [class*="sidebar"]',
    TEXTBOX_ELEMENT: 'text=Textbox, [data-element="textbox"], [title*="Textbox"]',
    FILE_UPLOAD_ELEMENT: 'text=File Upload, text=Select File, [data-element="file"], [title*="File Upload"]',
    
    // Dragged elements on canvas
    TEXTBOX_ON_CANVAS: '[class*="textbox"], input[type="text"]',
    FILE_UPLOAD_ON_CANVAS: 'input[type="file"], [class*="file-upload"]',
    
    // Right panel
    PROPERTIES_PANEL: '[class*="properties"], [class*="panel"], [class*="settings"]',
    PROPERTIES_PANEL_VISIBLE: '[class*="properties"]:visible, [class*="panel"]:visible',
  },
  
  // Success messages
  SUCCESS: {
    SAVE_SUCCESS: 'text=/saved|success|created/i',
    UPLOAD_SUCCESS: 'text=/upload.*success|file.*uploaded/i',
  },
} as const;
