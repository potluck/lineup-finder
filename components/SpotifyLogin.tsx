'use client';

import { useEffect, useState } from 'react';

export default function SpotifyLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
  }, []);

  const handleLogin = () => {
    // Redirect to our auth endpoint
    window.location.href = '/api/auth/login';
  };

  if (isAuthenticated) {
    return null;
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