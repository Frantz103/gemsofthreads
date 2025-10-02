import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ThreadsAuthService, { ThreadsUser } from '@/services/threadsAuth';

const AuthButton = () => {
  const [user, setUser] = useState<ThreadsUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const currentUser = ThreadsAuthService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    ThreadsAuthService.initiateAuth(['threads_basic', 'threads_content_publish']);
  };

  const handleLogout = () => {
    ThreadsAuthService.logout();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user.username ? user.username[0].toUpperCase() : '?'}
            </span>
          </div>
          <span className="text-sm text-gray-700">
            {user.username ? `@${user.username}` : 'Authenticated'}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800"
        >
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Connecting...
        </div>
      ) : (
        <>
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-13h-2v6h2V7zm0 8h-2v2h2v-2z"/>
          </svg>
          Login with Threads
        </>
      )}
    </Button>
  );
};

export default AuthButton;