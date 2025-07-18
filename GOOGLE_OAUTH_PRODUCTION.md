# Google OAuth Configuration for Production

## 🔧 Required: Update OAuth Settings

Your AbilityCenterBI application is live, but you need to update Google OAuth settings to enable authentication in production.

### Production URLs to Add
- **Primary Domain**: `https://ability-center-bi-faisal-aldosari-faisal-aldosaris-projects.vercel.app`
- **Latest Domain**: `https://ability-center-ku5khl1jw-faisal-aldosaris-projects.vercel.app`

### Steps to Configure

#### 1. Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Navigate to "APIs & Services" > "Credentials"

#### 2. Update OAuth 2.0 Client
1. Find your OAuth 2.0 Client ID: `900289552842-udgqb4cr0f2oo4r9i91k43c0n5lusbpq.apps.googleusercontent.com`
2. Click to edit
3. Under "Authorized JavaScript origins", add:
   ```
   https://ability-center-bi-faisal-aldosari-faisal-aldosaris-projects.vercel.app
   https://ability-center-ku5khl1jw-faisal-aldosaris-projects.vercel.app
   ```
4. Under "Authorized redirect URIs", add:
   ```
   https://ability-center-bi-faisal-aldosari-faisal-aldosaris-projects.vercel.app/auth/callback
   https://ability-center-ku5khl1jw-faisal-aldosaris-projects.vercel.app/auth/callback
   ```

#### 3. Save Changes
Click "Save" to apply the changes.

### ⚠️ Important Notes
- Changes may take 5-10 minutes to propagate
- Keep localhost URLs for development
- Test authentication after updating

### 🧪 Test Authentication
1. Visit your production site
2. Try to sign in with Google
3. Verify all features work with authenticated user

### 🎯 Current Environment Variables (Already Set)
```
VITE_GOOGLE_CLIENT_ID=900289552842-udgqb4cr0f2oo4r9i91k43c0n5lusbpq.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIzaSyArDrOchugjmzMbjuxlELPNI78-DY6XORw
```

## ✅ After Configuration
Once OAuth is updated:
1. Authentication will work in production
2. Google Sheets integration will be functional
3. All features will be fully operational
4. Users can start using the application immediately

Your application is now fully production-ready! 🚀
