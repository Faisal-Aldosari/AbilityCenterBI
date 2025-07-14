# AbilityCenterBI

A powerful, modern Power BI replica built with React, TypeScript, and Tailwind CSS. Connect to Google Sheets and BigQuery to create stunning data visualizations and interactive dashboards.

## 🌐 Live Demo

**Production URL**: [https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app](https://ability-center-h0m0j15cw-faisal-aldosaris-projects.vercel.app)

> **Note**: For Google OAuth to work, please see the [Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md) for configuration instructions.

![AbilityCenterBI](https://via.placeholder.com/800x400/F8941/FFFFFF?text=AbilityCenterBI)

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with Google accounts + **Persistent Sessions**
- 📊 **Multiple Data Sources** - Connect to Google Sheets and BigQuery
- 📈 **Advanced Chart Types** - Bar, line, pie, scatter, area, candlestick, waterfall, treemap, gauge, funnel, and more
- 🤖 **AI-Powered Analytics** - Gemini AI integration for data insights and automated reporting
- 🎨 **Customizable Dashboards** - Drag-and-drop dashboard builder with advanced layouts
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 📄 **Export Capabilities** - Generate PDF reports and CSV exports
- 🚀 **Real-time Sync** - Live data updates from your sources
- 🔧 **Advanced Filtering** - Complex multi-condition filters with AND/OR logic
- ⚙️ **Data Transformation** - Aggregations, grouping, sorting, and calculated fields
- 💹 **Financial Analysis** - Built-in financial metrics and ratio calculations
- 💬 **AI Chat Assistant** - Natural language queries and insights from Gemini AI
- 📊 **Sample Finance Data** - Pre-loaded demo data for immediate exploration
- ✨ **Modern UI Design** - Clean, professional interface with smooth animations
- 🔄 **Auto Token Refresh** - Seamless authentication without re-login requirements

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **Authentication**: Google OAuth 2.0
- **Charts**: Recharts, Chart.js
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Project with enabled APIs

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/abilitycenterbi.git
   cd abilitycenterbi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Google API credentials:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret
   VITE_GOOGLE_API_KEY=your_google_api_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Google Cloud Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Sheets API
   - BigQuery API
   - Google Drive API
   - Google People API

### 2. Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Configure the consent screen
4. Add authorized origins:
   - `http://localhost:5173` (development)
   - `https://your-domain.vercel.app` (production)

### 3. Get API Key

1. In **Credentials**, click **Create Credentials** > **API Key**
2. Restrict the key to the required APIs for security

## 📊 Data Sources

### Google Sheets

1. **Connect**: Click "Connect Data Source" and select Google Sheets
2. **Authenticate**: Sign in with your Google account
3. **Select Sheet**: Choose from your available spreadsheets
4. **Import**: Data is automatically parsed and imported

### BigQuery

1. **Connect**: Click "Connect Data Source" and select BigQuery
2. **Configure**: Enter your project ID, dataset, and table
3. **Query**: Use SQL queries to filter and shape your data
4. **Import**: Data is fetched and ready for visualization

## 🎨 Creating Visualizations

### Chart Types

- **Bar Chart**: Compare categories of data
- **Line Chart**: Show trends over time
- **Pie Chart**: Display proportions
- **Scatter Plot**: Show correlations
- **Area Chart**: Filled line charts
- **Doughnut**: Pie chart with center hole

### Customization Options

- **Colors**: Choose from predefined palettes or custom colors
- **Axes**: Configure labels, scales, and formatting
- **Filters**: Add dynamic filters to your charts
- **Legend**: Position and style chart legends
- **Animations**: Smooth transitions and interactions

## 📄 Reports & Export

### PDF Export

1. Create your dashboard with multiple charts
2. Click **Export** > **PDF Report**
3. Choose layout options (portrait/landscape)
4. Download professional PDF report

### Features

- Custom report headers and footers
- Multiple chart layouts
- Data tables inclusion
- Branded styling

## 🚀 Deployment

### Production Ready ✅

AbilityCenterBI is fully optimized and production-ready with:

- ✅ **Error Boundaries** - Graceful error handling and recovery
- ✅ **Performance Monitoring** - Built-in performance tracking
- ✅ **SEO Optimization** - Complete meta tags, sitemap, and structured data
- ✅ **PWA Support** - Installable as a Progressive Web App
- ✅ **Security Hardened** - No vulnerabilities, secure authentication
- ✅ **Professional Legal Pages** - Privacy policy and terms of service
- ✅ **Contact Integration** - Real contact information configured
- ✅ **404 Handling** - Custom not found page with navigation
- ✅ **Loading States** - Skeleton loaders and loading indicators
- ✅ **Notification System** - Toast notifications for user feedback
- ✅ **Mobile Responsive** - Optimized for all device sizes
- ✅ **Type Safety** - Full TypeScript implementation

### Live Application

🌐 **Production URL**: [https://ability-center-bi.vercel.app](https://ability-center-bi.vercel.app)

📄 **Professional Pages**:
- [Home Page](https://ability-center-bi.vercel.app/home.html)
- [Privacy Policy](https://ability-center-bi.vercel.app/privacy-policy.html)
- [Terms of Service](https://ability-center-bi.vercel.app/terms-of-service.html)

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

3. **Environment Variables**
   Set your environment variables in Vercel dashboard:
   - `VITE_GOOGLE_CLIENT_ID`
   - `VITE_GOOGLE_CLIENT_SECRET`
   - `VITE_GOOGLE_API_KEY`
   - `VITE_API_BASE_URL=https://your-domain.vercel.app/api`

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- AWS S3 + CloudFront
- Firebase Hosting
- GitHub Pages

## 🔐 Google OAuth Setup

### Required Google Cloud Configuration

1. **Create OAuth 2.0 Credentials**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable required APIs:
     - Google Sheets API
     - BigQuery API  
     - Google Drive API
     - Google People API

2. **Configure OAuth Consent Screen**
   - App name: `AbilityCenterBI`
   - User support email: `faldosari2008@gmail.com`
   - Developer contact: `faldosari2008@gmail.com`
   - App domain: `ability-center-bi.vercel.app`
   - Privacy policy: `https://ability-center-bi.vercel.app/privacy-policy.html`
   - Terms of service: `https://ability-center-bi.vercel.app/terms-of-service.html`

3. **Authorized JavaScript Origins**
   ```
   https://ability-center-bi.vercel.app
   http://localhost:5173
   ```

4. **Publishing Status**
   - For personal use: Keep in "Testing" mode
   - For public use: Submit for verification and publish to "In production"

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── components/         # React components
│   ├── charts/        # Chart components
│   ├── dashboard/     # Dashboard components
│   └── ui/            # UI components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── services/          # API services
├── types/             # TypeScript types
├── utils/             # Utility functions
└── styles/            # Global styles
```

## 📞 Support & Contact

- **Email**: faldosari2008@gmail.com
- **GitHub**: [Faisal-Aldosari/AbilityCenterBI](https://github.com/Faisal-Aldosari/AbilityCenterBI)
- **Live App**: [https://ability-center-bi.vercel.app](https://ability-center-bi.vercel.app)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Faisal Aldosari**

*AbilityCenterBI - Transform your data into actionable insights*