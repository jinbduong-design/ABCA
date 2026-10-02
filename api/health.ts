import { getVercelOidcToken } from '@vercel/oidc';

export default async function handler(_req: any, res: any) {
  const hasDirectGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  const hasGatewayKey = Boolean(process.env.AI_GATEWAY_API_KEY);

  let hasOidcToken = false;
  let oidcError = '';

  try {
    const token = await getVercelOidcToken();
    hasOidcToken = Boolean(token || process.env.VERCEL_OIDC_TOKEN);
  } catch (error: any) {
    hasOidcToken = Boolean(process.env.VERCEL_OIDC_TOKEN);
    oidcError = String(error?.message || '').slice(0, 180);
  }

  res.status(200).json({
    status: 'ok',
    runtime: 'vercel-function',
    vercelRuntime: process.env.VERCEL === '1',
    hasDirectGeminiKey,
    hasGatewayKey,
    hasOidcToken,
    aiReady: hasDirectGeminiKey || hasGatewayKey || hasOidcToken,
    aiStrategy: hasDirectGeminiKey
      ? 'direct-gemini-then-gateway'
      : hasGatewayKey
      ? 'gateway-api-key'
      : hasOidcToken
      ? 'gateway-oidc'
      : 'missing-auth',
    oidcError: oidcError || undefined,
    timestamp: new Date().toISOString(),
  });
}
