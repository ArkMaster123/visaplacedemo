"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInterfaceProps {
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
  activeAgent: string;
}

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: string;
}

export default function VoiceInterface({ 
  isListening, 
  onListeningChange, 
  activeAgent 
}: VoiceInterfaceProps) {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  // Simulate voice recognition (in real implementation, this would use Hume AI)
  useEffect(() => {
    if (isListening) {
      // Simulate audio level changes
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  // Handle voice input
  const handleVoiceInput = async () => {
    if (!isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          await processAudioInput(audioBlob);
        };

        mediaRecorderRef.current.start();
        onListeningChange(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        // Fallback to text input
        setTranscript('Voice input not available. Please use text input.');
      }
    } else {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      onListeningChange(false);
    }
  };

  // Process audio input (simulated)
  const processAudioInput = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate transcript (in real implementation, this would come from Hume AI)
    const simulatedTranscript = `Hello, I'd like to share my experience with ${agentNames[activeAgent as keyof typeof agentNames]}.`;
    
    setTranscript(simulatedTranscript);
    setIsProcessing(false);
    
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: simulatedTranscript,
      timestamp: new Date(),
      agent: activeAgent
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Thank you for sharing that with me. I'm the ${agentNames[activeAgent as keyof typeof agentNames]}. Let me help you explore this further.`,
        timestamp: new Date(),
        agent: activeAgent
      };
      
      setMessages(prev => [...prev, agentResponse]);
      speakResponse(agentResponse.content);
    }, 1000);
  };

  // Text-to-speech (simulated)
  const speakResponse = (text: string) => {
    setIsSpeaking(true);
    
    // In real implementation, this would use Hume AI's text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      // Fallback
      setTimeout(() => setIsSpeaking(false), 2000);
    }
  };

  // Handle text input
  const handleTextSubmit = () => {
    if (!transcript.trim()) return;
    
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript,
      timestamp: new Date(),
      agent: activeAgent
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTranscript('');
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand. As the ${agentNames[activeAgent as keyof typeof agentNames]}, I'm here to help you explore this topic further.`,
        timestamp: new Date(),
        agent: activeAgent
      };
      
      setMessages(prev => [...prev, agentResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {/* Voice Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={handleVoiceInput}
            disabled={isProcessing}
            className="flex items-center gap-2"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop' : 'Voice Input'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSpeaking(!isSpeaking)}
            className="flex items-center gap-2"
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            {isSpeaking ? 'Stop Speaking' : 'Text-to-Speech'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <ActiveAgentIcon className="h-4 w-4 text-blue-600" />
          <Badge variant="outline" className="text-xs">
            {agentNames[activeAgent as keyof typeof agentNames]}
          </Badge>
        </div>
      </div>

      {/* Audio Level Indicator */}
      {isListening && (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${audioLevel}%` }}
            />
          </div>
          <span className="text-xs text-gray-600">{Math.round(audioLevel)}%</span>
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          Processing audio...
        </div>
      )}

      {/* Text Input */}
      <div className="space-y-2">
        <Textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your message or use voice input..."
          className="min-h-[80px] resize-none"
          disabled={isProcessing}
        />
        <div className="flex justify-between items-center">
          <Button
            onClick={handleTextSubmit}
            disabled={!transcript.trim() || isProcessing}
            size="sm"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
          <span className="text-xs text-gray-500">
            {transcript.length} characters
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {messages.map((message) => (
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
                  : 'bg-gray-100 text-gray-900'
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
        ))}
      </div>

      {/* Audio Element for Hume AI Integration */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
} 