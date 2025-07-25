"use client";

import { useState, useEffect } from 'react';
import { VoiceProvider } from '@humeai/voice-react';
import { fetchAccessToken } from 'hume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, Settings } from 'lucide-react';
import HumeVoiceInterface from './hume-voice-interface';

interface HumeProviderProps {
  activeAgent: string;
  onMessageReceived: (message: string) => void;
  onAgentResponse: (response: string) => void;
}

export default function HumeProvider({ 
  activeAgent, 
  onMessageReceived, 
  onAgentResponse 
}: HumeProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Check if Hume AI is configured
  useEffect(() => {
    const hasHumeConfig = process.env.NEXT_PUBLIC_HUME_API_KEY && process.env.NEXT_PUBLIC_HUME_SECRET_KEY;
    setIsConfigured(!!hasHumeConfig);
  }, []);

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
    } catch (err) {
      console.error('Failed to fetch Hume AI access token:', err);
      setError('Failed to authenticate with Hume AI. Please check your API credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect
  const handleDisconnect = () => {
    setAccessToken(null);
    setError(null);
  };

  if (!isConfigured) {
    return (
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Hume AI Voice Interface
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
            
            <div className="bg-gray-50 border rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Setup Instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Get your Hume AI API key from <a href="https://platform.hume.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">platform.hume.ai</a></li>
                <li>Add to your <code className="bg-gray-200 px-1 rounded">.env.local</code> file:</li>
              </ol>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono">
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
      <Card className="shadow-lg bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Hume AI Voice Interface
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!accessToken ? (
            <div className="text-center space-y-4 py-8">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Connect</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect to Hume AI to enable voice interactions with your agents.
                </p>
              </div>

              <Button
                onClick={handleConnect}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {isLoading ? 'Connecting...' : 'Connect to Hume AI'}
              </Button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Access token: {accessToken.substring(0, 8)}...
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Disconnect
                </Button>
              </div>

              <HumeVoiceInterface
                accessToken={accessToken}
                activeAgent={activeAgent}
                onMessageReceived={onMessageReceived}
                onAgentResponse={onAgentResponse}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </VoiceProvider>
  );
} 