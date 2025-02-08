'use client';

import { useState, useEffect } from 'react';
import { festivals, Festival } from '../app/data/festivals';

interface SpotifyArtist {
  name: string;
}

export default function FestivalSelector() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showArtists, setShowArtists] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [topArtists, setTopArtists] = useState<string[]>([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=25&time_range=medium_term', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch artists');
        
        const data = await response.json();
        setTopArtists(data.items.map((artist: SpotifyArtist) => artist.name));
      } catch (err) {
        console.error('Error fetching top artists:', err);
      }
    };

    fetchTopArtists();
  }, []);

  const getRecommendations = async (festival: Festival) => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          festivalArtists: festival.artists,
          userTopArtists: topArtists,
        }),
      });

      if (!response.ok) throw new Error('Failed to get recommendations');

      const data = await response.json();
      setRecommendations(data.recommendations.split('\n').filter(Boolean));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFestivalSelect = (festival: Festival | null) => {
    setSelectedFestival(festival);
    setShowArtists(false);
    setRecommendations([]);
    if (festival && topArtists.length > 0) {
      getRecommendations(festival);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <select
        className="w-full p-2 mb-8 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        onChange={(e) => {
          const festival = festivals.find(f => f.id === e.target.value);
          handleFestivalSelect(festival || null);
        }}
        value={selectedFestival?.id || ''}
      >
        <option value="">Select a festival</option>
        {festivals.map((festival) => (
          <option key={festival.id} value={festival.id}>
            {festival.name}
          </option>
        ))}
      </select>

      {selectedFestival && (
        <div>
          <h2 className="text-xl font-bold mb-4">Selected Festival: {selectedFestival.name}</h2>
          
          {loading ? (
            <p className="mb-4">Getting personalized recommendations...</p>
          ) : recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Recommended Artists for You:</h3>
              <ul className="list-disc pl-6">
                {recommendations.map((artist, index) => (
                  <li key={index} className="mb-2">{artist}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => setShowArtists(!showArtists)}
          >
            {showArtists ? 'Hide Full Lineup' : 'Show Full Lineup'}
          </button>
          
          {showArtists && selectedFestival.artists && (
            <ul className="list-disc pl-6">
              {selectedFestival.artists.map((artist, index) => (
                <li key={index} className="mb-2">{artist}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 