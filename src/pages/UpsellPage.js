import React, { useMemo, useState } from "react";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.png";

const defaultPlans = [
  {
    id: "musica-surpresa",
    name: "Música Surpresa - Áudio",
    price: 99,
    badge: "Escolha Inicial",
    description: "A escolha essencial: música completa personalizada, pronta para emocionar.",
    features: [
      "Letra personalizada",
      "Melodia exclusiva",
      "Arranjo personalizado",
      "Arquivo em áudio MP3 para ouvir e compartilhar",
    ],
    helper: "Ideal para quem quer uma surpresa musical, direta e emocionante.",
  },
  {
    id: "video-letra",
    name: "Música + Video com a Letra",
    price: 149,
    badge: "Melhor custo-benefício",
    description:
      "Além da música, você recebe um vídeo com a letra, pronto para emocionar e compartilhar.",
    features: [
      "Tudo da Música Surpresa",
      "Vídeo com 1 foto",
      "Letra da música no vídeo",
      "Pronto para compartilhar",
    ],
    featured: true,
    helper: "Recomendado para transformar música e letra em lembrança audiovisual.",
  },
  {
    id: "retrospectiva",
    name: "Música + Retrospectiva",
    price: 299,
    badge: "Experiência premium",
    description:
      "A experiência mais completa: música com letra em retrospectiva com fotos personalizadas.",
    features: [
      "Música Supresa com letra na tela",
      "Retrospectiva com até 30 fotos",
      "Edição de vídeo mais completa",
      "Entrega premium",
    ],
    helper: "Perfeito para datas especiais, festas, aniversários, bodas e homenagens.",
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

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
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlanId);

  const selectedPlan = useMemo(() => {
    return plans.find((plan) => plan.id === selectedPlanId) || plans[0];
  }, [plans, selectedPlanId]);

  const handleContinue = () => {
    if (typeof onContinueToPayment === "function") {
      onContinueToPayment(selectedPlan);
      return;
    }

    alert(
      `Continuar para pagamento: ${selectedPlan.name} - ${formatCurrency(
        selectedPlan.price
      )}`
    );
  };

  const faqs = [
    {
      question: "Vou pagar de novo depois?",
      answer: "Não. O pagamento final já incluirá a opção escolhida nesta etapa.",
    },
    {
      question: "Posso optar só pela música?",
      answer: "Sim. A opção Música Surpresa continua disponível por R$ 99,00.",
    },
    {
      question: "Quando recebo?",
      answer:
        "O prazo exato será confirmado antes do pagamento final, de acordo com a opção escolhida.",
    },
    {
      question: "Posso mudar de ideia agora?",
      answer:
        "Sim. Esta etapa existe justamente para você escolher a melhor forma de entregar a surpresa antes de pagar.",
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F2EEE9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center">
            <img
              src={logoMusicaSurpresa}
              alt="Música Surpresa"
              className="h-10 w-auto lg:h-12"
            />
          </div>

          <div className="hidden rounded-full bg-white/70 px-6 py-2 text-sm font-bold text-[#0B2454] shadow-sm sm:block">
            Pedido quase finalizado 🎵
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-[#FFF8F3] px-4 py-4 text-[#0B2454] lg:px-8">
        <div className="mx-auto max-w-6xl">
          <section className="mt-4 rounded-[24px] border border-[#E8DDD2] bg-[#FFF8F3] p-5 shadow-sm lg:p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
              Resumo do seu pedido
            </p>
            <div className="mt-4 grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-[#6B7280]">Presente para</p>
                <p className="mt-1 text-base font-bold">{customer.recipient || "Pessoa especial"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6B7280]">Ocasião</p>
                <p className="mt-1 text-base font-bold">{customer.occasion || "Ocasião especial"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6B7280]">Estilo desejado</p>
                <p className="mt-1 text-base font-bold">{customer.style || "Personalizado"}</p>
              </div>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5B6474]">
              Suas informações foram recebidas. A escolha abaixo define apenas o formato da
              entrega final antes de seguirmos para o pagamento.
            </p>
          </section>

          <section className="mt-6 text-center">
            <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] lg:text-3xl">
              ✨ Três formas de entregar a sua música ✨
            </h2>
            <p className="mx-auto mt-3 max-w-4xl text-sm leading-6 text-[#5B6474] lg:text-base">
              A <span className="font-bold">música</span> é o coração da experiência! Ouvir a música e ler a <span className="font-bold">letra em video</span>, ou vivenciar tudo em uma <span className="font-bold">retrospectiva</span> em video com música, letra e fotos personalizadas torna deixa este presente ainda mais emocionante.
            </p>
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`relative flex h-full min-h-[500px] flex-col rounded-[28px] border bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] ${
                    isSelected
                      ? "border-[#0B2454] ring-2 ring-[#0B2454]"
                      : "border-[#E8DDD2]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${
                          plan.featured
                            ? "bg-[#0B2454] text-white shadow-sm"
                            : "bg-[#FFF3EC] text-[#B45D5D]"
                        }`}
                      >
                        {plan.badge}
                      </span>
                      <h2 className="mt-3 text-xl font-black tracking-[-0.02em]">{plan.name}</h2>
                    </div>
                    <span
                      className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm ${
                        isSelected
                          ? "border-[#0B2454] bg-[#0B2454] text-white"
                          : "border-[#CFC6BE] bg-white text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <p className="mt-3 text-3xl font-black tracking-[-0.03em]">
                    {formatCurrency(plan.price)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#5B6474]">{plan.description}</p>
                  <p className="mt-2 rounded-2xl bg-[#FFF8F3] px-4 py-2.5 text-sm font-semibold leading-6 text-[#0B2454]">
                    {plan.helper}
                  </p>

                  <ul className="mt-4 flex-1 space-y-2 text-sm text-[#21314D]">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <span className="mt-[2px] text-[#B45D5D]">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div
                    className={`mt-4 rounded-[16px] px-4 py-3 text-center text-sm font-black ${
                      isSelected
                        ? "bg-[#0B2454] text-white"
                        : "bg-[#F2EEE9] text-[#0B2454]"
                    }`}
                  >
                    {isSelected ? "Selecionado" : "Selecionar este pacote"}
                  </div>
                </button>
              );
            })}
          </section>

          <section className="mt-6 rounded-[28px] border border-[#E8DDD2] bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
                  Sua escolha final
                </p>
                <h3 className="mt-2 text-xl font-black tracking-[-0.02em] lg:text-2xl">
                  {selectedPlan.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5B6474]">
                  Esta será a opção considerada para o pagamento final.
                </p>
              </div>

              <div className="lg:text-right">
                <p className="text-sm font-semibold text-[#6B7280]">Total</p>
                <p className="mt-2 text-4xl font-black tracking-[-0.03em]">
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

          <section className="mt-8 rounded-[28px] border border-[#E8DDD2] bg-white p-6 shadow-sm lg:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
              Dúvidas rápidas
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-4">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-[20px] bg-[#FFF8F3] p-5">
                  <h4 className="text-base font-black tracking-[-0.02em]">{item.question}</h4>
                  <p className="mt-2 text-sm leading-6 text-[#5B6474]">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
