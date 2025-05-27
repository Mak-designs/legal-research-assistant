export async function generateAILegalResponse(
  query: string,
  primaryDomain: string,
  secondaryDomain: string,
  systemPrompt: string,
  jurisdiction: string
) {
  // Skip calling Gemini, always return fallback
  return {
    recommendation: "Our AI system is currently unavailable. Please refer to the analyses below.",
    primaryAnalysis: generateFallbackAnalysis(primaryDomain, query),
    secondaryAnalysis: generateFallbackAnalysis(secondaryDomain, query),
    error: "ai_disabled"
  };
}
