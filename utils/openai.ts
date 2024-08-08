
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePrompts(model: string, prompt: string): Promise<string> {
  try {
    // Call OpenAI API to generate a concise answer
    const response = await openai.completions.create({
      model,
      prompt,
      max_tokens: 50,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    console.error('Error in generatePrompts:', error);
    throw error;
  }
}

export default openai;
