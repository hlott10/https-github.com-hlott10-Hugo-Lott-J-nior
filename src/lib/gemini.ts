export async function generateReviewResponse(
  reviewComment: string,
  rating: number,
  businessName: string,
  tone: string
) {
  try {
    const res = await fetch('/api/ai/generate-review-response', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewComment, rating, businessName, tone })
    });
    
    if (!res.ok) throw new Error('Falha na resposta do servidor');
    
    const data = await res.json();
    return data.text || "Obrigado pelo seu feedback. Estamos sempre trabalhando para oferecer o melhor atendimento.";
  } catch (error) {
    console.error("Error calling AI API:", error);
    return "Obrigado pelo seu feedback. Estamos sempre trabalhando para oferecer o melhor atendimento.";
  }
}
