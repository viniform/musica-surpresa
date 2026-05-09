import React, { useMemo, useState } from "react";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.webp";
import { PLANS, formatPlanPrice } from "../constants/plans";

const defaultPlans = PLANS;
const formatCurrency = formatPlanPrice;

function readStoredOrder() {
  try {
    const draft = sessionStorage.getItem("musicOrderDraft");
    const lead = sessionStorage.getItem("musicOrderLead");
    return {
      ...(lead ? JSON.parse(lead) : {}),
      ...(draft ? JSON.parse(draft) : {}),
    };
  } catch (error) {
    console.error("Erro ao ler dados do pedido");
    return {};
  }
}

const GOOGLE_SHEETS_WEBHOOK_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || "";

async function syncToSheet(payload, options = {}) {
  const body = JSON.stringify(payload);

  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return;
  }

  try {
    if (options.preferBeacon !== false && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const sent = navigator.sendBeacon(GOOGLE_SHEETS_WEBHOOK_URL, blob);
      if (sent) {
        return;
      }
    }

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body,
    });
  } catch (error) {
    console.error("Erro ao sincronizar upsell");
  }
}

const termosConteudo = [
  { titulo: "1. Sobre o serviço", texto: "A Música Surpresa oferece a criação de músicas personalizadas a partir de histórias fornecidas pelo cliente, combinando tecnologia de inteligência artificial com direção criativa e refinamento humano." },
  { titulo: "2. Como funciona", texto: "O cliente fornece informações como nomes, contexto e história. A partir disso, desenvolvemos uma composição personalizada, com ajustes internos para garantir qualidade, conforme o plano contratado." },
  { titulo: "3. Natureza do resultado", texto: "Por se tratar de um processo criativo, não garantimos preferência subjetiva. O resultado final depende diretamente das informações fornecidas e pode apresentar variações de estilo e interpretação." },
  { titulo: "4. Uso de tecnologia", texto: "Utilizamos inteligência artificial como parte do processo criativo, aliada à curadoria humana. Ainda assim, podem ocorrer pequenas variações como pronúncia, interpretação ou nuances musicais." },
  { titulo: "5. Revisões", texto: "Revisões podem estar incluídas conforme o plano contratado. Alterações estruturais podem exigir nova produção e não garantimos revisões ilimitadas." },
  { titulo: "6. Prazos", texto: "Os prazos variam conforme o plano, podendo ser impactados por demanda, ajustes ou informações incompletas." },
  { titulo: "7. Pagamento", texto: "O pagamento é realizado antecipadamente. Após confirmação, o pedido entra em produção." },
  { titulo: "8. Cancelamento e reembolso", texto: "Por se tratar de produto personalizado, não oferecemos reembolso após início da produção, exceto em casos de erro técnico comprovado." },
  { titulo: "9. Direitos de uso", texto: "O cliente pode compartilhar e utilizar a música para fins pessoais. Não garantimos elegibilidade para monetização em plataformas digitais." },
  { titulo: "10. Responsabilidade", texto: "O cliente é responsável pelas informações fornecidas e por garantir que não violam direitos de terceiros." },
  { titulo: "11. Limitação de responsabilidade", texto: "Não nos responsabilizamos por expectativas subjetivas, uso indevido do material ou restrições em plataformas externas." },
  { titulo: "12. Contato", texto: "Para suporte: contato@musicasurpresa.com.br" },
];

