import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export const maxDuration = 60;

interface HALOReviewRequest {
  conversation: Array<{
    role: string;
    content: string;
    timestamp: string;
    emotions?: Record<string, number>;
  }>;
  settings: {
    enabled: boolean;
    customPrompt?: string;
  };
}

const DEFAULT_HALO_PROMPT = `You are HALO (Human-AI Learning Orchestrator), an advanced AI system specialized in analyzing expertise capture conversations and providing actionable insights.

Your role is to:
1. **Analyze Conversation Quality**: Evaluate how well expertise was captured during the voice interaction
2. **Emotional Intelligence**: Review emotional patterns and their impact on knowledge sharing
3. **Knowledge Gaps**: Identify areas that need deeper exploration
4. **Optimization Recommendations**: Suggest improvements for better expertise elicitation
5. **Next Steps**: Provide clear, actionable next steps for the user

When reviewing conversations, focus on:
- Quality of questions asked and responses given
- Emotional engagement and comfort levels
- Depth of expertise captured vs. potential missed opportunities
- Patterns in communication that enhance or hinder knowledge sharing
- Practical recommendations for improving the process

Provide your analysis in a structured format with:
- **Overall Assessment** (1-5 stars)
- **Key Insights** (bullet points)
- **Emotional Analysis** (based on detected emotions)
- **Knowledge Gaps** (what wasn't captured)
- **Recommendations** (3-5 actionable items)
- **Next Steps** (immediate actions to take)

Be constructive, insightful, and focused on helping users improve their expertise capture process.`;

// Simple token estimation (rough approximation: 1 token ≈ 4 characters)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Intelligent conversation truncation
function truncateConversation(conversation: any[], maxTokens: number = 100000): string {
  const promptTokens = estimateTokens(DEFAULT_HALO_PROMPT);
  const availableTokens = maxTokens - promptTokens - 2000; // Reserve space for response

  let conversationText = '';
  let currentTokens = 0;
  
  // Start from the end (most recent messages) and work backwards
  const reversedConversation = [...conversation].reverse();
  const includedMessages: any[] = [];

  for (const msg of reversedConversation) {
    const emotionSummary = msg.emotions 
      ? Object.entries(msg.emotions)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([emotion, score]) => `${emotion}: ${((score as number) * 100).toFixed(0)}%`)
          .join(', ')
      : 'No emotions detected';
    
    const messageText = `[${msg.timestamp}] ${msg.role.toUpperCase()}:\n${msg.content}\nEmotions: ${emotionSummary}\n\n`;
    const messageTokens = estimateTokens(messageText);
    
    if (currentTokens + messageTokens > availableTokens) {
      break;
    }
    
    currentTokens += messageTokens;
    includedMessages.unshift(msg); // Add to beginning to maintain chronological order
  }

  // Build the final conversation text
  conversationText = includedMessages
    .map(msg => {
      const emotionSummary = msg.emotions 
        ? Object.entries(msg.emotions)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(0, 3)
            .map(([emotion, score]) => `${emotion}: ${((score as number) * 100).toFixed(0)}%`)
            .join(', ')
        : 'No emotions detected';
      
      return `[${msg.timestamp}] ${msg.role.toUpperCase()}:\n${msg.content}\nEmotions: ${emotionSummary}\n`;
    })
    .join('\n');

  // Add truncation notice if we had to cut messages
  if (includedMessages.length < conversation.length) {
    const truncatedCount = conversation.length - includedMessages.length;
    conversationText = `[TRUNCATED: ${truncatedCount} earlier messages omitted due to length]\n\n${conversationText}`;
  }

  console.log(`Conversation truncated: ${conversation.length} → ${includedMessages.length} messages, ~${currentTokens} tokens`);
  
  return conversationText;
}

export async function POST(req: NextRequest) {
  try {
    const body: HALOReviewRequest = await req.json();
    const { conversation, settings } = body;

    if (!settings.enabled) {
      return NextResponse.json({
        error: 'HALO review is disabled',
        message: 'Enable HALO review in settings to use this feature'
      }, { status: 400 });
    }

    if (!conversation || conversation.length === 0) {
      return NextResponse.json({
        error: 'No conversation provided',
        message: 'Please provide a conversation to review'
      }, { status: 400 });
    }

    // Intelligently truncate conversation to fit within token limits
    const conversationText = truncateConversation(conversation);

    const analysisPrompt = `${settings.customPrompt || DEFAULT_HALO_PROMPT}

Please analyze the following expertise capture conversation:

${conversationText}

Provide a comprehensive HALO review focusing on expertise capture quality, emotional insights, and actionable recommendations.`;

    // Estimate total tokens before sending
    const totalEstimatedTokens = estimateTokens(analysisPrompt);
    console.log(`Estimated tokens for HALO analysis: ${totalEstimatedTokens}`);

    const { text } = await generateText({
      model: openai('gpt-4o-mini'), // Use mini for better token efficiency
      prompt: analysisPrompt,
      maxTokens: 1500,
    });

    // Structure the response
    const haloReview = {
      timestamp: new Date().toISOString(),
      conversationLength: conversation.length,
      analysis: text,
      settings: {
        enabled: settings.enabled,
        customPrompt: !!settings.customPrompt
      },
      metadata: {
        totalMessages: conversation.length,
        userMessages: conversation.filter(msg => msg.role === 'user').length,
        assistantMessages: conversation.filter(msg => msg.role === 'assistant').length,
        emotionsDetected: conversation.some(msg => msg.emotions && Object.keys(msg.emotions).length > 0),
        estimatedTokens: totalEstimatedTokens,
        truncated: conversationText.includes('[TRUNCATED:')
      }
    };

    console.log('HALO Review completed:', {
      conversationLength: conversation.length,
      estimatedTokens: totalEstimatedTokens,
      truncated: haloReview.metadata.truncated,
      timestamp: haloReview.timestamp
    });

    return NextResponse.json({
      success: true,
      review: haloReview,
      message: 'HALO analysis completed successfully'
    });

  } catch (error) {
    console.error('Error in HALO review:', error);
    return NextResponse.json({
      error: 'Failed to complete HALO review',
      message: 'An error occurred while analyzing the conversation'
    }, { status: 500 });
  }
} 