# Google OAuth Setup for AbilityCenterBI

Your AbilityCenterBI application has been successfully deployed! The website now includes persistent authentication that remembers users across sessions. Here's what you need to configure for Google OAuth to work properly:

## Current Deployment Info

- **Production URL**: https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app
- **Repository**: https://github.com/Faisal-Aldosari/AbilityCenterBI
- **Status**: ✅ Successfully Deployed

## Google OAuth Configuration Required

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select or Create a Project**:
   - If you don't have a project, create one named "AbilityCenterBI"
   - If you have an existing project, select it

3. **Enable Required APIs**:
   - Google Sheets API
   - Google Drive API
   - BigQuery API
   - Google+ API (for user info)

### 2. OAuth 2.0 Client Configuration

1. **Navigate to Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"

2. **Configure OAuth Consent Screen** (if not done already):
   - User Type: External (for public use) or Internal (for organization only)
   - App name: "AbilityCenterBI"
   - User support email: Your email
   - App domain: `ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app`
   - Developer contact: Your email

3. **Create OAuth 2.0 Client ID**:
   - Application type: "Web application"
   - Name: "AbilityCenterBI Web Client"
   
4. **Configure Authorized Domains and URIs**:
   ```
   Authorized JavaScript origins:
   - https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app
   - http://localhost:5173 (for development)
   
   Authorized redirect URIs:
   - https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app
   - https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app/
   - http://localhost:5173 (for development)
   ```

### 3. Environment Variables Configuration

You'll need to update your Vercel environment variables with the credentials:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: "ability-center-bi"
3. **Go to Settings** > **Environment Variables**
4. **Add the following variables**:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Get Your Credentials

After creating the OAuth client:

1. **Client ID**: Copy the "Client ID" from your OAuth 2.0 client
2. **API Key**: 
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key
   - (Optional) Restrict the API key to specific APIs for security

### 5. Update Environment Variables in Vercel

1. In Vercel dashboard, add:
   - `VITE_GOOGLE_CLIENT_ID`: Your OAuth 2.0 Client ID
   - `VITE_GOOGLE_API_KEY`: Your Google API Key

2. **Redeploy** the application after adding environment variables

## Features Implemented

### ✅ Modern UI Redesign
- Clean, professional dashboard layout
- Modern card designs with rounded corners and shadows
- Improved spacing and visual hierarchy
- Responsive design for all screen sizes
- Professional color scheme with orange/navy blue branding

### ✅ Persistent Authentication
- Users stay logged in across browser sessions
- Secure localStorage implementation
- Automatic token refresh before expiration
- Session validation on app initialization
- Graceful handling of expired tokens

### ✅ Enhanced User Experience
- Smooth animations and transitions
- Loading states for all async operations
- Error handling with user-friendly messages
- Mobile-responsive navigation
- Professional sidebar and navigation

## Testing the Application

1. **Visit the deployed site**: https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app
2. **Before OAuth setup**: You'll see a login page but authentication will fail
3. **After OAuth setup**: Users can log in with Google and stay logged in

## Security Notes

- All authentication data is stored securely in localStorage
- Tokens are automatically refreshed before expiration
- OAuth scopes are limited to necessary permissions only
- HTTPS is enforced for all authentication flows

## Support

If you encounter any issues:

1. **Check browser console** for error messages
2. **Verify environment variables** are set correctly in Vercel
3. **Ensure OAuth URLs** match your deployment URL exactly
4. **Check Google Cloud Console** quotas and API limits

The application is now production-ready with a professional UI and robust authentication system!
