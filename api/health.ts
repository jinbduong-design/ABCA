export default function handler(_req: any, res: any) {
  const hasApiKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );

  res.status(200).json({
    status: 'ok',
    runtime: 'vercel-function',
    hasApiKey,
    timestamp: new Date().toISOString(),
  });
}
