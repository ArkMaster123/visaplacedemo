import { getAppUrl } from '@/lib/utils';

// Health check endpoint for deployment verification
export async function GET() {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    appUrl: getAppUrl(),
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
      vercelBranch: process.env.VERCEL_GIT_COMMIT_REF,
    }
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 