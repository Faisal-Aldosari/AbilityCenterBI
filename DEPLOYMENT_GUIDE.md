# Deployment Guide for AbilityCenterBI

## Prerequisites
1. Google Cloud Project with enabled APIs
2. Vercel account
3. Domain name (optional)

## Step 1: Google Cloud Configuration

### Enable Required APIs
```bash
# Enable Google Sheets API
gcloud services enable sheets.googleapis.com

# Enable Google Drive API
gcloud services enable drive.googleapis.com

# Enable BigQuery API
gcloud services enable bigquery.googleapis.com

# Enable Gemini API
gcloud services enable generativelanguage.googleapis.com
```

### Create OAuth 2.0 Credentials
1. Go to Google Cloud Console > APIs & Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized origins:
   - `https://your-domain.vercel.app`
   - `http://localhost:5173` (for development)
4. Add authorized redirect URIs:
   - `https://your-domain.vercel.app/auth/callback`

### Get API Keys
1. Create API Key for Google Sheets
2. Create API Key for Gemini AI
3. Note your BigQuery Project ID

## Step 2: Vercel Deployment

### Install Vercel CLI (if not installed)
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy Application
```bash
# Build and deploy
npm run deploy
```

### Set Environment Variables
In Vercel Dashboard > Project Settings > Environment Variables:

```
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_BIGQUERY_PROJECT_ID=your_project_id
```

## Step 3: Domain Configuration (Optional)

### Custom Domain
1. Add custom domain in Vercel Dashboard
2. Update DNS records as instructed
3. Update OAuth redirect URIs in Google Cloud Console

## Step 4: Production Testing

### Test Features
- [ ] User authentication
- [ ] Google Sheets connection
- [ ] CSV upload
- [ ] Chart creation
- [ ] Report generation
- [ ] AI assistant
- [ ] Export functionality

### Performance Monitoring
- Set up error tracking (Sentry)
- Configure analytics (Google Analytics)
- Monitor Core Web Vitals

## Step 5: Post-Deployment

### Security
- Review and restrict API key scopes
- Set up rate limiting
- Enable HTTPS (automatic with Vercel)

### Monitoring
- Set up uptime monitoring
- Configure error alerts
- Monitor usage analytics

## Deployment Commands

### Quick Deploy
```bash
npm run deploy
```

### Development Preview
```bash
vercel
```

### Production Deploy
```bash
vercel --prod
```

## Troubleshooting

### Common Issues
1. **OAuth Errors**: Check redirect URIs match exactly
2. **API Errors**: Verify API keys and enabled services
3. **Build Errors**: Check environment variables are set
4. **CORS Issues**: Verify origins in Google Cloud Console

### Support
- Check Vercel deployment logs
- Review Google Cloud Console for API usage
- Test locally with production environment variables
