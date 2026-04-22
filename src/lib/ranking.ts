/**
 * Estrelize Saúde - Ranking Algorithm
 * 
 * Score = (Rating × 0.35) + (VolumeScore × 0.20) + (ResponseRate × 0.30) + (RecencyScore × 0.15)
 */

export interface RankingFactors {
  rating: number;         // 0 to 5 (nota)
  reviewCount: number;    // Absolute number (volume)
  growthRate: number;     // 0 to 1 (crescimento)
  responseRate: number;   // 0 to 1 (resposta)
  recentReviews: number;  // 0 to 1 (recentes - normalized score)
}

/**
 * Estrelize Saúde - SEO Ranking Algorithm
 * 
 * Score:
 * score = (nota * 0.4) + (volume * 0.3) + (resposta * 0.2) + (recencia * 0.1)
 * 
 * Note: volume and recencia are normalized to 0-5 scale for calculation.
 */
export function calculateClinicScore(factors: RankingFactors): number {
  const { rating, reviewCount, responseRate, recentReviews } = factors;

  // Normalize reviewCount to 0-5 scale (assuming 1000 reviews is "max" for normalization)
  const normalizedVolume = Math.min(5, (reviewCount / 1000) * 5);
  
  // responseRate and recentReviews are assumed to be 0-1, so we scale them to 0-5
  const normalizedResponse = responseRate * 5;
  const normalizedRecent = recentReviews * 5;

  const finalScore = 
    (rating * 0.4) + 
    (normalizedVolume * 0.3) + 
    (normalizedResponse * 0.2) + 
    (normalizedRecent * 0.1);

  // Return score on 0-100 scale for UI display (since max possible finalScore is 5)
  return parseFloat(((finalScore / 5) * 100).toFixed(1));
}

export function getScoreClassification(score: number) {
  if (score >= 90) return { label: "Top Ranking", color: "text-accent" };
  if (score >= 75) return { label: "Destaque", color: "text-cta" };
  if (score >= 60) return { label: "Bom", color: "text-blue-400" };
  if (score >= 40) return { label: "Regular", color: "text-orange-400" };
  return { label: "Precisa Melhorar", color: "text-destructive" };
}
