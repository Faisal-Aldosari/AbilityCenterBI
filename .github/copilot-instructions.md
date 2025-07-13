<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# AbilityCenterBI Development Guidelines

## Project Overview
AbilityCenterBI is a Power BI replica built with React, TypeScript, and Tailwind CSS. It provides data visualization capabilities using Google Sheets and BigQuery as data sources.

## Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Google OAuth 2.0
- **Charts**: Recharts, Chart.js
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Deployment**: Vercel

## Code Style Guidelines

### React Components
- Use functional components with TypeScript
- Implement proper prop types using interfaces
- Use React hooks for state management
- Follow the component structure: imports, types, component, export

### Styling
- Use Tailwind CSS classes for styling
- Follow the design system colors: white, #F8941 (orange), #2E2C6E (navy blue)
- Use the Poppins font family
- Implement responsive design with mobile-first approach

### API Integration
- Use the services directory for API calls
- Implement proper error handling with try-catch blocks
- Use React Query for data fetching and caching
- Handle loading and error states appropriately

### Authentication
- Use the AuthContext for user state management
- Implement proper route protection with ProtectedRoute components
- Handle authentication errors gracefully

### Data Handling
- Use proper TypeScript interfaces for data structures
- Implement data validation and sanitization
- Handle null/undefined values safely
- Use proper error boundaries for data fetching errors

## File Organization
```
src/
├── components/     # Reusable UI components
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── services/      # API service functions
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Best Practices
1. Always use type-only imports for TypeScript types
2. Implement proper error handling for all async operations
3. Use meaningful component and variable names
4. Add proper loading states for async operations
5. Implement responsive design for all components
6. Use semantic HTML elements where appropriate
7. Add proper accessibility attributes (ARIA labels, etc.)
8. Optimize performance with React.memo where needed

## Google APIs Integration
- Use the provided API credentials for development
- Implement proper scopes for Google Sheets and BigQuery access
- Handle API rate limits and quotas appropriately
- Cache API responses when possible

## Testing Considerations
- Write unit tests for utility functions
- Test components with different props and states
- Mock external API calls in tests
- Test authentication flows thoroughly
