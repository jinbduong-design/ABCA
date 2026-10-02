export default function handler(_req: any, res: any) {
  const hasDirectGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );

  res.status(200).json({
    status: 'ok',
    runtime: 'vercel-function',
    vercelRuntime: process.env.VERCEL === '1',
    hasDirectGeminiKey,
    aiStrategy: hasDirectGeminiKey
      ? 'direct-gemini-then-vercel-gateway'
      : 'vercel-ai-gateway-oidc',
    timestamp: new Date().toISOString(),
  });
}
