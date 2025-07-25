import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getCurrentPrompt } from '@/lib/prompts';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the schema for the assessment response
const AssessmentResponseSchema = z.object({
  message: z.string().describe('The main response message to the user'),
  currentStep: z.string().describe('Current step in the assessment process'),
  progress: z.number().min(0).max(100).describe('Progress percentage (0-100)'),
  options: z.array(z.object({
    id: z.string().describe('Unique identifier for the option'),
    text: z.string().describe('Button text to display'),
    value: z.string().describe('Value to send when clicked'),
    description: z.string().optional().describe('Optional description for the option')
  })).describe('Interactive options/buttons for the user'),
  nextAction: z.enum(['continue', 'complete', 'redirect']).describe('What should happen next'),
  recommendations: z.array(z.string()).optional().describe('Specific recommendations based on user responses'),
  eligibilityScore: z.number().min(0).max(100).optional().describe('Eligibility score if applicable')
});

// Function to get the system prompt with custom prompts support
const getSystemPrompt = (method: string, userInfo: any, interactionMode: string = 'buttons') => {
  // Get the base prompt (custom or default)
  let basePrompt = getCurrentPrompt(method as any);
  
  // Replace placeholders with actual user info
  basePrompt = basePrompt
    .replace(/{user_domain}/g, userInfo?.domain || 'their field')
    .replace(/{user_history}/g, userInfo?.history || 'their background')
    .replace(/{user_name}/g, userInfo?.name || 'the user')
    .replace(/{chat_history}/g, 'conversation history');

  // Add interaction mode specific instructions
  const interactionInstructions = interactionMode === 'buttons' ? 
    `\n\nINTERACTION MODE: ${interactionMode}
CRITICAL: Always provide 2-4 interactive options as buttons to guide the conversation. These could be:
- Story prompts ("Tell me about a challenging project", "Share a success story", "Describe a difficult decision")
- Follow-up questions ("What happened next?", "How did you feel?", "What would you do differently?")
- Progress options ("Continue with this story", "Move to next story", "I'm done with stories")` :
    `\n\nINTERACTION MODE: ${interactionMode}
CONVERSATIONAL MODE: CRITICAL - Do NOT provide any button options (return empty options array []). Instead, ask open-ended questions and encourage free-form responses. Guide the conversation naturally through follow-up questions. The user will type their responses freely.`;

  // Add progress tracking instructions
  const progressInstructions = `
\n\nProgress Tracking: 
- Start at 0% progress
- Increase progress by 20-25% for each meaningful story/interaction shared
- Aim for 100% when 3-5 complete stories are captured
- Do not include eligibilityScore unless specifically needed`;

  return basePrompt + interactionInstructions + progressInstructions;
};

