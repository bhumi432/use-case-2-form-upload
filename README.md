# Playwright Automation Framework - Automation Anywhere Community Edition

This is a comprehensive Playwright automation framework implementing **Page Object Model (POM)** design pattern for testing the Automation Anywhere Community Edition application.

## 📋 Test Scenario

**Use Case 2: Form with Upload Flow**

The framework automates the complete flow of:
1. User login
2. Navigation to Automation section
3. Creating a new Form
4. Adding Textbox and File Upload elements via drag-and-drop
5. Interacting with form elements
6. Uploading a document
7. Saving the form
8. Verifying success

## 🏗️ Project Structure

```
playwright-automation/
├── config/
│   └── constants.ts          # Configuration constants, selectors, test data
├── pages/                    # Page Object Model classes
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   └── FormBuilderPage.ts
├── tests/                    # Test specifications
│   └── form-upload.spec.ts
├── utils/                    # Helper utilities
│   └── helpers.ts
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Valid Automation Anywhere Community Edition account credentials
- A test file for upload (PDF, DOC, TXT, etc.)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd playwright-automation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

4. **Configure environment variables:**
   
   Create a `.env` file (or copy from `.env.example`):
   ```env
   AA_USERNAME=your-username@example.com
   AA_PASSWORD=your-password
   UPLOAD_FILE_PATH=C:\Users\YourName\Downloads\test-document.pdf
   ```
   
   Alternatively, update the values directly in `config/constants.ts`.

## ⚙️ Configuration

### Update Credentials

Edit `config/constants.ts` or set environment variables:

```typescript
export const TEST_CREDENTIALS = {
  USERNAME: process.env.AA_USERNAME || 'your-username@example.com',
  PASSWORD: process.env.AA_PASSWORD || 'your-password',
};
```

### Update File Upload Path

Edit `config/constants.ts`:

```typescript
export const FILE_PATHS = {
  UPLOAD_FILE: process.env.UPLOAD_FILE_PATH || 'C:\\Users\\YourName\\test-file.pdf',
};
```

### Update Selectors (if needed)

If the application UI changes, update selectors in `config/constants.ts` under the `SELECTORS` object.

## 🧪 Running Tests

### Run all tests:
```bash
npm test
```

### Run in headed mode (see browser):
```bash
npm run test:headed
```

### Run specific test file:
```bash
npm run test:form-upload
```

### Run in debug mode:
```bash
npm run test:debug
```

### Run with UI mode (Playwright Test UI):
```bash
npm run test:ui
```

## 📝 Key Features

### Page Object Model (POM)

- **Separation of Concerns**: Each page has its own class
- **Reusability**: Page methods can be reused across multiple tests
- **Maintainability**: UI changes require updates in one place only

### Page Classes

1. **LoginPage**: Handles login functionality
2. **DashboardPage**: Handles navigation and dashboard interactions
3. **FormBuilderPage**: Handles form creation, element manipulation, and file uploads

### Utilities

- **helpers.ts**: Reusable utility functions for:
  - Element waiting and verification
  - Drag and drop operations
  - File uploads
  - Network response interception
  - Screenshot capture

### Assertions

The framework includes comprehensive assertions:
- ✅ UI element visibility and enabled state
- ✅ Successful text input
- ✅ File upload completion
- ✅ Form save success
- ✅ API/Network response validation (200-299 status codes)

### Network Interception

The framework uses Playwright's `page.waitForResponse()` to:
- Verify file upload API calls
- Verify form save API calls
- Validate response status codes
- Inspect response payloads

## 🔧 Technical Details

### Drag and Drop

The framework implements two approaches for drag-and-drop:
1. **Standard dragTo()**: Primary method using Playwright's built-in dragTo
2. **Mouse-based fallback**: Alternative using mouse events if standard method fails

### File Upload

Uses Playwright's `setInputFiles()` method for reliable file uploads:
```typescript
await fileInput.setInputFiles(filePath);
```

### Wait Strategies

- **No hard sleeps**: Uses Playwright's built-in waiting mechanisms
- **Network idle**: Waits for network requests to complete
- **Element visibility**: Waits for elements to be visible before interaction
- **Response waiting**: Waits for specific API responses

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports include:
- Test execution timeline
- Screenshots on failure
- Video recordings on failure
- Network traces

## 🐛 Troubleshooting

### Selectors not found

If tests fail with "element not found" errors:
1. Inspect the application UI to find correct selectors
2. Update selectors in `config/constants.ts`
3. Use Playwright's codegen to generate selectors:
   ```bash
   npx playwright codegen https://www.automationanywhere.com
   ```

### File upload fails

1. Verify the file path exists and is accessible
2. Check file permissions
3. Ensure the file is not locked by another process
4. Try using an absolute path

### Login fails

1. Verify credentials are correct
2. Check if the login page structure has changed
3. Update login selectors if needed
4. Check for CAPTCHA or additional security steps

### Drag and drop not working

The framework includes a fallback mechanism. If both methods fail:
1. Check if the application uses a custom drag-and-drop library
2. Inspect the element structure
3. Consider using keyboard shortcuts or alternative interaction methods

## 📚 Best Practices Implemented

✅ **Page Object Model**: Strict adherence to POM pattern  
✅ **Async/Await**: Proper async handling throughout  
✅ **No Hard Sleeps**: Uses Playwright's intelligent waiting  
✅ **Comprehensive Assertions**: Multiple validation points  
✅ **Network Validation**: API response verification  
✅ **Error Handling**: Try-catch blocks with fallbacks  
✅ **Code Comments**: Inline documentation for complex logic  
✅ **Configurable**: Environment variables and constants  
✅ **Maintainable**: Clear separation of concerns  

## 🔄 Future Enhancements

Potential improvements:
- Add more test scenarios
- Implement data-driven testing
- Add visual regression testing
- Integrate with CI/CD pipelines
- Add API testing alongside UI tests
- Implement test data management

## 📄 License

ISC

## 👤 Author

QA Automation Engineer

---

**Note**: This framework is designed for the Automation Anywhere Community Edition. Selectors and flows may need adjustment based on the actual application structure and version.
