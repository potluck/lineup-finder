'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function SpotifyLogin() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    // Check URL for token and userId
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');

    if (token && userId) {
      localStorage.setItem('spotify_access_token', token);
      localStorage.setItem('spotify_user_id', userId);
      setIsAuthenticated(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if we have existing tokens
      const storedToken = localStorage.getItem('spotify_access_token');
      const storedUserId = localStorage.getItem('spotify_user_id');
      setIsAuthenticated(!!(storedToken && storedUserId));
    }
  }, [setIsAuthenticated]);

  const handleLogin = () => {
    // Redirect to our auth endpoint
    window.location.href = '/api/auth/login';
  };

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_user_id');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={handleLogout}
        className="rounded-full bg-red-600 text-white px-6 py-3 font-bold hover:bg-red-700"
      >
        Logout from Spotify
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded-full bg-[#1DB954] text-white px-6 py-3 font-bold hover:bg-[#1ed760]"
    >
      Connect Spotify
    </button>
  );
}