export default function UpsellPage({
  customer = {
    recipient: "Pessoa especial",
    occasion: "Ocasião especial",
    style: "Personalizado",
  },
  plans = defaultPlans,
  initialPlanId = "musica-surpresa",
  onContinueToPayment,
}) {
  const storedOrder = useMemo(() => readStoredOrder(), []);
  const effectiveCustomer = {
    ...customer,
    ...storedOrder,
  };

  const initialSelectedPlanId = useMemo(() => {
    if (!storedOrder.plan) return initialPlanId;
    const matchedPlan = plans.find((plan) => storedOrder.plan.includes(plan.name));
    return matchedPlan?.id || initialPlanId;
  }, [storedOrder.plan, initialPlanId, plans]);

  const [selectedPlanId] = useState(initialSelectedPlanId);
  const [termosAbertos, setTermosAbertos] = useState(false);

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => plan.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  React.useEffect(() => {
    const stored = readStoredOrder();
    const initialPlan = plans.find((plan) => {
      if (!stored.plan) return plan.id === initialPlanId;
      return stored.plan.includes(plan.name);
    }) || plans.find((plan) => plan.id === initialPlanId) || plans[0];

    if (!stored.orderId) return;

    const viewedKey = `upsellViewed:${stored.orderId}`;
    if (sessionStorage.getItem(viewedKey) === "true") return;
    sessionStorage.setItem(viewedKey, "true");

    syncToSheet({
      orderId: stored.orderId,
      customerId: stored.customerId,
      stage: "upsell_visualizado",
      planId: initialPlan.id,
      planTitle: initialPlan.name,
      amount: initialPlan.price,
      customerName: stored.name || stored.customerName || "",
      email: stored.email || "",
      whatsapp: stored.whatsapp || "",
      recipient: stored.recipient || "",
      relationship: stored.relationship || "",
      occasion: stored.occasion || "",
      description: stored.description || "",
      message: stored.message || "",
      moments: stored.moments || "",
      specialPhrase: stored.specialPhrase || "",
      style: stored.style || "",
      voiceType: stored.voiceType || "",
      observations: stored.observations || "",
      externalReference: stored.orderId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = async () => {
    if (effectiveCustomer.orderId) {
      const checkoutPayload = {
        orderId: effectiveCustomer.orderId,
        customerId: effectiveCustomer.customerId,
        stage: "checkout_iniciado",
        planId: selectedPlan.id,
        planTitle: selectedPlan.name,
        amount: selectedPlan.price,
        customerName: effectiveCustomer.name || effectiveCustomer.customerName || "",
        email: effectiveCustomer.email || "",
        whatsapp: effectiveCustomer.whatsapp || "",
        recipient: effectiveCustomer.recipient || "",
        relationship: effectiveCustomer.relationship || "",
        occasion: effectiveCustomer.occasion || "",
        description: effectiveCustomer.description || "",
        message: effectiveCustomer.message || "",
        moments: effectiveCustomer.moments || "",
        specialPhrase: effectiveCustomer.specialPhrase || "",
        style: effectiveCustomer.style || "",
        voiceType: effectiveCustomer.voiceType || "",
        observations: effectiveCustomer.observations || "",
        externalReference: effectiveCustomer.orderId,
      };

      sessionStorage.setItem("musicOrderDraft", JSON.stringify({
        orderId: effectiveCustomer.orderId || "",
        customerId: effectiveCustomer.customerId || "",
        plan: selectedPlan.name,
        planId: selectedPlan.id,
        planTitle: selectedPlan.name,
        amount: selectedPlan.price,
        recipient: effectiveCustomer.recipient || "",
        occasion: effectiveCustomer.occasion || "",
        style: effectiveCustomer.style || "",
      }));
      await syncToSheet(checkoutPayload, { preferBeacon: false });
    }

    if (typeof onContinueToPayment === "function") {
      onContinueToPayment(selectedPlan);
      return;
    }

    alert(
      `Continuar para pagamento: ${selectedPlan.name} - ${formatCurrency(selectedPlan.price)}`
    );
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F2EEE9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <a href="/" aria-label="Voltar para a página inicial" className="flex items-center">
            <img
              src={logoMusicaSurpresa}
              alt="Música Surpresa"
              className="h-10 w-auto lg:h-12"
            />
          </a>
          <div className="hidden rounded-full bg-white/70 px-6 py-2 text-sm font-bold text-[#0B2454] shadow-sm sm:block">
            Pedido quase finalizado 🎵
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-[#FFF8F3] px-4 py-4 text-[#0B2454] lg:px-8">
        <div className="mx-auto max-w-6xl">

          <section className="mt-4 rounded-[28px] border border-[#E8DDD2] bg-[#FFF8F3] px-5 py-5 shadow-sm md:px-6 lg:px-7 lg:py-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
              Resumo do seu pedido
            </p>
            <div className="mt-5 grid gap-7 md:grid-cols-3 md:gap-10">
              <div>
                <p className="text-sm font-bold text-[#6B7280] lg:text-base">Presente para</p>
                <p className="mt-1 text-base font-black text-[#0B2454] lg:text-lg">
                  {effectiveCustomer.recipient || "Pessoa especial"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#6B7280] lg:text-base">Ocasião</p>
                <p className="mt-1 text-base font-black text-[#0B2454] lg:text-lg">
                  {effectiveCustomer.occasion || "Ocasião especial"}
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#6B7280] lg:text-base">Estilo desejado</p>
                <p className="mt-1 text-base font-black text-[#0B2454] lg:text-lg">
                  {effectiveCustomer.style || "Personalizado"}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#5B6474] lg:text-base">
              Suas informações foram recebidas 👍 Temos tudo o que precisamos para preparar a sua música! 💝
              <br />
              Seguindo para o pagamento, você declara estar de acordo com os nossos{" "}
              <button
                type="button"
                onClick={() => setTermosAbertos((v) => !v)}
                className="text-[#B45D5D] underline underline-offset-2 hover:opacity-80 transition"
              >
                termos de serviço
              </button>
              .
            </p>
          </section>

          <section className="mt-6 rounded-[28px] border border-[#E8DDD2] bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-xl font-black tracking-[-0.02em] lg:text-2xl">
                  {selectedPlan.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                  Esta será a opção considerada para o pagamento final.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[#21314D]">
                  {selectedPlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-[2px] text-[#B45D5D]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:text-right">
                <p className="text-sm font-semibold text-[#6B7280]">Total</p>
                {selectedPlan.hasDiscount && selectedPlan.priceFrom && (
                  <p className="mt-1 text-sm font-semibold text-[#9CA3AF] line-through">
                    {formatCurrency(selectedPlan.priceFrom)}
                  </p>
                )}
                <p className="mt-1 text-4xl font-black tracking-[-0.03em]">
                  {formatCurrency(selectedPlan.price)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleContinue}
              className="mt-4 inline-flex min-h-[58px] w-full items-center justify-center rounded-[18px] bg-[#0B2454] px-6 text-base font-black text-white shadow-[0_10px_30px_rgba(11,36,84,0.18)] transition-all duration-300 hover:scale-[1.01] hover:opacity-95 lg:w-auto lg:min-w-[320px]"
            >
              SEGUIR PARA PAGAMENTO
            </button>
          </section>

          {termosAbertos && (
            <section className="mt-4 rounded-[20px] border border-[#E8DDD2] bg-white px-5 py-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
                  Termos de Serviço — Última atualização: 29 de abril de 2026
                </p>
                <button
                  type="button"
                  onClick={() => setTermosAbertos(false)}
                  className="text-xs text-[#6B7280] hover:text-[#0B2454] transition font-semibold"
                >
                  Fechar ✕
                </button>
              </div>
              <div className="space-y-3">
                {termosConteudo.map((item) => (
                  <div key={item.titulo}>
                    <p className="text-[11px] font-bold text-[#0B2454]">{item.titulo}</p>
                    <p className="text-[11px] leading-5 text-[#5B6474]">{item.texto}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </>
  );
}
