# Setup Instructions - Update Login URL

## Important: Update Your Automation Anywhere Login URL

The automation framework is ready, but you need to update the **Login URL** in `config/constants.ts` with your actual Automation Anywhere Community Edition instance URL.

### Common Automation Anywhere URLs:

1. **Cloud Platform** (most common):
   ```
   https://cloud.automationanywhere.com
   ```
   or
   ```
   https://platform.automationanywhere.com
   ```

2. **Company/Organization specific**:
   ```
   https://yourcompany.automationanywhere.com
   ```

3. **Local/On-premise installation**:
   ```
   http://localhost:port
   ```
   or
   ```
   http://your-server-ip:port
   ```

### How to Update:

1. Open `config/constants.ts`
2. Find the `APP_URLS` section (around line 6-9)
3. Update the `LOGIN_URL` with your actual Automation Anywhere login URL
4. The URL should be the direct login page, not the marketing site

### Example:

```typescript
export const APP_URLS = {
  BASE_URL: 'https://cloud.automationanywhere.com',
  LOGIN_URL: 'https://cloud.automationanywhere.com/login',  // Update this
} as const;
```

### How to Find Your URL:

1. Open your browser
2. Navigate to your Automation Anywhere Community Edition login page
3. Copy the full URL from the address bar
4. Use that URL in the configuration

### Current Configuration:

The current URL (`https://www.automationanywhere.com/products/enterprise/community-edition`) is the marketing page, not the actual application login page.

Once you update the URL, run the tests again:
```bash
npm run test:form-upload
```
