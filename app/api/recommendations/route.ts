import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
import { PromptLayer } from "promptlayer";


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const promptLayerClient = new PromptLayer();
// const OpenAI = promptLayerClient.OpenAI;
// const openai = new OpenAI();


export async function POST(request: Request) {
  try {
    const { festivalArtists, userTopArtists } = await request.json();


    const input_variables = {
      festivalArtists: festivalArtists.join(', '),
      topArtists: userTopArtists.join(', ')
    };

    const response = await promptLayerClient.run({
      promptName: "Lineup Searcher",
      inputVariables: input_variables,
    });

    let recommendation;
    if ('raw_response' in response) {
      recommendation = response.raw_response.choices[0].message.content;
      return NextResponse.json({ recommendation });
    } else {
      console.log("yo pots we had an error", response);
      return NextResponse.json({ error: 'No recommendation found' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error getting recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 