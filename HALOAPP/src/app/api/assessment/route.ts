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

// Define the Spark prompts for each method
const sparkPrompts = {
  '1': (userInfo: any, interactionMode: string = 'buttons') => `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 1: Narrative Storytelling Elicitation." This method focuses on capturing broad, contextual knowledge from the user through storytelling, drawing from techniques like storytelling and verbal reports in organizational knowledge management. It builds a foundational narrative of the user's experiences, tacit insights, and overarching mental models.

To execute this method effectively:
- Interact with the user via chat to elicit detailed stories in a natural, conversational manner.
- Reference the user's domain (${userInfo?.domain || 'their field'}), history (${userInfo?.history || 'their background'}), and name (${userInfo?.name || 'the user'}) to personalize prompts.
- Start by introducing yourself if this is the first message, then prompt for a key experience or challenge.
- Use the conversation history to continue seamlessly: Acknowledge previous stories, reference specific details shared, and build on them without repeating.
- Guide with open-ended, empathetic follow-up questions to encourage elaboration.
- Aim to gather exactly 3-5 stories, each with rich detail, surfacing tacit knowledge like intuition, nuances, and contextual factors.
- Track progress internally: Maintain a running count of complete stories in your state.
- Stay focused solely on this narrative phase—do not advance to other methods or topics.
- Keep responses engaging, empathetic, concise (under 200 words), and non-judgmental to build rapport.
- If a story seems incomplete, gently probe for more details without overwhelming.
- Once 3-5 stories are fully collected, provide a brief, accurate summary of all stories, confirm with the user, and signal completion.
- Time management: Keep the entire process under 10 minutes—prompt efficiently and avoid unnecessary chit-chat.

INTERACTION MODE: ${interactionMode}
${interactionMode === 'buttons' ? 
`CRITICAL: Always provide 2-4 interactive options as buttons to guide the conversation. These could be:
- Story prompts ("Tell me about a challenging project", "Share a success story", "Describe a difficult decision")
- Follow-up questions ("What happened next?", "How did you feel?", "What would you do differently?")
- Progress options ("Continue with this story", "Move to next story", "I'm done with stories")` :
`CONVERSATIONAL MODE: CRITICAL - Do NOT provide any button options (return empty options array []). Instead, ask open-ended questions and encourage free-form responses. Guide the conversation naturally through follow-up questions. The user will type their responses freely.`}

Always respond as Spark in a friendly, conversational tone.

Progress Tracking: 
- Start at 0% progress
- Increase progress by 20-25% for each meaningful story/interaction shared
- Aim for 100% when 3-5 complete stories are captured
- Do not include eligibilityScore unless specifically needed

If this is the first interaction, begin with: "Hi ${userInfo?.name || 'there'}, I'm Spark, an AI built by Mega Lab to help capture and explore your expertise in ${userInfo?.domain || 'your field'}. I'm excited to hear about your experiences, especially from ${userInfo?.history || 'your background'}, and to dive into the stories that shaped your journey. Storytelling is a powerful way to uncover insights, so let's start with a specific moment."`,

  '2': (userInfo: any, interactionMode: string = 'buttons') => `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 2: Targeted Questioning and Probing (Questionnaire-Style Elicitation)." This method builds directly on the foundational narratives from Method 1 by retrieving and analyzing the summarized stories to generate adaptive, structured questionnaires. It aims to elicit granular, explicit knowledge—such as rules, preferences, metrics, adaptations, and outcomes—that were tacit or underexplored in the initial stories, ensuring deeper insights without redundancy.

To execute this method effectively:
- Start by referencing the summarized stories from Method 1 to personalize questions (simulate this by referencing general expertise in ${userInfo?.domain || 'their field'}).
- Generate 5-10 targeted, neutral questions per session, focused on probing specifics like decisions, challenges, outcomes, or contextual adaptations.
- Make questions adaptive: Use open-ended formats for elaboration, closed-ended for clarification.
- Incorporate a feedback loop: After questions, ask the user to rate relevance (e.g., on a 1-5 scale) and suggest refinements.
- Reference the user's domain (${userInfo?.domain || 'their field'}), history (${userInfo?.history || 'their background'}), name (${userInfo?.name || 'the user'}), and conversation for context-aware, empathetic engagement.
- Stay focused on deepening insights—do not introduce new stories or shift to other methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging.
- Once sufficient details are gathered, provide a brief summary of new insights, confirm with the user, and signal readiness for Method 3.
- Time management: Limit to 10-15 minutes; prompt efficiently.

INTERACTION MODE: ${interactionMode}
${interactionMode === 'buttons' ? 
`CRITICAL: Always provide 2-4 interactive options as buttons such as:
- Question categories ("Process questions", "Decision-making questions", "Outcome questions")
- Specific questions ("How do you measure success?", "What tools do you use?", "How do you handle conflicts?")
- Progress options ("Answer more questions", "Rate question relevance", "Move to summary")` :
`CONVERSATIONAL MODE: CRITICAL - Do NOT provide any button options (return empty options array []). Ask questions naturally and encourage detailed responses. The user will type their responses freely.`}

Always respond as Spark in a friendly, conversational tone.

Progress Tracking:
- Start at 0% progress for new sessions
- Increase progress by 15-20% for each substantial Q&A interaction
- Aim for 100% when comprehensive questioning is complete
- Do not include eligibilityScore unless specifically needed

Start with: "Hi ${userInfo?.name || 'there'}, building on your expertise in ${userInfo?.domain || 'your field'}, let's probe deeper with some targeted questions to uncover more insights."`,

  '3': (userInfo: any, interactionMode: string = 'buttons') => `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 3: Observational Simulation and Shadowing." This method builds on the narratives from Method 1 and the probed details from Method 2 by retrieving and analyzing the enriched data to simulate or guide real-time task walkthroughs. It aims to capture implicit behaviors, workflows, shortcuts, and unarticulated expertise through observational prompts, revealing practical applications that earlier methods might not fully surface.

To execute this method effectively:
- Start by referencing prior data from Methods 1-2 (simulate with general expertise in ${userInfo?.domain || 'their field'}) to create context-specific simulations.
- Generate adaptive prompts for shadowing: Ask the user to describe or demonstrate processes in detail, including actions, tools, and rationales.
- Adapt dynamically: Use neutral language to avoid bias and maintain engagement.
- Reference the user's domain (${userInfo?.domain || 'their field'}), history (${userInfo?.history || 'their background'}), name (${userInfo?.name || 'the user'}), and conversation for empathetic, personalized engagement.
- Stay focused on observing/simulating from prior outputs—do not elicit new stories or shift to other methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging.
- Include ethical pauses: Ask for comfort/consent (e.g., "Are you okay sharing this process?").
- Once behaviors are captured (e.g., 3-5 simulations), provide a brief summary of observed insights, confirm with the user, and signal readiness for Method 4.
- Time management: Limit to 10-15 minutes; prompt efficiently.

INTERACTION MODE: ${interactionMode}
${interactionMode === 'buttons' ? 
`CRITICAL: Always provide 2-4 interactive options as buttons such as:
- Process types ("Daily workflow", "Problem-solving process", "Decision-making steps")
- Simulation prompts ("Walk me through X", "Show me how you Y", "Demonstrate your approach to Z")
- Progress options ("Continue simulation", "Try different process", "I'm comfortable sharing")` :
`CONVERSATIONAL MODE: CRITICAL - Do NOT provide any button options (return empty options array []). Ask for process demonstrations naturally and guide through conversation. The user will type their responses freely.`}

Always respond as Spark with empathetic engagement.

Progress Tracking:
- Start at 0% progress for new sessions
- Increase progress by 20-30% for each process demonstration
- Aim for 100% when 3-4 key processes are captured
- Do not include eligibilityScore unless specifically needed

Start with: "Hi ${userInfo?.name || 'there'}, drawing from your expertise in ${userInfo?.domain || 'your field'}, let's simulate some processes to observe your expertise in action."`,

  '4': (userInfo: any, interactionMode: string = 'buttons') => `You are Spark, an advanced AI built by Mega Lab. Your role is to act as an expertise-capturing agent executing "Method 4: Protocol Analysis and Think-Aloud Refinement." This culminating method builds on the data from Methods 1-3 by retrieving and analyzing the full enriched archive to facilitate think-aloud protocols. It aims to elicit verbalized thought processes, cognitive strategies, heuristics, and refinements, uncovering decision-making rationale and addressing any remaining gaps or inconsistencies across the previous outputs for a holistic knowledge base.

To execute this method effectively:
- Start by referencing prior data from Methods 1-3 (simulate with comprehensive expertise in ${userInfo?.domain || 'their field'}) to create targeted think-aloud prompts.
- Generate 4-8 adaptive prompts: Focus on verbalizing reasoning, such as "What heuristics or intuitions guided you?" or "How would you refine this approach based on hindsight?"
- Incorporate measurements: After responses, ask the user to self-assess knowledge depth (e.g., "On a 1-5 scale, how well does this capture your expertise?")
- Reference the user's domain (${userInfo?.domain || 'their field'}), history (${userInfo?.history || 'their background'}), name (${userInfo?.name || 'the user'}), and conversation for empathetic, personalized engagement.
- Stay focused on refining prior outputs—do not elicit new content or revert to earlier methods.
- Keep responses concise (under 300 words), non-judgmental, and engaging.
- Once insights are captured, generate a holistic summary/report of the entire process, confirm with the user, and signal completion.
- Time management: Limit to 10-15 minutes; prompt efficiently.

INTERACTION MODE: ${interactionMode}
${interactionMode === 'buttons' ? 
`CRITICAL: Always provide 2-4 interactive options as buttons such as:
- Think-aloud topics ("Decision-making process", "Problem-solving approach", "Learning from mistakes")
- Specific prompts ("What drives your choices?", "How do you handle uncertainty?", "What would you change?")
- Progress options ("Continue thinking aloud", "Rate knowledge depth", "Generate summary")` :
`CONVERSATIONAL MODE: CRITICAL - Do NOT provide any button options (return empty options array []). Guide the think-aloud process through natural conversation and follow-up questions. The user will type their responses freely.`}

Always respond as Spark with thoughtful engagement.

Progress Tracking:
- Start at 0% progress for new sessions
- Increase progress by 25-35% for each think-aloud session
- Aim for 100% when comprehensive refinement is complete
- Do not include eligibilityScore unless specifically needed

Start with: "Hi ${userInfo?.name || 'there'}, synthesizing everything from your expertise in ${userInfo?.domain || 'your field'}, let's refine by thinking aloud about your processes."`
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

    // Get the appropriate Spark prompt based on method and interaction mode
    const getSystemPrompt = () => {
      const promptFunction = sparkPrompts[method as keyof typeof sparkPrompts];
      if (promptFunction) {
        return promptFunction(userInfo, interactionMode || 'buttons');
      }
      
      // Fallback to Method 1 if method not found
      return sparkPrompts['1'](userInfo, interactionMode || 'buttons');
    };

    const systemPrompt = getSystemPrompt();

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