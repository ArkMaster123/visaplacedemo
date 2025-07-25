import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getCurrentPrompt } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the simulation prompt (Method 3)
  const simulationPrompt = getCurrentPrompt('3');

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: simulationPrompt,
    messages,
  });

  return result.toDataStreamResponse();
} 