import { toast } from "sonner";

export async function createCheckoutSession({
  planId,
  cycle,
  userId,
  vertical,
  email
}: {
  planId: string;
  cycle: string;
  userId: string;
  vertical: string;
  email?: string;
}) {
  console.log("📍 ENTRANDO NA FUNÇÃO createCheckoutSession EM stripe.ts");
  try {
    console.log("🍞 Verificando toast disponível:", typeof toast !== 'undefined');
    console.log("🛠️ Iniciando createCheckoutSession para:", planId, cycle);
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${baseUrl}/api/checkout/create-session`;
    console.log("🔗 URL da requisição:", url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        cycle,
        userId,
        vertical,
        email
      })
    });
    
    console.log("📡 Resposta do servidor status:", response.status);

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return { success: true };
    } else {
      throw new Error(data.error || "Erro ao criar sessão de checkout");
    }
  } catch (err: any) {
    console.error("Erro no checkout:", err);
    toast.error(err.message || "Erro ao iniciar pagamento.");
    return { success: false, error: err.message };
  }
}
