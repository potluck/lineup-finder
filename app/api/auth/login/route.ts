import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI || "");
  const scope = encodeURIComponent('user-top-read');
  
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
  
  return NextResponse.redirect(spotifyAuthUrl);
} 