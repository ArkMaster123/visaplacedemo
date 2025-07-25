"use client";

import { useState, useEffect } from 'react';
import { VoiceProvider, useVoice, VoiceReadyState } from '@humeai/voice-react';
import { fetchAccessToken } from 'hume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Settings, Mic, MicOff, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HumeWidgetProps {
  activeAgent: string;
  onMessageReceived: (message: string) => void;
  onAgentResponse: (response: string) => void;
}

// Inner component that uses the voice hook
function VoiceInterface({ 
  activeAgent, 
  onMessageReceived, 
  onAgentResponse 
}: HumeWidgetProps) {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const agentNames = {
    orchestrator: 'Orchestrator',
    narrative: 'Narrative Agent',
    questionnaire: 'Questionnaire Agent',
    simulation: 'Simulation Agent',
    protocol: 'Protocol Agent'
  };

  const agentPrompts = {
    orchestrator: `You are the Orchestrator Agent, a sophisticated AI coordinator that manages and coordinates multiple specialized agents for expertise capture. Your role is to understand user requests and direct them to the appropriate specialized agent. Be helpful, engaging, and guide users through the knowledge elicitation process.

IMPORTANT: When users share their expertise, use the capture_expertise tool to process their input. You can call this tool with different capture_type values:
- "narrative" for storytelling and experiences
- "questionnaire" for targeted questioning
- "simulation" for task walkthroughs
- "protocol" for cognitive analysis
- "orchestrator" for general coordination

Pay attention to the user's emotional state when they speak. If they show excitement, joy, or enthusiasm about certain topics, explore those areas more deeply. If they show confusion or uncertainty, provide more guidance and clarification. Use emotional cues to better understand their expertise and passion areas.

Always use the tool to capture and process user expertise, then provide helpful guidance based on the results.`,
    narrative: `You are the Narrative Agent, specialized in Method 1: Narrative Storytelling Elicitation. Your role is to elicit detailed stories from users about their experiences, challenges, and tacit insights in their domain. Ask open-ended questions that encourage storytelling and help users share their experiences naturally.

Pay attention to the user's emotional state when they share stories. If they show strong emotions (joy, excitement, frustration, etc.) about certain experiences, explore those stories more deeply. Emotional responses often indicate areas of deep expertise or significant learning moments.

IMPORTANT: When users share stories or experiences, use the capture_expertise tool with capture_type "narrative" to process their input and extract structured knowledge.`,
    questionnaire: `You are the Questionnaire Agent, specialized in Method 2: Targeted Questioning and Probing. Your role is to ask specific, targeted questions that probe deeper into the user's expertise and knowledge. Focus on extracting explicit knowledge, rules, preferences, and decision-making processes.

Pay attention to the user's emotional responses to your questions. If they show confidence and enthusiasm when answering certain questions, those areas likely represent their core expertise. If they show uncertainty or hesitation, those areas might need more exploration or clarification.

IMPORTANT: When users respond to your questions, use the capture_expertise tool with capture_type "questionnaire" to process their input and extract structured knowledge.`,
    simulation: `You are the Simulation Agent, specialized in Method 3: Observational Simulation and Shadowing. Your role is to guide users through real-time task walkthroughs and process mapping. Help them demonstrate their workflows, decision-making processes, and tacit knowledge through verbal descriptions and step-by-step guidance.

Pay attention to the user's emotional state during simulations. If they show confidence and flow when describing certain processes, those are likely their areas of expertise. If they show frustration or confusion, those areas might need more detailed exploration.

IMPORTANT: When users walk through tasks or processes, use the capture_expertise tool with capture_type "simulation" to process their input and extract structured knowledge.`,
    protocol: `You are the Protocol Agent, specialized in Method 4: Protocol Analysis and Think-Aloud Refinement. Your role is to facilitate think-aloud protocols where users verbalize their thought processes while revisiting or simulating tasks. Focus on uncovering cognitive strategies, heuristics, and decision-making frameworks.

Pay attention to the user's emotional state during think-aloud sessions. Emotional responses can reveal the cognitive load, confidence levels, and areas of expertise. Use emotional cues to guide your questioning and exploration.

IMPORTANT: When users share their thought processes, use the capture_expertise tool with capture_type "protocol" to process their input and extract structured knowledge.`
  };

  // Fetch access token
  const handleConnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await fetchAccessToken({
        apiKey: process.env.NEXT_PUBLIC_HUME_API_KEY!,
        secretKey: process.env.NEXT_PUBLIC_HUME_SECRET_KEY!,
      });
      
      setAccessToken(token);
      
      // Connect to voice service
      await connect({
        auth: { type: "accessToken", value: token },
        systemPrompt: agentPrompts[activeAgent as keyof typeof agentPrompts]
      });
    } catch (err) {
      console.error('Failed to connect to Hume AI:', err);
      setError('Failed to connect to Hume AI. Please check your API credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect();
    setAccessToken(null);
    setError(null);
  };

  // Monitor messages for callbacks
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === "user_message") {
        onMessageReceived(lastMessage.message.content);
      } else if (lastMessage.type === "assistant_message") {
        onAgentResponse(lastMessage.message.content);
      }
    }
  }, [messages, onMessageReceived, onAgentResponse]);

  return (
    <Card className="card-modern shadow-lg hover-lift transition-modern">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gradient-primary">
          <MessageSquare className="h-5 w-5" />
          Voice Interface
        </CardTitle>
      </CardHeader>
      <CardContent>
        {readyState === VoiceReadyState.OPEN ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {agentNames[activeAgent as keyof typeof agentNames]}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex items-center gap-2"
              >
                <MicOff className="h-4 w-4" />
                Disconnect
              </Button>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Voice Session Active</span>
              </div>
              <p className="text-xs text-green-600">
                You can now speak naturally with {agentNames[activeAgent as keyof typeof agentNames]}. The microphone is active and ready to capture your voice.
              </p>
            </div>

            {/* Messages Display */}
            <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="font-medium mb-3 text-sm">Conversation:</h4>
              <div className="space-y-2">
                {messages.map((msg, index) => {
                  if (msg.type === "user_message" || msg.type === "assistant_message") {
                    return (
                      <div key={index} className="text-xs">
                        <div className="font-medium text-gray-700">
                          {msg.message.role === 'user' ? 'You' : agentNames[activeAgent as keyof typeof agentNames]}:
                        </div>
                        <div className="text-gray-600 mt-1">
                          {msg.message.content}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-8">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <Mic className="h-3 w-3 mr-1" />
                Ready to Connect
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Start Voice Session</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect to Hume AI to enable voice interactions with {agentNames[activeAgent as keyof typeof agentNames]}.
              </p>
            </div>

            <Button
              onClick={handleConnect}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {isLoading ? 'Connecting...' : 'Start Voice Session'}
            </Button>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground space-y-1 mt-4">
          <p><strong>Voice Commands:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>"Tell me about your experience with..."</li>
            <li>"Walk me through how you..."</li>
            <li>"What decisions do you make when..."</li>
            <li>"Describe a challenging situation..."</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Main component with VoiceProvider
export default function HumeWidget(props: HumeWidgetProps) {
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if Hume AI is configured
  useEffect(() => {
    const hasHumeConfig = process.env.NEXT_PUBLIC_HUME_API_KEY && process.env.NEXT_PUBLIC_HUME_SECRET_KEY;
    setIsConfigured(!!hasHumeConfig);
  }, []);

  if (!isConfigured) {
    return (
      <Card className="card-modern shadow-lg hover-lift transition-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient-primary">
            <Settings className="h-5 w-5" />
            Hume AI Voice Widget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4 py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Hume AI Not Configured</h3>
              <p className="text-sm text-muted-foreground mb-4">
                To use voice features, you need to configure Hume AI credentials.
              </p>
            </div>
            
            <div className="bg-muted border rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Get your Hume AI API key from <a href="https://platform.hume.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.hume.ai</a></li>
                <li>Add to your <code className="bg-background px-1 rounded">.env.local</code> file:</li>
              </ol>
              <div className="mt-2 p-3 bg-background rounded text-xs font-mono border">
                NEXT_PUBLIC_HUME_API_KEY=your_api_key_here<br/>
                NEXT_PUBLIC_HUME_SECRET_KEY=your_secret_key_here
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <VoiceProvider>
      <VoiceInterface {...props} />
    </VoiceProvider>
  );
} 