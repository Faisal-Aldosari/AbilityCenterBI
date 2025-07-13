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

export const initGoogleAuth = async (): Promise<void> => {
  if (isInitialized) return;

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
    currentUser = null;
  } catch (error) {
    console.error('Google sign out error:', error);
    throw new Error('Failed to sign out');
  }
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const getAccessToken = (): string | null => {
  return currentUser?.accessToken || null;
};
