import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

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

export async function POST(req: Request) {
  try {
    const { messages, userProfile, model = 'gpt-4o-mini' } = await req.json();

    console.log('Assessment API called with:', { 
      messages: messages?.length, 
      userProfile, 
      model 
    });

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

    const result = await generateObject({
      model: openai(selectedModel),
      schema: AssessmentResponseSchema,
      system: `You are an expert immigration assessment assistant for VisaPlace. Your role is to guide users through structured immigration assessments for Canada and US.

CORE ASSESSMENT JOURNEYS:
1. **Canadian Express Entry Assessment** - For skilled workers
2. **US Green Card Assessment** - For permanent residence seekers  
3. **Study-to-Immigration Assessment** - For students planning to immigrate

ASSESSMENT FLOW PRINCIPLES:
- Ask ONE focused question at a time
- Provide 2-4 clear, actionable options as buttons
- Track progress through the assessment (0-100%)
- Give specific, personalized recommendations
- Calculate eligibility scores when possible

CURRENT USER PROFILE: ${JSON.stringify(userProfile || {})}
AI MODEL: ${selectedModel}

RESPONSE GUIDELINES:
- Keep messages conversational and encouraging
- Provide specific next steps, not generic advice
- Use progress tracking to show advancement
- Offer relevant options based on user's previous answers
- End with consultation booking when assessment is complete

ASSESSMENT STAGES:
1. **Country Selection** (0-10%) - Canada vs US preference
2. **Immigration Goal** (10-30%) - Work, study, family, business
3. **Background Assessment** (30-70%) - Education, experience, language
4. **Pathway Recommendation** (70-90%) - Specific programs/visas
5. **Next Steps** (90-100%) - Action plan and consultation booking

For the first message, always start with a welcoming message and provide country selection options.

Always provide actionable options that move the assessment forward. Never leave users without clear next steps.`,
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
    
    // Return a fallback response
    const fallbackResponse = {
      message: "Welcome to your immigration assessment! I'm here to help guide you through your Canadian or US immigration journey. Let's start by understanding your goals.",
      currentStep: "Country Selection",
      progress: 5,
      options: [
        {
          id: "country",
          text: "I want to immigrate to Canada",
          value: "canada",
          description: "Explore Canadian immigration pathways including Express Entry, PNP, and more"
        },
        {
          id: "country",
          text: "I want to immigrate to the United States",
          value: "usa",
          description: "Learn about US Green Cards, work visas, and family immigration"
        },
        {
          id: "country",
          text: "I'm not sure which country is better for me",
          value: "unsure",
          description: "Get guidance on choosing between Canada and US immigration"
        }
      ],
      nextAction: 'continue'
    };

    return new Response(JSON.stringify(fallbackResponse), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }
} 