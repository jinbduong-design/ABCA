export default async function handler(req: any, res: any) {
  const hasDirectGeminiKey = Boolean(
    process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  const hasGatewayKey = Boolean(process.env.AI_GATEWAY_API_KEY);

  const headerTokenRaw =
    req?.headers?.['x-vercel-oidc-token'] ||
    req?.headers?.['X-Vercel-Oidc-Token'];
  const headerToken = Array.isArray(headerTokenRaw)
    ? headerTokenRaw[0]
    : headerTokenRaw;

  const hasOidcHeader = Boolean(headerToken);
  const hasOidcEnv = Boolean(process.env.VERCEL_OIDC_TOKEN);

  res.status(200).json({
    status: 'ok',
    runtime: 'vercel-function',
    vercelRuntime: process.env.VERCEL === '1',
    hasDirectGeminiKey,
    hasGatewayKey,
    hasOidcHeader,
    hasOidcEnv,
    aiReady:
      hasDirectGeminiKey ||
      hasGatewayKey ||
      hasOidcHeader ||
      hasOidcEnv,
    aiStrategy: hasDirectGeminiKey
      ? 'direct-gemini-then-gateway'
      : hasGatewayKey
      ? 'gateway-api-key'
      : hasOidcHeader
      ? 'gateway-oidc-header'
      : hasOidcEnv
      ? 'gateway-oidc-env'
      : 'missing-auth',
    timestamp: new Date().toISOString(),
  });
}
