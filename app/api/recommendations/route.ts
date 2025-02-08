import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { festivalArtists, userTopArtists } = await request.json();
    
    const prompt = `Given a user who likes these artists: ${userTopArtists.join(', ')},
    and a festival with these artists: ${festivalArtists.join(', ')},
    which festival artists would they most likely enjoy? Return only a list of 5 artists from the festival lineup.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const recommendations = completion.choices[0].message.content;
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 