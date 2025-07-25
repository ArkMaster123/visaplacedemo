"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Brain, 
  TrendingUp, 
  Eye, 
  Download,
  Loader2,
  Star,
  CheckCircle,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface ConversationMessage {
  role: string;
  content: string;
  timestamp: string;
  emotions?: Record<string, number>;
}

interface HALOSettings {
  enabled: boolean;
  customPrompt: string;
  autoReview: boolean;
  showEmotions: boolean;
}

interface HALOReviewResult {
  timestamp: string;
  conversationLength: number;
  analysis: string;
  settings: {
    enabled: boolean;
    customPrompt: boolean;
  };
  metadata: {
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    emotionsDetected: boolean;
  };
}

export default function HALOReview({
  conversation,
  settings,
  onExportConversation
}: {
  conversation: ConversationMessage[];
  settings: HALOSettings;
  onExportConversation?: () => void;
}) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<HALOReviewResult | null>(null);
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);

  const triggerHALOReview = async () => {
    if (!settings.enabled) {
      toast.error("HALO review is disabled. Enable it in settings.");
      return;
    }

    if (conversation.length === 0) {
      toast.error("No conversation to review yet.");
      return;
    }

    setIsReviewing(true);
    setReviewResult(null);

    try {
      const response = await fetch('/api/halo-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation,
          settings
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to complete HALO review');
      }

      setReviewResult(data.review);
      toast.success("HALO analysis completed!");
      
    } catch (error) {
      console.error('HALO review error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to complete HALO review');
    } finally {
      setIsReviewing(false);
    }
  };

  const exportConversation = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      conversation,
      settings,
      metadata: {
        totalMessages: conversation.length,
        userMessages: conversation.filter(msg => msg.role === 'user').length,
        assistantMessages: conversation.filter(msg => msg.role === 'assistant').length,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `halo-conversation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Conversation exported!");
    onExportConversation?.();
  };

  const parseAnalysis = (analysis: string) => {
    // Simple parsing to extract key sections
    const sections = analysis.split('**').filter(Boolean);
    const parsed: Record<string, string> = {};
    
    for (let i = 0; i < sections.length; i += 2) {
      if (sections[i] && sections[i + 1]) {
        const key = sections[i].trim().replace(':', '');
        const value = sections[i + 1].trim();
        parsed[key] = value;
      }
    }
    
    return parsed;
  };

  const renderStars = (text: string) => {
    const match = text.match(/(\d+)(?:\/5|\s+stars?)/i);
    if (match) {
      const rating = parseInt(match[1]);
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              )}
            />
          ))}
          <span className="ml-1 text-sm text-muted-foreground">
            {rating}/5
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* HALO Control Panel */}
      <Card className="card-modern border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-gradient-primary">HALO Review System</span>
            <Badge variant={settings.enabled ? "default" : "secondary"}>
              {settings.enabled ? "Active" : "Disabled"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Conversation Analysis Ready
              </p>
              <p className="text-xs text-muted-foreground">
                {conversation.length} messages • {conversation.filter(msg => msg.emotions).length} with emotions
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportConversation}
                disabled={conversation.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              <Button
                onClick={triggerHALOReview}
                disabled={isReviewing || !settings.enabled || conversation.length === 0}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white flex items-center gap-2"
              >
                {isReviewing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Run HALO Review
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HALO Review Results */}
      <AnimatePresence>
        {reviewResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="card-modern border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  HALO Analysis Complete
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {new Date(reviewResult.timestamp).toLocaleTimeString()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-slate-800">
                      {reviewResult.metadata.totalMessages}
                    </div>
                    <div className="text-xs font-medium text-slate-600">Total Messages</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-blue-800">
                      {reviewResult.metadata.userMessages}
                    </div>
                    <div className="text-xs font-medium text-blue-600">User Messages</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-purple-800">
                      {reviewResult.metadata.assistantMessages}
                    </div>
                    <div className="text-xs font-medium text-purple-600">AI Responses</div>
                  </div>
                  
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-white/20">
                    <div className="text-2xl font-bold text-orange-800">
                      {reviewResult.metadata.emotionsDetected ? '✓' : '✗'}
                    </div>
                    <div className="text-xs font-medium text-orange-600">Emotions</div>
                  </div>
                </div>

                {/* Analysis Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Analysis Summary
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {showFullAnalysis ? 'Hide' : 'Show'} Full Analysis
                    </Button>
                  </div>

                  {showFullAnalysis ? (
                    <div className="bg-white/70 rounded-lg p-4 space-y-3 border border-white/20">
                      <div className="prose prose-sm max-w-none">
                        {reviewResult.analysis.split('\n').map((line, index) => {
                          if (line.includes('**') && line.includes('Assessment')) {
                            const stars = renderStars(line);
                            return (
                              <div key={index} className="flex items-center gap-2 font-semibold text-slate-800">
                                <span>{line.replace(/\*\*/g, '')}</span>
                                {stars}
                              </div>
                            );
                          }
                          return (
                            <p key={index} className={cn(
                              line.startsWith('**') ? 'font-semibold text-slate-800 mt-3' : 'text-slate-700',
                              line.trim() === '' ? 'hidden' : ''
                            )}>
                              {line.replace(/\*\*/g, '')}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/70 rounded-lg p-4 border border-white/20">
                      <p className="text-sm text-slate-700 line-clamp-3">
                        {reviewResult.analysis.split('\n').find(line => 
                          line.length > 50 && !line.includes('**')
                        ) || reviewResult.analysis.substring(0, 200) + '...'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 