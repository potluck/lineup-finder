'use client';

import { useEffect, useState } from 'react';

interface TopTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string };
}

export default function TopItems() {
  const [tracks, setTracks] = useState<TopTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('spotify_access_token'));
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) return;

      setLoading(true);
      try {
        const response = await fetch('/api/spotify/top-tracks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch tracks');
        
        const data = await response.json();
        setTracks(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (hasToken) {
      fetchTopTracks();
    }
  }, [hasToken]);

  if (!hasToken) {
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Your Top Tracks</h2>
      <ul className="space-y-4">
        {tracks.map((track) => (
          <li key={track.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="font-bold">{track.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {track.artists.map(a => a.name).join(', ')} • {track.album.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
} 