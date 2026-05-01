

export default function PaymentStatusPage({
  type = "success",
  paymentCheckMessage = "Consultando o status do pagamento automaticamente...",
  paymentCheckAttempts = 0,
}) {
  const statusConfig = {
    success: {
      eyebrow: "Pagamento aprovado",
      title: "Recebemos seu pagamento",
      message:
        "Seu pedido foi confirmado. Agora vamos iniciar a criação da sua música personalizada com base nas informações enviadas.",
      icon: "✅",
      tone: "text-emerald-600",
    },
    pending: {
      eyebrow: "Pagamento em análise",
      title: "Estamos acompanhando seu pagamento",
      message:
        paymentCheckMessage ||
        "O pagamento ainda está sendo processado. Esta página será atualizada automaticamente quando tivermos uma confirmação.",
      icon: "⏳",
      tone: "text-amber-600",
    },
    error: {
      eyebrow: "Pagamento não confirmado",
      title: "Não conseguimos confirmar o pagamento",
      message:
        "O pagamento não foi confirmado. Você pode tentar novamente ou falar conosco pelo WhatsApp para receber suporte.",
      icon: "⚠️",
      tone: "text-red-600",
    },
  };

  const config = statusConfig[type] || statusConfig.success;

  return (
    <div className="min-h-screen bg-[#F7EFE8] px-4 py-16 text-[#1E1E1E]">
      <div className="mx-auto max-w-2xl rounded-[28px] bg-white p-8 text-center shadow-sm lg:p-12">
        <div className={`text-5xl ${config.tone}`}>{config.icon}</div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#B24F36]">
          {config.eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#0B2454] sm:text-4xl">
          {config.title}
        </h1>

        <p className="mt-5 text-base leading-8 text-[#5B6474]">
          {config.message}
        </p>

        {type === "pending" && (
          <p className="mt-4 text-xs text-[#5B6474]">
            Tentativas de consulta: {paymentCheckAttempts}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/"
            className="rounded-xl bg-[#B24F36] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A93F2B]"
          >
            Voltar para o site
          </a>

          <a
            href="https://wa.me/5511940787078"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[#B24F36] px-6 py-3 text-sm font-bold text-[#B24F36] transition hover:bg-[#FFF8F3]"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}