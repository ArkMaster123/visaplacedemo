import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 60;

interface ToolCallRequest {
  location?: string;
  expertise_domain?: string;
  capture_type?: 'narrative' | 'questionnaire' | 'simulation' | 'protocol' | 'orchestrator';
  user_input?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ToolCallRequest = await req.json();
    
    const { location, expertise_domain, capture_type = 'orchestrator', user_input } = body;

    if (!user_input) {
      return NextResponse.json({
        error: 'No user input provided',
        fallback_content: 'I was unable to capture your expertise. Please try speaking again.'
      }, { status: 400 });
    }

    // Route to appropriate agent based on capture_type
    let agentResponse = '';
    let agentName = '';

    switch (capture_type) {
      case 'narrative':
        agentName = 'Narrative Agent';
        agentResponse = await processWithAgent('narrative', user_input, expertise_domain);
        break;
      case 'questionnaire':
        agentName = 'Questionnaire Agent';
        agentResponse = await processWithAgent('questionnaire', user_input, expertise_domain);
        break;
      case 'simulation':
        agentName = 'Simulation Agent';
        agentResponse = await processWithAgent('simulation', user_input, expertise_domain);
        break;
      case 'protocol':
        agentName = 'Protocol Agent';
        agentResponse = await processWithAgent('protocol', user_input, expertise_domain);
        break;
      default:
        agentName = 'Orchestrator Agent';
        agentResponse = await processWithAgent('orchestrator', user_input, expertise_domain);
        break;
    }

    // Store the captured expertise (in a real app, this would go to a database)
    const capturedData = {
      timestamp: new Date().toISOString(),
      agent: agentName,
      domain: expertise_domain || 'general',
      location: location || 'unknown',
      input: user_input,
      response: agentResponse,
      capture_type
    };

    console.log('Captured expertise:', capturedData);

    return NextResponse.json({
      success: true,
      agent: agentName,
      captured_expertise: capturedData,
      response: agentResponse,
      next_steps: [
        'Review the captured knowledge in the Agents Setup',
        'Refine agent prompts if needed',
        'Export your expertise framework',
        'Share with your team'
      ]
    });

  } catch (error) {
    console.error('Error in capture-expertise tool:', error);
    return NextResponse.json({
      error: 'Failed to capture expertise',
      fallback_content: 'I encountered an error while processing your expertise. Please try again.'
    }, { status: 500 });
  }
}

async function processWithAgent(agentType: string, userInput: string, domain?: string) {
  const agentPrompts = {
    orchestrator: `You are the Orchestrator Agent, a sophisticated AI coordinator designed to manage and coordinate multiple specialized agents in an expertise capture system.

Your role is to:
1. **Coordinate Workflow**: Manage the flow between different agents (Narrative, Questionnaire, Simulation, Protocol)
2. **Context Management**: Maintain context across all agent interactions and ensure continuity
3. **Progress Tracking**: Monitor the progress of each agent and ensure completion of their tasks
4. **Quality Control**: Ensure that each agent's output meets quality standards before proceeding
5. **User Experience**: Provide a seamless experience by managing transitions between agents

Expertise Domain: ${domain || 'General'}

User Input: "${userInput}"

Analyze this input and provide guidance on how to proceed with expertise capture. Consider which agent would be most appropriate for the next step.`,

    narrative: `You are the Narrative Agent, specialized in Method 1: Narrative Storytelling Elicitation.

Your role is to elicit detailed stories from users about their experiences, challenges, and tacit insights in their domain.

Expertise Domain: ${domain || 'General'}

User Input: "${userInput}"

Extract and structure the narrative elements from this input. Identify key experiences, challenges, and insights that can be captured as stories.`,

    questionnaire: `You are the Questionnaire Agent, specialized in Method 2: Targeted Questioning and Probing.

Your role is to ask targeted questions that deepen specific elements from user narratives.

Expertise Domain: ${domain || 'General'}

User Input: "${userInput}"

Based on this input, identify areas that need deeper probing and generate targeted questions to uncover explicit knowledge, rules, and preferences.`,

    simulation: `You are the Simulation Agent, specialized in Method 3: Observational Simulation and Shadowing.

Your role is to guide users through real-time task walkthroughs and capture implicit behaviors.

Expertise Domain: ${domain || 'General'}

User Input: "${userInput}"

Identify processes and workflows mentioned in this input that could benefit from step-by-step simulation or walkthrough.`,

    protocol: `You are the Protocol Agent, specialized in Method 4: Protocol Analysis and Think-Aloud Refinement.

Your role is to capture cognitive processes and decision-making strategies.

Expertise Domain: ${domain || 'General'}

User Input: "${userInput}"

Analyze this input for cognitive processes, decision-making patterns, and thought processes that can be captured and structured.`
  };

  const { text } = await generateText({
    model: openai('gpt-4o-mini'),
    system: agentPrompts[agentType as keyof typeof agentPrompts],
    prompt: `Process the following user input for expertise capture: ${userInput}`
  });

  return text;
} 