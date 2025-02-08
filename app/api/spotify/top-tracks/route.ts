import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=medium_term', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch top tracks');
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top tracks' },
      { status: 500 }
    );
  }
} 