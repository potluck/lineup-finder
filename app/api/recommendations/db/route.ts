import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const festivalId = searchParams.get('festivalId');

  if (!userId || !festivalId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const { rows } = await sql`
      SELECT response 
      FROM ai_responses 
      WHERE user_id = ${userId} 
      AND festival = ${festivalId}
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({ recommendation: rows[0].response });
    }

    return NextResponse.json({ recommendation: null });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to check recommendation' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, festivalId, response } = await request.json();

    console.log("yo we here", userId, festivalId, response);
    if (!userId || !festivalId || !response) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await sql`
      INSERT INTO ai_responses (user_id, festival, response)
      VALUES (${userId}, ${festivalId}, ${response})
    `;

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to save recommendation' },
      { status: 500 }
    );
  }
} 