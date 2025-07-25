import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getCurrentPrompt } from '@/lib/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the questionnaire prompt (Method 2)
  const questionnairePrompt = getCurrentPrompt('2');

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: questionnairePrompt,
    messages,
  });

  return result.toDataStreamResponse();
} 