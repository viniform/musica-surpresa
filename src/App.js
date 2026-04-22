import slide1 from "./assets/Imagem_Index_01.png";
import slide3 from "./assets/Imagem_Index_03.png";
import slide8 from "./assets/Imagem_Index_08.png";
import slide11 from "./assets/Imagem_Index_11.png";
import whatsappIcon from "./assets/whatsapp_icon.png";
import logoMusicaSurpresa from "./assets/Logo_Musica_Surpresa.png";
import { useEffect, useMemo, useState } from "react";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const WHATSAPP_NUMBER = "5511987790463";

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    recipient: "",
    occasion: "",
    plan: "",
    story: "",
    details: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = () => {
    const message = [
      "Olá! Quero pedir a minha música personalizada.",
      "",
      `Nome: ${formData.name || "-"}`,
      `WhatsApp: ${formData.whatsapp || "-"}`,
      `E-mail: ${formData.email || "-"}`,
      `Para quem é a música: ${formData.recipient || "-"}`,
      `Ocasião: ${formData.occasion || "-"}`,
      `Plano desejado: ${formData.plan || "-"}`,
      `História: ${formData.story || "-"}`,
      `Frase, apelido ou detalhe importante: ${formData.details || "-"}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleQuickWhatsApp = () => {
    const message = "Olá! Quero pedir a minha música personalizada pelo WhatsApp.";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const heroSlides = useMemo(
    () => [
      {
        title: (
          <>
            Transformamos <span className="text-[#F25757]">histórias</span> 
            <br />em músicas que emocionam para sempre
          </>
        ),
        description:
          "Música exclusiva, 100% personalizada com letra, estilo e melodia para transformar histórias reais em presentes inesquecíveis.",
        pills: ["+2.000 histórias\ncriadas", "Entrega\nem 48h", "5★ em experiências\nemocionantes"],
          image: slide3,
        imageAlt: "Pessoa sorrindo após receber um presente especial",
        cta: "CRIAR MINHA MÚSICA 🎁",
      },
      {
        title: (
          <>
            Homenageie <span className="text-[#F25757]">pessoas especiais</span> com uma música feita só para elas
          </>
        ),
        description:
          "Crie uma homenagem emocionante para mães, pais, avós, filhos, amigos e pessoas que mereçam uma lembrança eternizada.",
        pills: ["Homenagens\núnicas", "Letra\npersonalizada", "Entrega\nrápida"],
          image: slide8,
        imageAlt: "Pessoas formando um coração com as mãos em um momento especial",
        cta: "CRIAR MINHA HOMENAGEM 🎶",
      },
      {
        title: (
          <>
            Crie músicas para <span className="text-[#F25757]">ocasiões especiais</span> que merecem 
            <br />ser inesquecíveis
          </>
        ),
        description:
          "Dia das Mães, Dia dos Pais, Dia dos Namorados, aniversários e outras datas ganham um presente único e emocional.",
        pills: ["Datas\ncomemorativas", "Presente\nsurpreendente", "Pronto para\nemocionar"],
          image: slide1,
        imageAlt: "Grupo comemorando uma ocasião especial ao ar livre",
        cta: "ESCOLHER MINHA OCASIÃO 💝",
      },
    ],
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  const activeHeroSlide = heroSlides[currentSlide];

  const plans = [
    {
      name: "Música Surpresa",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados | entregue em até 48 horas.",

        price: "R$ 149",
      color: "#B45D5D",
      bg: "#F7F0EB",
      border: "#E4D8CF",
      icon: "🎁",
      features: [
        "Letra personalizada",
        "Melodia exclusiva",
        "Arranjo profissional",
        "Entrega em até 48h",
        "Áudio em alta qualidade",
      ],
      cta: "ESCOLHER ESTE PLANO",
      featured: false,
    },
    {
      name: "Retrato Musical",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados + vídeo com 1 foto + letra no vídeo | entregue em até 48 horas.",
      price: "R$ 249",
      color: "#337391",
      bg: "#F7F4FF",
      border: "#D9D1F0",
      icon: "♪",
      features: [
        "Tudo do plano Música Surpresa",
        "Vídeo com foto",
        "Letra da música no vídeo",
        "Pronto para compartilhar",
        "Entrega em até 48h",
      ],
      cta: "ESCOLHER ESTE PLANO",
      featured: true,
      badge: "MAIS ESCOLHIDO",
    },
    {
      name: "História Cantada",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados + retrospectiva em video com 30 fotos + letra da música (legendas) no vídeo | entregue em até 72 horas.",
      price: "R$ 399",
      color: "#805b34",
      bg: "#F2F6F2",
      border: "#D7E1D7",
      icon: "▣",
      features: [
        "Tudo do plano Retrato Musical",
        "Retrospectiva em video com até 30 fotos",
        "Edição de video profissional",
        "Letra da música no vídeo",        
        "Transições e efeitos especiais",        
        "Entrega em até 72h",
      ],
      cta: "ESCOLHER ESTE PLANO",
      featured: false,
    },
  ];

  const steps = [
    {
      title: "Conte sua história",
      text: "Preencha o formulário com detalhes, nomes, momentos e sentimentos que deseja ver na música.",
      icon: "📝",
      color: "#F25757",
    },
    {
      title: "Compondo sua música",
      text: "Nossa equipe cria a letra, melodia e arranjo exclusivos para a sua história.",
      icon: "♪",
      color: "#7C3AED",
    },
    {
      title: "Produção e revisão",
      text: "Produzimos sua música e o vídeo, especialmente nos planos Retrato e História.",
      icon: "▶",
      color: "#2FA866",
    },
    {
      title: "Entrega emocionante",
      text: "Você recebe sua música pronta para emocionar e eternizar momentos.",
      icon: "🎁",
      color: "#F4B740",
    },
  ];

  const testimonials = [
    {
      name: "Camila R.",
      city: "São Paulo - SP",
      quote:
        "Dei para meu marido no aniversário e ele chorou do início ao fim. Simplesmente inesquecível!",
      role: "Presente de aniversário",
    },
    {
      name: "Ricardo L.",
      city: "Curitiba - PR",
      quote:
        "A música contou exatamente a nossa história. Cada detalhe foi pensado com muito carinho.",
      role: "Homenagem romântica",
    },
    {
      name: "Amanda S.",
      city: "Belo Horizonte - MG",
      quote:
        "A retrospectiva com as fotos ficou linda demais. É emocionante ver tudo isso em forma de música.",
      role: "Presente para a família",
    },
  ];

  const faqs = [
    {
      q: "Qual o prazo de entrega?",
      a: "Música Surpresa e Retrato Musical são entregues em até 48 horas. História Cantada é entregue em até 72 horas.",
    },
    {
      q: "Como funciona o pagamento?",
      a: "O pagamento é feito online. Após a confirmação, você recebe o formulário completo e iniciamos a produção do pedido.",
    },
    {
      q: "Posso pedir alterações na música?",
      a: "Sim. Dependendo do plano, você pode solicitar ajustes para alinhar o resultado ao contexto enviado.",
    },
    {
      q: "Vocês atendem para empresas?",
      a: "Sim. Também podemos criar músicas personalizadas para ações corporativas, homenagens e campanhas especiais.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2EEE9] text-[#1E1E1E]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F2EEE9]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-10">
          <div className="flex items-center">
            <img
              src={logoMusicaSurpresa}
              alt="Música Surpresa"
              className="h-14 w-auto lg:h-16"
            />
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#0B2454] lg:flex">
            <a href="#como-funciona" className="transition hover:opacity-70">
              Como funciona
            </a>
            <a href="#planos" className="transition hover:opacity-70">
              Planos
            </a>
            <a href="#depoimentos" className="transition hover:opacity-70">
              Depoimentos
            </a>
            <a href="#faq" className="transition hover:opacity-70">
              Perguntas
            </a>
            <a href="#contato" className="transition hover:opacity-70">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#formulario"
              className="hidden rounded-xl bg-[#0B2454] px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-95 lg:inline-block lg:text-sm"
            >
              FAZER MEU PEDIDO 🎁
            </a>

            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8D4CE] bg-white text-[#0B2454] shadow-sm lg:hidden"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-black/5 bg-[#F2EEE9] px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm font-semibold text-[#0B2454]">
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#F2EEE9]"
              >
                Como funciona
              </a>
              <a
                href="#planos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#F2EEE9]"
              >
                Planos
              </a>
              <a
                href="#depoimentos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#F2EEE9]"
              >
                Depoimentos
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#F2EEE9]"
              >
                Perguntas
              </a>
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#F2EEE9]"
              >
                Contato
              </a>
              <a
                href="#formulario"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-xl bg-[#0B2454] px-4 py-3 text-center text-sm font-bold text-white shadow-sm"
              >
                FAZER MEU PEDIDO 🎁
              </a>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden bg-[#F2EEE9]">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-8 lg:grid-cols-2 lg:px-10 lg:py-8">
          <div className="flex min-h-[400px] flex-col justify-start pt-4 lg:pt-6">
            <div className="max-w-2xl">
              <h1 className="min-h-[170px] max-w-[600px] text-[34px] font-black leading-[0.98] tracking-[-0.03em] text-[#161616] sm:text-[38px] lg:text-[44px]">
                {activeHeroSlide.title}
              </h1>

              <p className="mt-4 min-h-[96px] max-w-[680px] text-[18px] font-medium leading-[1.6] text-[#4B5563] lg:text-[20px]">
                {activeHeroSlide.description}
              </p>

              <div className="mt-7 flex min-h-[92px] flex-wrap gap-3 text-[14px] font-semibold text-[#0B2454] lg:gap-4 lg:text-[15px]">
                {activeHeroSlide.pills.map((pill) => (
                  <span
                    key={pill}
                    className="flex h-[58px] w-[160px] items-center justify-center rounded-[16px] border border-black/5 bg-white px-3 text-center leading-tight shadow-sm lg:h-[62px] lg:w-[170px]"
                  >
                    <span className="flex flex-col items-center justify-center leading-tight">
                      {pill.split("\n").map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex min-h-[430px] items-start justify-end pt-4 lg:pt-6">
            <div className="relative h-[340px] w-full max-w-[600px] overflow-hidden rounded-[34px] bg-[#EEDFD2] shadow-[0_20px_50px_rgba(0,0,0,0.10)] lg:h-[375px]">
              <img
                src={activeHeroSlide.image}
                alt={activeHeroSlide.imageAlt}
                className="h-full w-full object-cover transition-opacity duration-700"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 bg-[#F2EEE9]">
          <div className="mx-auto max-w-7xl px-4 py-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <a
                href="#planos"
                className="inline-flex min-h-[68px] items-center justify-center rounded-[18px] bg-[#0B2454] px-8 text-[18px] font-black text-white shadow-[0_8px_30px_rgba(11,36,84,0.16)] transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-xl lg:min-w-[400px] lg:px-10 lg:text-[20px]"
              >
                {activeHeroSlide.cta}
              </a>

              <div className="grid gap-4 lg:flex lg:items-center lg:gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8DE] text-[26px] text-[#0B2454]">
                    ★
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none text-[#22395F] lg:text-[20px]">
                      100% Personalizada
                    </p>
                    <p className="mt-2 text-[15px] leading-none text-[#6B7280] lg:text-[16px]">
                      Do seu jeito
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8DE] text-[26px] text-[#0B2454]">
                    ⚡
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none text-[#22395F] lg:text-[20px]">
                      Entrega rápida
                    </p>
                    <p className="mt-2 text-[15px] leading-none text-[#6B7280] lg:text-[16px]">
                      Até 48h ou 72h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1E8DE] text-[26px] text-[#0B2454]">
                    ♥
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none text-[#22395F] lg:text-[20px]">
                      Presente inesquecível
                    </p>
                    <p className="mt-2 text-[15px] leading-none text-[#6B7280] lg:text-[16px]">
                      Emociona de verdade
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="scroll-mt-24 bg-[#F2EEE9] py-20 lg:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F25757]">
              Escolha a opção ideal
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#0B2454] sm:text-4xl lg:text-5xl">
              Qual delas combina melhor com este momento?
            </h2>
          </div>

          <div className="mt-10 grid gap-6 lg:items-start lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[28px] border p-7 transition-all duration-300 hover:-translate-y-1 ${
                  plan.featured ? "scale-[1.02] shadow-xl" : "shadow-sm hover:shadow-lg"
                } ${
                  plan.name === "Música Surpresa"
                    ? "lg:min-h-[520px]"
                    : plan.name === "Retrato Musical"
                    ? "lg:min-h-[550px]"
                    : "lg:min-h-[580px]"
                }`}
                style={{ backgroundColor: plan.bg, borderColor: plan.border }}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#0B2454] px-4 py-2 text-xs font-bold text-white shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5 flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white"
                    style={{ backgroundColor: plan.color }}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="text-3xl font-black leading-[0.95] tracking-[-0.03em]" style={{ color: plan.color }}>
                    {plan.name.split(" ")[0]}
                    <br />
                    {plan.name.split(" ").slice(1).join(" ")}
                  </h3>
                </div>

                <p className="text-sm leading-7 text-[#4B5563]">{plan.subtitle}</p>

                <ul className="mt-6 space-y-3 text-sm font-medium text-[#374151]">
                  {plan.features.map((item, index) => (
                    <li key={item} className="flex items-start gap-3">
                      <span style={{ color: plan.color }}>
                        {plan.name === "Música Surpresa" || index === 0 ? "✓" : "+"}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 text-center text-5xl font-black tracking-[-0.03em]" style={{ color: plan.color }}>
                      {plan.price}
                    </div>

                    <button
                      className={`mt-4 w-full rounded-xl px-2 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 ${
                        plan.featured ? "shadow-lg" : "shadow-sm"
                      }`}
                      style={{ backgroundColor: plan.color }}
                    >
                      {plan.cta}
                    </button>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-[#6B7280]">
            <span>🔒 Pagamento 100% seguro</span>
            <span>•</span>
            <span>Parcele em até 12x</span>
            <span>•</span>
            <span>Satisfação garantida</span>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-24 bg-[#F2EEE9] py-16 lg:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F25757]">
              Como funciona
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B2454] sm:text-4xl">
              É simples, rápido e feito com muito carinho
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="text-center">
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-md"
                  style={{ backgroundColor: step.color }}
                >
                  {step.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-[#0B2454]">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#4B5563]">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="scroll-mt-24 bg-[#0B2454] py-20 lg:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F4B740]">
              Depoimentos
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Histórias reais, <span className="text-[#F4B740]">emoções verdadeiras</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[24px] bg-white p-6 shadow-lg">
                <p className="text-base leading-8 text-[#374151]">“{item.quote}”</p>
                <div className="mt-6 border-t border-black/5 pt-4">
                  <p className="font-bold text-[#0B2454]">{item.name}</p>
                  <p className="text-sm text-[#6B7280]">{item.city}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#F25757]">
                    {item.role}
                  </p>
                  <p className="mt-3 text-sm text-[#F4B740]">★★★★★</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="formulario" className="scroll-mt-24 bg-[#F2EEE9] py-10 lg:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="w-full overflow-hidden rounded-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <img
              src={slide11}
              alt="Pessoas em um momento especial"
              className="h-[500px] w-full object-cover object-[center_35%] lg:h-[520px]"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F25757]">
              Comece agora
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#0B2454] sm:text-4xl">
              Conte sua história e criamos sua música
            </h2>

            <p className="mt-4 text-base leading-7 text-[#6B7280]">
              Preencha os dados abaixo. Quanto mais detalhes, mais emocionante será o resultado.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-[#0B2454]">
              <span className="rounded-full bg-[#FFF3EC] px-4 py-2">Resposta rápida</span>
              <span className="rounded-full bg-[#FFF3EC] px-4 py-2">Atendimento humanizado</span>
              <span className="rounded-full bg-[#FFF3EC] px-4 py-2">100% personalizado</span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none"
                placeholder="Seu nome"
              />

              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none"
                placeholder="WhatsApp"
              />

              <input
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
                placeholder="E-mail"
              />

              <input
                name="recipient"
                value={formData.recipient}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
                placeholder="Para quem é a música?"
              />

              <select
                name="occasion"
                value={formData.occasion}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
              >
                <option value="">Qual a ocasião?</option>
                <option>Aniversário</option>
                <option>Namoro</option>
                <option>Casamento</option>
                <option>Dia das Mães</option>
                <option>Homenagem</option>
              </select>

              <select
                name="plan"
                value={formData.plan}
                onChange={handleFormChange}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
              >
                <option value="">Qual plano deseja?</option>
                <option>Música Surpresa — R$ 149</option>
                <option>Retrato Musical — R$ 249</option>
                <option>História Cantada — R$ 399</option>
              </select>

              <textarea
                name="story"
                value={formData.story}
                onChange={handleFormChange}
                rows={4}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
                placeholder="Conte um pouco da história (como se conheceram, momentos marcantes, características da pessoa...)"
              />

              <textarea
                name="details"
                value={formData.details}
                onChange={handleFormChange}
                rows={3}
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
                placeholder="Existe alguma frase, apelido ou detalhe que não pode faltar?"
              />
            </div>

            <button
              type="button"
              onClick={handleWhatsAppSubmit}
              className="mt-6 w-full rounded-xl bg-[#F25757] px-5 py-4 text-sm font-bold text-white shadow-[0_10px_22px_rgba(242,87,87,0.18)] transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-[0_14px_28px_rgba(242,87,87,0.24)]"
            >
              PEDIR A MINHA MÚSICA 🎁
            </button>

            <p className="mt-4 text-center text-sm text-[#6B7280]">
              Ao clicar, abriremos o WhatsApp com sua mensagem preenchida automaticamente.
            </p>
          </div>
        </div>
      </section>
      <section id="faq" className="scroll-mt-24 bg-[#F2EEE9] py-16 lg:scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F25757]">
              Dúvidas frequentes
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-[#ECE2D8] bg-white shadow-sm transition-all duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <h3 className="text-lg font-bold text-[#0B2454]">{faq.q}</h3>
                    <span className="text-xl font-bold text-[#F25757]">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#F1E7DD] px-5 pb-5 pt-4">
                      <p className="text-sm leading-7 text-[#4B5563]">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

<button
  type="button"
  onClick={handleQuickWhatsApp}
  aria-label="Peça pelo WhatsApp"
  className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-transparent p-0 text-white shadow-none transition-all duration-300 hover:scale-[1.03] sm:gap-2.5 sm:rounded-full sm:bg-[#38B73F] sm:px-3.5 sm:py-2.5 sm:shadow-[0_12px_26px_rgba(56,183,63,0.26)] sm:hover:shadow-[0_16px_34px_rgba(56,183,63,0.34)] lg:bottom-5 lg:right-5"
>
  <span className="flex h-14 w-14 min-h-[56px] min-w-[56px] shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[0_12px_26px_rgba(37,211,102,0.34)] aspect-square sm:h-11 sm:w-11 sm:min-h-[44px] sm:min-w-[44px] sm:border-[2.5px] sm:border-white sm:bg-[#38B73F] sm:shadow-sm">
    <img
      src={whatsappIcon}
      alt="WhatsApp"
      className="h-[74%] w-[74%] object-contain sm:h-[72%] sm:w-[72%]"
    />
  </span>

  <span className="hidden text-left text-[13px] font-bold leading-[1.02] tracking-[-0.02em] sm:inline">
    <span className="block">Peça pelo</span>
    <span className="block">WhatsApp</span>
  </span>
</button>
      <footer id="contato" className="scroll-mt-24 bg-[#0B2454] py-14 text-white lg:scroll-mt-32">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-4 lg:px-10">
          <div>
            <div className="flex items-center">
              <img
                src={logoMusicaSurpresa}
                alt="Música Surpresa"
                className="h-14 w-auto brightness-0 invert lg:h-16"
              />
            </div>
            <p className="mt-4 text-sm leading-7 text-white/75">
              Transformamos histórias em músicas exclusivas que emocionam e marcam para sempre.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F4B740]">
              Compra segura
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>Site 100% seguro</li>
              <li>Parcele em até 12x</li>
              <li>Satisfação garantida</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F4B740]">
              Atendimento
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>Entrega em até 48h ou 72h</li>
              <li>Suporte humanizado</li>
              <li>Pedidos personalizados</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F4B740]">
              Fale conosco
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>(11) 98779-0463</li>
              <li>contato@musicasurpresa.com.br</li>
              <li>Instagram: @musicasurpresa</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-4 pt-6 text-center text-sm text-white/60 lg:px-10">
          © 2026 Música Surpresa. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
