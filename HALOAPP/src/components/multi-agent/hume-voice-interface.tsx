"use client";

import { useState, useEffect, useRef } from 'react';
import { useVoice, VoiceReadyState } from '@humeai/voice-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send,
  Brain,
  MessageSquare,
  Users,
  Play,
  Zap,
  Phone,
  PhoneOff,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HumeVoiceInterfaceProps {
  accessToken: string;
  activeAgent: string;
  onMessageReceived: (message: string) => void;
  onAgentResponse: (response: string) => void;
}

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent: string;
}

export default function HumeVoiceInterface({ 
  accessToken, 
  activeAgent, 
  onMessageReceived, 
  onAgentResponse 
}: HumeVoiceInterfaceProps) {
  const { connect, disconnect, readyState, messages } = useVoice();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<VoiceMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const agentIcons = {
    orchestrator: Brain,
    narrative: MessageSquare,
    questionnaire: Users,
    simulation: Play,
    protocol: Zap
  };

  const agentNames = {
    orchestrator: 'Orchestrator',
    narrative: 'Narrative Agent',
    questionnaire: 'Questionnaire Agent',
    simulation: 'Simulation Agent',
    protocol: 'Protocol Agent'
  };

  const ActiveAgentIcon = agentIcons[activeAgent as keyof typeof agentIcons] || Brain;

  // Handle connection state changes
  useEffect(() => {
    if (readyState === VoiceReadyState.OPEN) {
      setIsConnecting(false);
      setConnectionError(null);
    } else if (readyState === VoiceReadyState.CLOSED) {
      setIsConnecting(false);
    }
  }, [readyState]);

  // Process Hume AI messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.type === 'user_message' || lastMessage.type === 'assistant_message') {
        const voiceMessage: VoiceMessage = {
          id: Date.now().toString(),
          role: lastMessage.type === 'user_message' ? 'user' : 'assistant',
          content: lastMessage.message.content,
          timestamp: new Date(),
          agent: activeAgent
        };

        setLocalMessages(prev => [...prev, voiceMessage]);

        if (lastMessage.type === 'user_message') {
          onMessageReceived(lastMessage.message.content);
        } else {
          onAgentResponse(lastMessage.message.content);
        }
      }
    }
  }, [messages, activeAgent, onMessageReceived, onAgentResponse]);

  // Handle voice connection
  const handleConnect = async () => {
    if (readyState === VoiceReadyState.OPEN) {
      disconnect();
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      await connect({
        auth: { type: "accessToken", value: accessToken }
      });
    } catch (error) {
      console.error('Failed to connect to Hume AI:', error);
      setConnectionError('Failed to connect to voice service');
      setIsConnecting(false);
    }
  };

  // Handle text input submission
  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textInput,
      timestamp: new Date(),
      agent: activeAgent
    };

    setLocalMessages(prev => [...prev, userMessage]);
    onMessageReceived(textInput);
    setTextInput('');
  };

  // Get connection status
  const getConnectionStatus = () => {
    switch (readyState) {
      case VoiceReadyState.CONNECTING:
        return { text: 'Connecting...', color: 'text-yellow-600', icon: Loader2 };
      case VoiceReadyState.OPEN:
        return { text: 'Connected', color: 'text-green-600', icon: CheckCircle };
      case VoiceReadyState.CLOSED:
        return { text: 'Disconnected', color: 'text-red-600', icon: AlertCircle };
      default:
        return { text: 'Ready', color: 'text-gray-600', icon: Phone };
    }
  };

  const connectionStatus = getConnectionStatus();
  const StatusIcon = connectionStatus.icon;

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-2", connectionStatus.color)}>
            <StatusIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{connectionStatus.text}</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            <ActiveAgentIcon className="h-3 w-3 mr-1" />
            {agentNames[activeAgent as keyof typeof agentNames]}
          </Badge>
        </div>

        <Button
          variant={readyState === VoiceReadyState.OPEN ? "destructive" : "default"}
          size="sm"
          onClick={handleConnect}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : readyState === VoiceReadyState.OPEN ? (
            <PhoneOff className="h-4 w-4" />
          ) : (
            <Phone className="h-4 w-4" />
          )}
          {isConnecting ? 'Connecting...' : readyState === VoiceReadyState.OPEN ? 'Disconnect' : 'Connect Voice'}
        </Button>
      </div>

      {/* Error Display */}
      {connectionError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">{connectionError}</span>
        </div>
      )}

      {/* Voice Controls */}
      {readyState === VoiceReadyState.OPEN && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Voice Active</span>
          </div>
          
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <span className="text-xs text-blue-600">Speak to interact with {agentNames[activeAgent as keyof typeof agentNames]}</span>
        </div>
      )}

      {/* Text Input Fallback */}
      <div className="space-y-2">
        <Textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder={`Type a message to ${agentNames[activeAgent as keyof typeof agentNames]}...`}
          className="min-h-[80px] resize-none"
          disabled={isProcessing}
        />
        <div className="flex justify-between items-center">
          <Button
            onClick={handleTextSubmit}
            disabled={!textInput.trim() || isProcessing}
            size="sm"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send Message
          </Button>
          <span className="text-xs text-muted-foreground">
            {textInput.length} characters
          </span>
        </div>
      </div>

      {/* Messages Display */}
      <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50">
        {localMessages.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            <Mic className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Start a conversation with {agentNames[activeAgent as keyof typeof agentNames]}</p>
            <p className="text-xs">Use voice or text input</p>
          </div>
        ) : (
          localMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 text-sm",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 flex-shrink-0">
                  <ActiveAgentIcon className="h-3 w-3 text-blue-600" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-3 py-2",
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border'
                )}
              >
                <p className="text-xs">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 flex-shrink-0">
                  <Mic className="h-3 w-3 text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Voice Commands:</strong></p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>"Tell me about your experience with..."</li>
          <li>"Walk me through how you..."</li>
          <li>"What decisions do you make when..."</li>
          <li>"Describe a challenging situation..."</li>
        </ul>
      </div>
    </div>
  );
} 