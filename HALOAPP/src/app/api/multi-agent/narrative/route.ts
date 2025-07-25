import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getCurrentPrompt } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the narrative prompt (Method 1)
  const narrativePrompt = getCurrentPrompt('1');

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: narrativePrompt,
    messages,
  });

  return result.toDataStreamResponse();
} 