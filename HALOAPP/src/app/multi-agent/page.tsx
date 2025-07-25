import { getHumeAccessToken } from '@/utils/getHumeAccessToken';
import MultiAgentPageClient from './multi-agent-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function MultiAgentPage() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-padding section-padding">
          <div className="max-w-2xl mx-auto">
            <Card className="card-modern shadow-lg hover-lift transition-modern">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  <span className="text-gradient-primary">Hume AI Not Configured</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    To use voice features, you need to configure Hume AI credentials.
                  </p>
                  
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

                  <div className="flex gap-4 justify-center">
                    <Link href="/multi-agent/setup">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Agents Setup
                      </Button>
                    </Link>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="flex items-center gap-2"
                    >
                      Reload Page
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return <MultiAgentPageClient accessToken={accessToken} />;
} 