export async function POST(req: Request) {
  try {
    const { messages, userProfile, model = 'gpt-4o-mini', method = '1', userInfo, interactionMode } = await req.json();

    console.log('Assessment API called with:', { 
      messages: messages?.length, 
      userProfile, 
      model,
      method,
      userInfo,
      interactionMode
    });

    // Check if this is the very first interaction (no messages or just one initial message)
    const isFirstInteraction = !messages || messages.length <= 1;

    // If first interaction and no interaction mode selected, offer choice
    if (isFirstInteraction && !interactionMode) {
      const methodTitles = {
        '1': 'Narrative Storytelling',
        '2': 'Targeted Questioning',
        '3': 'Observational Simulation', 
        '4': 'Protocol Analysis'
      };

      return new Response(JSON.stringify({
        message: `Hi ${userInfo?.name || 'there'}! I'm Spark, and I'm excited to help capture your expertise in ${userInfo?.domain || 'your field'} using Method ${method}: ${methodTitles[method as keyof typeof methodTitles]}. ${userInfo?.history ? `I'd love to hear about your experience from ${userInfo.history}.` : ''}\n\nBefore we begin, how would you prefer to interact with me?`,
        currentStep: 'Interaction Mode Selection',
        progress: 0,
        options: [
          {
            id: "mode_buttons",
            text: "📱 Guided with buttons",
            value: "buttons",
            description: "I'll provide helpful buttons to guide our conversation step-by-step"
          },
          {
            id: "mode_conversation",
            text: "💬 Open conversation",
            value: "conversation", 
            description: "Let's have a natural, free-flowing conversation without buttons"
          }
        ],
        nextAction: 'continue' as const
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Map frontend model names to OpenAI model names
    const modelMap: Record<string, string> = {
      'gpt-4o-mini': 'gpt-4o-mini',
      'gpt-4.1-nano': 'gpt-4o-mini' // Using gpt-4o-mini as the actual model for nano
    };

    const selectedModel = modelMap[model] || 'gpt-4o-mini';
    console.log('Using AI model:', selectedModel);

    // Get the system prompt with custom prompts support
    const systemPrompt = getSystemPrompt(method, userInfo, interactionMode || 'buttons');

    const result = await generateObject({
      model: openai(selectedModel),
      schema: AssessmentResponseSchema,
      system: systemPrompt,
      messages: messages || [],
    });

    console.log('GenerateObject result:', result.object);
    
    // Return the object as JSON
    return new Response(JSON.stringify(result.object), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    console.error('Assessment API error:', error);
    
    // Return a fallback response based on method
    const getFallbackResponse = (method: string, userInfo: any, interactionMode: string) => {
      const methodTitles = {
        '1': 'Narrative Storytelling',
        '2': 'Targeted Questioning',
        '3': 'Observational Simulation', 
        '4': 'Protocol Analysis'
      };

      // If no interaction mode, offer choice
      if (!interactionMode) {
        return {
          message: `Hi ${userInfo?.name || 'there'}! I'm Spark, and I'm excited to help capture your expertise in ${userInfo?.domain || 'your field'} using Method ${method}: ${methodTitles[method as keyof typeof methodTitles]}. ${userInfo?.history ? `I'd love to hear about your experience from ${userInfo.history}.` : ''}\n\nBefore we begin, how would you prefer to interact with me?`,
          currentStep: 'Interaction Mode Selection',
          progress: 0,
          options: [
            {
              id: "mode_buttons",
              text: "📱 Guided with buttons",
              value: "buttons",
              description: "I'll provide helpful buttons to guide our conversation step-by-step"
            },
            {
              id: "mode_conversation",
              text: "💬 Open conversation",
              value: "conversation", 
              description: "Let's have a natural, free-flowing conversation without buttons"
            }
          ],
          nextAction: 'continue' as const
        };
      }

      const getMethodOptions = (method: string) => {
        if (interactionMode === 'conversation') {
          return []; // No buttons for conversation mode
        }

        switch(method) {
          case '1':
            return [
              {
                id: "story1",
                text: "Share a challenging project story",
                value: "I'd like to share a story about a challenging project I worked on...",
                description: "Tell me about a complex project you tackled"
              },
              {
                id: "story2", 
                text: "Describe a successful outcome",
                value: "Let me tell you about a time when things went really well...",
                description: "Share a story about a major success"
              },
              {
                id: "story3",
                text: "Talk about a difficult decision",
                value: "I remember having to make a tough decision when...",
                description: "Describe a challenging choice you had to make"
              }
            ];
          case '2':
            return [
              {
                id: "process",
                text: "Process questions",
                value: "I'd like to answer questions about my processes",
                description: "How do you approach your work?"
              },
              {
                id: "decisions",
                text: "Decision-making questions", 
                value: "I'd like to answer questions about decision-making",
                description: "How do you make important choices?"
              },
              {
                id: "tools",
                text: "Tools and methods questions",
                value: "I'd like to answer questions about tools and methods",
                description: "What tools and techniques do you use?"
              }
            ];
          case '3':
            return [
              {
                id: "workflow",
                text: "Show daily workflow",
                value: "I'll walk you through my typical daily workflow",
                description: "Demonstrate your regular work process"
              },
              {
                id: "problem_solving",
                text: "Demonstrate problem-solving",
                value: "Let me show you how I approach problem-solving",
                description: "Walk through your problem-solving process"
              },
              {
                id: "decision_process",
                text: "Show decision-making steps",
                value: "I'll demonstrate how I make decisions",
                description: "Step through your decision-making process"
              }
            ];
          case '4':
            return [
              {
                id: "thinking",
                text: "Verbalize my thinking process",
                value: "I'll think aloud about how I approach problems",
                description: "Share your internal thought process"
              },
              {
                id: "strategies",
                text: "Discuss my strategies",
                value: "Let me explain the strategies I use",
                description: "Talk about your key approaches and methods"
              },
              {
                id: "refinements",
                text: "Share lessons learned",
                value: "I'll discuss what I've learned and would change",
                description: "Reflect on improvements and refinements"
              }
            ];
          default:
            return [
              {
                id: "start",
                text: "I'm ready to begin",
                value: "start",
                description: `Start the ${methodTitles[method as keyof typeof methodTitles]} process`
              }
            ];
        }
      };

      return {
        message: `Hi ${userInfo?.name || 'there'}! I'm Spark, and I'm excited to help capture your expertise in ${userInfo?.domain || 'your field'} using Method ${method}: ${methodTitles[method as keyof typeof methodTitles] || 'Expertise Capture'}. ${userInfo?.history ? `I'd love to hear about your experience from ${userInfo.history}.` : ''} Let's begin this journey together!`,
        currentStep: `Method ${method} - Getting Started`,
        progress: 5,
        options: getMethodOptions(method),
        nextAction: 'continue' as const
      };
    };

    const fallbackResponse = getFallbackResponse(method, userInfo, interactionMode);

    return new Response(JSON.stringify(fallbackResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
} 