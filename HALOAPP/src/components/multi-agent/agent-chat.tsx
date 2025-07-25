"use client";

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Send, 
  Brain, 
  MessageSquare, 
  Users, 
  Play, 
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCurrentPrompt, type MethodKey } from '@/lib/prompts';

interface AgentChatProps {
  activeAgent: string;
  isVoiceEnabled: boolean;
}

interface AgentConfig {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  methodKey?: MethodKey;
  apiEndpoint: string;
}

export default function AgentChat({ activeAgent, isVoiceEnabled }: AgentChatProps) {
  const [selectedAgent, setSelectedAgent] = useState<string>(activeAgent);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userContext, setUserContext] = useState({
    user_domain: 'Technology',
    user_history: 'Software development experience',
    user_name: 'User'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents: AgentConfig[] = [
    {
      id: 'orchestrator',
      name: 'Orchestrator',
      description: 'Coordinates all agents and manages workflow',
      icon: Brain,
      color: 'bg-blue-500',
      apiEndpoint: '/api/multi-agent/orchestrator'
    },
    {
      id: 'narrative',
      name: 'Narrative Agent',
      description: 'Captures stories and experiences through storytelling',
      icon: MessageSquare,
      color: 'bg-green-500',
      methodKey: '1',
      apiEndpoint: '/api/multi-agent/narrative'
    },
    {
      id: 'questionnaire',
      name: 'Questionnaire Agent',
      description: 'Probes deeper with targeted questions',
      icon: Users,
      color: 'bg-purple-500',
      methodKey: '2',
      apiEndpoint: '/api/multi-agent/questionnaire'
    },
    {
      id: 'simulation',
      name: 'Simulation Agent',
      description: 'Guides real-time task walkthroughs',
      icon: Play,
      color: 'bg-orange-500',
      methodKey: '3',
      apiEndpoint: '/api/multi-agent/simulation'
    },
    {
      id: 'protocol',
      name: 'Protocol Agent',
      description: 'Captures cognitive processes and decision-making',
      icon: Zap,
      color: 'bg-red-500',
      methodKey: '4',
      apiEndpoint: '/api/multi-agent/protocol'
    }
  ];

  const currentAgent = agents.find(agent => agent.id === selectedAgent);

  // Use AI SDK chat hook
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: currentAgent?.apiEndpoint || '/api/chat',
    initialMessages: [
      {
        id: 'system',
        role: 'system',
        content: currentAgent?.methodKey 
          ? getCurrentPrompt(currentAgent.methodKey)
              .replace('{user_domain}', userContext.user_domain)
              .replace('{user_history}', userContext.user_history)
              .replace('{user_name}', userContext.user_name)
              .replace('{chat_history}', '')
          : `You are the ${currentAgent?.name}, an AI agent designed to ${currentAgent?.description.toLowerCase()}.`
      }
    ]
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update agent when activeAgent changes
  useEffect(() => {
    setSelectedAgent(activeAgent);
  }, [activeAgent]);

  // Handle voice input (simulated)
  const handleVoiceInput = async () => {
    if (!isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsListening(true);
        
        // Simulate voice recognition
        setTimeout(() => {
          const simulatedInput = `Hello, I'd like to share my experience with the ${currentAgent?.name}.`;
          handleInputChange({ target: { value: simulatedInput } } as any);
          setIsListening(false);
          stream.getTracks().forEach(track => track.stop());
        }, 3000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      setIsListening(false);
    }
  };

  // Handle text-to-speech
  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  // Reset conversation
  const resetConversation = () => {
    setMessages([
      {
        id: 'system',
        role: 'system',
        content: currentAgent?.methodKey 
          ? getCurrentPrompt(currentAgent.methodKey)
              .replace('{user_domain}', userContext.user_domain)
              .replace('{user_history}', userContext.user_history)
              .replace('{user_name}', userContext.user_name)
              .replace('{chat_history}', '')
          : `You are the ${currentAgent?.name}, an AI agent designed to ${currentAgent?.description.toLowerCase()}.`
      }
    ]);
  };

  const ActiveAgentIcon = currentAgent?.icon || Brain;

  return (
    <div className="flex flex-col h-full">
      {/* Agent Header */}
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", currentAgent?.color)}>
              <ActiveAgentIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{currentAgent?.name}</CardTitle>
              <p className="text-sm text-gray-600">{currentAgent?.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {currentAgent?.methodKey && (
              <Badge variant="outline" className="text-xs">
                Method {currentAgent.methodKey}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={resetConversation}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.filter(msg => msg.role !== 'system').map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className={cn("p-2 rounded-lg", currentAgent?.color)}>
                  <ActiveAgentIcon className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2",
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                {message.role === 'assistant' && isVoiceEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTextToSpeech(message.content)}
                    className="mt-2 p-1 h-auto text-xs"
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Speak
                  </Button>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200">
                  <span className="text-xs font-medium text-gray-600">U</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className={cn("p-2 rounded-lg", currentAgent?.color)}>
                <ActiveAgentIcon className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="space-y-3">
          {/* Voice Controls */}
          {isVoiceEnabled && (
            <div className="flex items-center gap-2">
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="sm"
                onClick={handleVoiceInput}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Listening...' : 'Voice Input'}
              </Button>
              
              {isSpeaking && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Volume2 className="h-4 w-4" />
                  Speaking...
                </div>
              )}
            </div>
          )}

          {/* Text Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={`Chat with ${currentAgent?.name}...`}
              className="flex-1"
              disabled={isLoading || isListening}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim() || isListening}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const quickMessage = `Tell me about your role as the ${currentAgent?.name}`;
                handleInputChange({ target: { value: quickMessage } } as any);
              }}
              disabled={isLoading}
              className="text-xs"
            >
              What do you do?
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const quickMessage = "How can you help me?";
                handleInputChange({ target: { value: quickMessage } } as any);
              }}
              disabled={isLoading}
              className="text-xs"
            >
              How can you help?
            </Button>
            {currentAgent?.methodKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const quickMessage = "Start the expertise capture process";
                  handleInputChange({ target: { value: quickMessage } } as any);
                }}
                disabled={isLoading}
                className="text-xs"
              >
                Start Process
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </div>
  );
} 