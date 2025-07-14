import type { User } from '../types';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

let isInitialized = false;
let currentUser: User | null = null;
let tokenClient: any = null;

// Storage keys
const USER_STORAGE_KEY = 'abi_user';
const TOKEN_STORAGE_KEY = 'abi_access_token';
const TOKEN_EXPIRY_KEY = 'abi_token_expiry';

// Helper functions for secure storage
const secureStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

// Check if stored token is still valid
const isTokenValid = (): boolean => {
  const expiry = secureStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return false;
  
  const expiryTime = parseInt(expiry, 10);
  const now = Date.now();
  
  // Add 5 minute buffer for token refresh
  return now < (expiryTime - 5 * 60 * 1000);
};

// Load user from storage
const loadUserFromStorage = (): User | null => {
  try {
    const userData = secureStorage.getItem(USER_STORAGE_KEY);
    const accessToken = secureStorage.getItem(TOKEN_STORAGE_KEY);
    
    if (!userData || !accessToken || !isTokenValid()) {
      clearStoredAuth();
      return null;
    }
    
    const user = JSON.parse(userData);
    user.accessToken = accessToken;
    
    return user;
  } catch (error) {
    console.error('Failed to load user from storage:', error);
    clearStoredAuth();
    return null;
  }
};

// Save user to storage
const saveUserToStorage = (user: User, expiresIn: number = 3600) => {
  try {
    const { accessToken, ...userWithoutToken } = user;
    
    secureStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutToken));
    secureStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    
    // Calculate expiry time (default 1 hour)
    const expiryTime = Date.now() + (expiresIn * 1000);
    secureStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to save user to storage:', error);
  }
};

// Clear stored authentication data
const clearStoredAuth = () => {
  secureStorage.removeItem(USER_STORAGE_KEY);
  secureStorage.removeItem(TOKEN_STORAGE_KEY);
  secureStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const initGoogleAuth = async (): Promise<void> => {
  if (isInitialized) return;

  // First, try to load user from storage
  const storedUser = loadUserFromStorage();
  if (storedUser) {
    currentUser = storedUser;
  }

  return new Promise((resolve, reject) => {
    // Load both GAPI and Google Identity Services
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    
    const gisScript = document.createElement('script');
    gisScript.src = 'https://accounts.google.com/gsi/client';
    
    let scriptsLoaded = 0;
    const checkAllLoaded = () => {
      scriptsLoaded++;
      if (scriptsLoaded === 2) {
        initializeAuth();
      }
    };

    const initializeAuth = async () => {
      try {
        // Initialize GAPI client
        await new Promise<void>((resolveGapi) => {
          window.gapi.load('client', resolveGapi);
        });

        await window.gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          discoveryDocs: [
            'https://sheets.googleapis.com/$discovery/rest?version=v4',
            'https://www.googleapis.com/discovery/v1/apis/bigquery/v2/rest',
            'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'
          ],
        });

        // If we have a stored user, set their token in gapi
        if (currentUser?.accessToken) {
          window.gapi.client.setToken({
            access_token: currentUser.accessToken,
          });
        }

        // Initialize token client for OAuth with popup mode
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: '', // defined later
        });

        isInitialized = true;
        resolve();
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        reject(error);
      }
    };

    gapiScript.onload = checkAllLoaded;
    gisScript.onload = checkAllLoaded;
    gapiScript.onerror = reject;
    gisScript.onerror = reject;

    document.head.appendChild(gapiScript);
    document.head.appendChild(gisScript);
  });
};

export const signIn = async (): Promise<User> => {
  try {
    if (!isInitialized) {
      await initGoogleAuth();
    }

    return new Promise((resolve, reject) => {
      tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          reject(new Error(resp.error));
          return;
        }

        try {
          // Get user info
          const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              'Authorization': `Bearer ${resp.access_token}`,
            },
          });

          if (!userInfoResponse.ok) {
            throw new Error('Failed to fetch user info');
          }

          const userInfo = await userInfoResponse.json();
          
          currentUser = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            accessToken: resp.access_token,
          };

          // Save user data to storage with expiration
          const expiresIn = resp.expires_in || 3600; // Default to 1 hour
          saveUserToStorage(currentUser, expiresIn);

          // Set the access token for gapi
          window.gapi.client.setToken({
            access_token: resp.access_token,
          });

          resolve(currentUser);
        } catch (error) {
          reject(error);
        }
      };

      tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  } catch (error) {
    console.error('Google sign in error:', error);
    throw new Error('Failed to sign in with Google');
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const token = window.gapi.client.getToken();
    if (token !== null) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
    }
    
    // Clear stored authentication data
    clearStoredAuth();
    currentUser = null;
  } catch (error) {
    console.error('Google sign out error:', error);
    // Even if revocation fails, clear local data
    clearStoredAuth();
    currentUser = null;
    throw new Error('Failed to sign out');
  }
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const getAccessToken = (): string | null => {
  return currentUser?.accessToken || null;
};

// Refresh token if needed
export const refreshTokenIfNeeded = async (): Promise<boolean> => {
  if (!currentUser) return false;
  
  if (isTokenValid()) {
    return true; // Token is still valid
  }
  
  try {
    // If token has expired, try to get a new one silently
    return new Promise((resolve) => {
      tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          console.log('Silent token refresh failed, user needs to re-authenticate');
          await signOut();
          resolve(false);
          return;
        }

        try {
          // Update current user with new token
          if (currentUser) {
            currentUser.accessToken = resp.access_token;
            
            // Save updated token to storage
            const expiresIn = resp.expires_in || 3600;
            saveUserToStorage(currentUser, expiresIn);
            
            // Set the new access token for gapi
            window.gapi.client.setToken({
              access_token: resp.access_token,
            });
            
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Token refresh error:', error);
          await signOut();
          resolve(false);
        }
      };

      // Request token silently (no user interaction)
      tokenClient.requestAccessToken({ prompt: '' });
    });
  } catch (error) {
    console.error('Token refresh failed:', error);
    await signOut();
    return false;
  }
};

// Validate current session
export const validateSession = async (): Promise<boolean> => {
  if (!currentUser) return false;
  
  try {
    // Check if token is still valid
    if (!isTokenValid()) {
      return await refreshTokenIfNeeded();
    }
    
    // Verify token with Google
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${currentUser.accessToken}`);
    
    if (!response.ok) {
      console.log('Token validation failed, attempting refresh');
      return await refreshTokenIfNeeded();
    }
    
    return true;
  } catch (error) {
    console.error('Session validation failed:', error);
    await signOut();
    return false;
  }
};
