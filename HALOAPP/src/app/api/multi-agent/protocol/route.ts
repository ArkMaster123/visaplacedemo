import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getCurrentPrompt } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the protocol prompt (Method 4)
  const protocolPrompt = getCurrentPrompt('4');

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: protocolPrompt,
    messages,
  });

  return result.toDataStreamResponse();
} 