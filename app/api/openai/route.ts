
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

export async function POST(req: NextRequest) {
  const { model, prompt } = await req.json();

  try {
    const response = await openai.completions.create({
      model,
      prompt,
      max_tokens: 25,
    });

    return NextResponse.json({ text: response.choices[0].text.trim() });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
