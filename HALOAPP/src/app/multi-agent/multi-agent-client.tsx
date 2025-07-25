"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, CheckCircle, Brain, Download, Zap } from 'lucide-react';
import HumeVoiceChat from '@/components/multi-agent/hume-voice-chat';
import HALOSettings from '@/components/multi-agent/halo-settings';
import HALOReview from '@/components/multi-agent/halo-review';
import Link from 'next/link';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiAgentPageClientProps {
  accessToken: string;
}

interface HALOSettings {
  enabled: boolean;
  customPrompt: string;
  autoReview: boolean;
  showEmotions: boolean;
}

interface ConversationMessage {
  role: string;
  content: string;
  timestamp: string;
  emotions?: Record<string, number>;
}

export default function MultiAgentPageClient({ accessToken }: MultiAgentPageClientProps) {
  const [activeAgent, setActiveAgent] = useState('orchestrator');
  const [capturedExpertise, setCapturedExpertise] = useState<any[]>([]);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [haloSettings, setHaloSettings] = useState<HALOSettings>({
    enabled: true,
    customPrompt: '',
    autoReview: false,
    showEmotions: true
  });

  const handleMessageReceived = (message: string) => {
    console.log('Message received from Hume:', message);
    
    // Add to conversation history
    const newMessage: ConversationMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    setConversation(prev => [...prev, newMessage]);
  };

  const handleAgentResponse = (response: string) => {
    console.log('Agent response received:', response);
    
    // Check if the response contains tool calling data
    try {
      // Look for tool calling results in the response
      if (response.includes('captured_expertise') || response.includes('tool_result')) {
        // Extract captured expertise data
        const expertiseMatch = response.match(/captured_expertise[:\s]*({.*?})/);
        if (expertiseMatch) {
          const expertiseData = JSON.parse(expertiseMatch[1]);
          setCapturedExpertise(prev => [...prev, expertiseData]);
        }
      }
    } catch (error) {
      console.log('No tool calling data found in response');
    }

    // Add to conversation history
    const newMessage: ConversationMessage = {
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };
    setConversation(prev => [...prev, newMessage]);

    // Auto-trigger HALO review if enabled
    if (haloSettings.enabled && haloSettings.autoReview && conversation.length >= 4) {
      // Trigger auto-review after a short delay
      setTimeout(() => {
        console.log('Auto-triggering HALO review...');
        // This will be handled by the HALOReview component
      }, 2000);
    }
  };

  const handleSettingsChange = (newSettings: HALOSettings) => {
    setHaloSettings(newSettings);
  };

  const handleExportConversation = () => {
    console.log('Conversation exported successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with HALO Controls */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container-padding flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-semibold">Back to Home</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Voice Status */}
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Voice Ready
            </Badge>
            
            {/* Conversation Stats */}
            {conversation.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {conversation.length} messages
              </Badge>
            )}
            
            {/* HALO Review Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  disabled={conversation.length === 0}
                >
                  <Brain className="h-4 w-4" />
                  HALO Review
                  {conversation.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {conversation.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[500px] p-0" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="font-semibold">HALO Review System</span>
                    <Badge variant={haloSettings.enabled ? "default" : "secondary"} className="text-xs">
                      {haloSettings.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  <HALOReview
                    conversation={conversation}
                    settings={haloSettings}
                    onExportConversation={handleExportConversation}
                  />
                </div>
              </PopoverContent>
            </Popover>
            
            {/* HALO Settings */}
            <HALOSettings onSettingsChange={handleSettingsChange} />
            
            {/* View Results */}
            <Link href="/multi-agent/setup">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Setup
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Full Screen Hume AI Interface */}
      <main className="h-[calc(100vh-4rem)]">
        <HumeVoiceChat
          accessToken={accessToken}
          activeAgent={activeAgent}
          onMessageReceived={handleMessageReceived}
          onAgentResponse={handleAgentResponse}
        />
      </main>

      {/* Optional: Expertise Summary (only show if there's captured data) */}
      {capturedExpertise.length > 0 && (
        <div className="fixed bottom-4 right-4 z-40">
          <Card className="w-80 shadow-lg border-green-200 bg-green-50/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Expertise Captured
                  </span>
                </div>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {capturedExpertise.length} items
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 