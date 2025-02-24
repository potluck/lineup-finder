'use client';

import { useState, useEffect } from 'react';
import { festivals, Festival } from '../app/data/festivals';

interface SpotifyArtist {
  name: string;
}

interface ArtistRecommendation {
  artist_name: string;
  reasoning: string;
}

interface RecommendationResponse {
  known_artists: ArtistRecommendation[];
  unknown_artists: ArtistRecommendation[];
}

export default function FestivalSelector() {
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);
  const [showArtists, setShowArtists] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
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
      const userId = localStorage.getItem('spotify_user_id');
      const checkExisting = await fetch(`/api/recommendations/db?userId=${userId}&festivalId=${festival.id}`);
      const existingData = await checkExisting.json();

      if (existingData.recommendation) {
        setRecommendations(JSON.parse(existingData.recommendation));
        setLoading(false);
        return;
      }

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
      const parsedRecommendation = JSON.parse(data.recommendation);

      await fetch('/api/recommendations/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          festivalId: festival.id,
          response: data.recommendation
        }),
      });

      setRecommendations(parsedRecommendation);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFestivalSelect = (festival: Festival | null) => {
    setSelectedFestival(festival);
    setShowArtists(false);
    setRecommendations(null);
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
          ) : recommendations && (
            <div className="mb-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Artists You Might Know:</h3>
                <ul className="list-disc pl-6">
                  {recommendations.known_artists.map((rec, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-medium">{rec.artist_name}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reasoning}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">New Artists to Discover:</h3>
                <ul className="list-disc pl-6">
                  {recommendations.unknown_artists.map((rec, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-medium">{rec.artist_name}</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{rec.reasoning}</p>
                    </li>
                  ))}
                </ul>
              </div>
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