// OAuth Authentication Service for Threads API

const THREADS_AUTH_BASE_URL = import.meta.env.VITE_THREADS_AUTH_BASE_URL || 'https://threads.net';
const REDIRECT_URI = import.meta.env.VITE_THREADS_REDIRECT_URI || `${window.location.origin}/auth/callback`;

export interface ThreadsUser {
  id: string;
  username?: string;
}

export class ThreadsAuthService {
  /**
   * Generate a secure random string for CSRF protection
   */
  private static generateState(): string {
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  /**
   * Initiate OAuth flow by redirecting to Threads authorization
   */
  static initiateAuth(scopes: string[] = ['threads_basic']): void {
    const state = this.generateState();
    const clientId = import.meta.env.VITE_THREADS_CLIENT_ID || '1252170616679839';

    // Store state for verification during callback
    sessionStorage.setItem('threads_oauth_state', state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      scope: scopes.join(','),
      response_type: 'code',
      state: state
    });

    const authUrl = `${THREADS_AUTH_BASE_URL}/oauth/authorize?${params.toString()}`;

    // Redirect to Threads for authorization
    window.location.href = authUrl;
  }

  /**
   * Check if user is currently authenticated
   */
  static isAuthenticated(): boolean {
    return localStorage.getItem('threads_user_id') !== null;
  }

  /**
   * Get current user information
   */
  static getCurrentUser(): ThreadsUser | null {
    const userId = localStorage.getItem('threads_user_id');
    const username = localStorage.getItem('threads_username');

    if (!userId) return null;

    return {
      id: userId,
      username: username || undefined
    };
  }

  /**
   * Logout user by clearing stored data
   */
  static logout(): void {
    localStorage.removeItem('threads_user_id');
    localStorage.removeItem('threads_username');
    sessionStorage.removeItem('threads_oauth_state');

    // Call backend to clear httpOnly cookies
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    }).catch(console.error);
  }

  /**
   * Get authorization header for API calls (if needed)
   */
  static async getAuthHeader(): Promise<string | null> {
    if (!this.isAuthenticated()) return null;

    try {
      // Check if token is still valid by making a test API call
      const response = await fetch('/api/auth/verify', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        return `Bearer ${data.access_token}`;
      }

      // Token invalid, logout user
      this.logout();
      return null;
    } catch (error) {
      console.error('Auth verification failed:', error);
      this.logout();
      return null;
    }
  }

  /**
   * Refresh access token if needed
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user_id) {
          localStorage.setItem('threads_user_id', data.user_id);
          if (data.username) {
            localStorage.setItem('threads_username', data.username);
          }
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }
}

export default ThreadsAuthService;