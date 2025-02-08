'use client';

import { useEffect, useState } from 'react';

export default function SpotifyLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check URL for token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (token) {
      localStorage.setItem('spotify_access_token', token);
      setIsAuthenticated(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if we have an existing token
      const storedToken = localStorage.getItem('spotify_access_token');
      setIsAuthenticated(!!storedToken);
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