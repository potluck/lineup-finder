'use client';

import { useEffect, useState } from 'react';

interface TopArtist {
  id: string;
  name: string;
  genres: string[];
  images: { url: string }[];
}

export default function TopItems() {
  const [artists, setArtists] = useState<TopArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('spotify_access_token'));
  }, []);

  useEffect(() => {
    const fetchTopArtists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch('/api/spotify/top-artists', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch artists');
        
        const data = await response.json();
        setArtists(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (hasToken) {
      fetchTopArtists();
    }
  }, [hasToken]);

  if (!hasToken) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Your Top Artists</h2>
      <ul className="space-y-4">
        {artists.map((artist) => (
          <li key={artist.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded flex items-center gap-4">
            {artist.images[0] && (
              <img 
                src={artist.images[0].url} 
                alt={artist.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-bold">{artist.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {artist.genres.slice(0, 3).join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 