import slide1 from "./assets/Imagem_Index_Dia_das_Maes_02.png";
import slide2 from "./assets/Imagem_Index_16.png";
import slide11 from "./assets/Imagem_Index_Musica_Surpresa_01.png";
import imagemHero16 from "./assets/Imagem_Index_Pais_02.png";
import whatsappIcon from "./assets/whatsapp_icon.png";
import logoMusicaSurpresa from "./assets/Logo_Musica_Surpresa.png";
import demoDiaDasMaes from "./assets/musica_surpresa_dia_das_maes.mp3";
import demoHomenagemNamorado from "./assets/Musica_Surpresa_Homenagem_Namorado.mp3";
import demoHomenagemPai from "./assets/Musica_Homenagem_Pai.mp3";
import demoHomenagemFamilia from "./assets/Musica_Surpresa_Homenagem_Familia.mp3";
import demoHomenagemAmigos from "./assets/Musica_Surpresa_Homenagem_Amigos.mp3";
import { useEffect, useMemo, useRef, useState } from "react";
import UpsellPage from "./pages/UpsellPage";
import AboutPage from "./pages/AboutPage";
import MusicFormPage from "./pages/MusicFormPage";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUpsell] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);



  const WHATSAPP_NUMBER = "5511940787078";
  const GOOGLE_SHEETS_WEBHOOK_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || "";

  const BRAND = {
    terracotta: "#B24F36",
    terracottaDark: "#A93F2B",
    terracottaSoft: "#FCE7DD",
    cream: "#FFF8F3",
    warmBg: "#F7EFE8",
    navy: "#0B2454",
    text: "#1E1E1E",
    muted: "#5B6474",
  };
const [formData, setFormData] = useState({
  name: "",
  whatsapp: "",
  email: "",
  plan: "Música Surpresa — R$ 125,00",
});


const initialPlanId = useMemo(() => {
  const routePlan =
    window.location.pathname === "/upsell"
      ? new URLSearchParams(window.location.search).get("plano")
      : null;

  const p = (routePlan || formData.plan || "").toLowerCase();

  if (p.includes("retrato")) return "retrato-musical";
  if (p.includes("história") || p.includes("historia")) return "historia-cantada";

  return "musica-surpresa";
}, [formData.plan]);

  const normalizeWhatsapp = (value) => {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("55") && digits.length > 11
      ? digits.slice(2)
      : digits;

  return withoutCountryCode.slice(0, 11);
};


const formatWhatsapp = (value) => {
  const digits = normalizeWhatsapp(value);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};


function normalizeName(value) {
  const hadTrailingSpace = /\s$/.test(value);
  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/^\s+/, "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return hadTrailingSpace ? `${normalized} ` : normalized;
}

const normalizeEmail = (value) => {
  return value.trim().toLowerCase();
};
const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const generateOrderId = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `MS-${timestamp}-${random}`;
};

const buildCustomerId = (whatsapp) => {
  const digits = normalizeWhatsapp(whatsapp);
  return digits ? `55${digits}` : "";
};

const syncLeadToSheet = async (payload) => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn("Webhook do Google Sheets não configurado. Defina REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL.");
    return;
  }

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Erro ao sincronizar lead com Google Sheets", error);
  }
};
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: normalizeWhatsapp(value) }));
      return;
    }


    if (name === "name") {
    setFormData((prev) => ({ ...prev, [name]: value }));
    return;
    }

    if (name === "email") {
      setFormData((prev) => ({ ...prev, [name]: normalizeEmail(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinueToMusicForm = async () => {
    if (!formData.name || !formData.whatsapp || !formData.email) {
      alert("Preencha nome, WhatsApp e e-mail para continuar.");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("Digite um e-mail válido.");
      return;
    }

    if (formData.whatsapp.length < 10 || formData.whatsapp.length > 11) {
      alert("Digite um WhatsApp válido com DDD.");
      return;
    }

    const existingLead = sessionStorage.getItem("musicOrderLead");
    let existingOrderId = "";

    try {
      existingOrderId = existingLead ? JSON.parse(existingLead)?.orderId || "" : "";
    } catch (error) {
      console.error("Erro ao recuperar orderId existente", error);
    }

    const orderId = existingOrderId || generateOrderId();
    const customerId = buildCustomerId(formData.whatsapp);

    const leadPayload = {
      orderId,
      customerId,
      stage: "lead_criado",
      paymentId: "",
      paymentStatus: "",
      paymentStatusDetail: "",
      paymentMethod: "",
      planId: initialPlanId,
      planTitle: formData.plan,
      customerName: normalizeName(formData.name),
      email: formData.email,
      whatsapp: formData.whatsapp,
      recipient: "",
      relationship: "",
      occasion: "",
      description: "",
      message: "",
      moments: "",
      specialPhrase: "",
      style: "",
      voiceType: "",
      observations: "",
      amount: formData.plan.match(/R\$\s*([\d.,]+)/)?.[1] || "",
      externalReference: orderId,
    };

    sessionStorage.setItem("musicOrderLead", JSON.stringify({
      ...leadPayload,
      name: leadPayload.customerName,
      plan: formData.plan,
    }));

    sessionStorage.setItem("selectedPlan", formData.plan);

    await syncLeadToSheet(leadPayload);

    window.location.href = "/criar-musica";
  };

  const handleQuickWhatsApp = () => {
    const message = "Olá! Tenho algumas dúvidas sobre a Música Surpresa e gostaria de falar com vocês.";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const heroSlides = useMemo(
    () => [
      {
        title: (
          <>
            Transformamos <span style={{ color: BRAND.terracotta }}>histórias</span>
            <br />em músicas que emocionam para sempre
          </>
        ),
        description:
          "Música exclusiva, 100% personalizada com letra, estilo e melodia para transformar histórias reais em presentes inesquecíveis ✨",
        pills: ["Curadoria\nMusical", "Entrega em\naté 48h", "Experiências\nemocionantes"],
        image: imagemHero16,
        imageAlt: "Casal ouvindo música juntos",
        cta: "💝 CRIAR MINHA MÚSICA",
      },
      {
        title: (
          <>
            Homenageie <span style={{ color: BRAND.terracotta }}>pessoas especiais</span> com uma música feita só para elas
          </>
        ),
        description:
          "Crie uma homenagem emocionante para mães, pais, avós, filhos, amigos e pessoas que mereçam uma lembrança eternizada ✨",
        pills: ["Homenagens\nÚnicas", "Letra\nPersonalizada", "Entrega\nRápida"],
        image: slide2,
        imageAlt: "Mãe ouvindo música personalizada que a filha deu de presente ",
        cta: "💝 CRIAR MINHA MÚSICA",
      },
      {
        title: (
          <>
            Crie músicas para <span style={{ color: BRAND.terracotta }}>ocasiões especiais</span> que merecem
            <br />ser inesquecíveis
          </>
        ),
        description:
          "Dia das Mães, Dia dos Pais, Dia dos Namorados, aniversários e outras datas ganham um presente único e emocional ✨",
        pills: ["Diferente", "Surpreendente", "Emocionante"],
        image: slide1,
        imageAlt: "Família ouvindo música peronalizada para uma ocasião especial",
        cta: "💝 CRIAR MINHA MÚSICA",
      },
    ],
    [BRAND.terracotta]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [heroSlides]);



  const activeHeroSlide = heroSlides[currentSlide];

  const demoSongs = [
    {
      title: "Café na Cozinha",
      occasion: "Homenagem de filhos para a Mãe",
      style: "MPB Pop",
      audio: demoDiaDasMaes,
    },
    {
      title: "É Família!",
      occasion: "Música da Família",
      style: "Pagode",
      audio: demoHomenagemFamilia,
    },
    {
      title: "Porto Seguro",
      occasion: "De Namorada para Namorado",
      style: "Pop Romântico",
      audio: demoHomenagemNamorado,
    },
    {
      title: "Nossa Base",
      occasion: "Homenagem de filhos para o Pai",
      style: "MPB",
      audio: demoHomenagemPai,
    },
    {
      title: "Meu Lugar",
      occasion: "Homenagem de Amigo para Amiga",
      style: "Pop R&B",
      audio: demoHomenagemAmigos,
    },
  ];

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // handleNext and handlePrev removed

  const visibleDemoSongs = demoSongs.map((song, index) => ({
    ...song,
    songIndex: index,
  }));

  const handleSelectSong = (songIndex) => {
    if (!audioRef.current) return;

    if (songIndex === currentSongIndex) {
      handlePlayPause();
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setCurrentSongIndex(songIndex);

    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 0);
  };
  const plans = [
    {
      name: "Música Surpresa",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados | entregue em até 48 horas.",

      price: "R$ 125,00",
      color: BRAND.terracotta,
      bg: BRAND.cream,
      border: BRAND.terracottaSoft,
      icon: "🎁",
      features: [
        "Letra personalizada",
        "Melodia exclusiva",
        "Arranjo profissional",
        "Entrega em até 48h",
        "Áudio com qualidade",
      ],
      cta: "💝 CRIAR MINHA MÚSICA",
      featured: false,
    },
    {
      name: "Retrato Musical",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados + vídeo com 1 foto + letra no vídeo | entregue em até 48 horas.",
      price: "R$ 249",
      color: BRAND.terracotta,
      bg: BRAND.cream,
      border: BRAND.terracottaSoft,
      icon: "♪",
      features: [
        "Tudo do plano Música Surpresa",
        "Vídeo com foto",
        "Letra da música no vídeo",
        "Pronto para compartilhar",
        "Entrega em até 48h",
      ],
      cta: "💝 CRIAR MINHA MÚSICA",
      featured: true,
      badge: "MAIS ESCOLHIDO",
    },
    {
      name: "História Cantada",
      subtitle:
        "Música exclusiva com letra, melodia e arranjo 100% personalizados + retrospectiva em video com 30 fotos + letra da música (legendas) no vídeo | entregue em até 72 horas.",
      price: "R$ 399",
      color: BRAND.terracotta,
      bg: BRAND.cream,
      border: BRAND.terracottaSoft,
      icon: "▣",
      features: [
        "Tudo do plano Retrato Musical",
        "Retrospectiva em video com até 30 fotos",
        "Edição de video profissional",
        "Letra da música no vídeo",        
        "Transições e efeitos especiais",        
        "Entrega em até 72h",
      ],
      cta: "💝 CRIAR MINHA MÚSICA",
      featured: false,
    },
  ];

  const steps = [
    {
      title: "Você conta tudo pra gente ...",
      text: "Preencha o formulário dizendo tudo o que você quer expressar com esta música",
      icon: "✍️",
      color: BRAND.terracotta,
    },
    {
      title: "A gente prepara a sua música ...",
      text: "Nossa equipe cria letra e melodia personalizadas para a sua música",
      icon: "🎧",
      color: BRAND.terracotta,
    },
    {
      title: "Produzimos, revisamos ... ",
      text: "Produzimos, analisamos e revisamos sua música com toda a nossa experiência",
      icon: "🔍",
      color: BRAND.terracotta,
    },
    {
      title: "Sua música fica pronta!",
      text: "Você recebe sua música pronta para emocionar e eternizar momentos",
      icon: "🎁",
      color: BRAND.terracotta,
    },
  ];

  const testimonials = [
    {
      name: "Karina F.",
      city: "São Paulo - SP",
      quote:
        "Dei uma música de presente para meu marido no aniversário dele, e ele chorou do início ao fim. Foi inesquecível ... ",
      role: "Presente de aniversário",
    },
    {
      name: "Eduardo T.",
      city: "Curitiba - PR",
      quote:
        "A música contou exatamente a nossa história. Gostei do atendimento, parece que cada detalhe foi pensado com carinho.",
      role: "Homenagem romântica",
    },
    {
      name: "Fernanda S.",
      city: "Belo Horizonte - MG",
      quote:
        "A retrospectiva com as fotos ficou linda. Foi emocionante ver e ouvir a história da nossa família",
      role: "Presente para a família",
    },
  ];

  const faqs = [
    {
      q: "Qual o prazo de entrega?",
      a: "As músicas são entregues em até 48 horas. Entre em contato com a gente se tiver urgência.",
    },
    {
      q: "Como funciona o pagamento?",
      a: "O pagamento é totalmente online, e a produção da música é iniciada logo após aprovação / confirmação do pagamento.",
    },
    {
      q: "Posso pedir alterações na música?",
      a: "Sim, a depender do tipo de alteração e do estágio de produção da música, você pode solicitar ajustes para alinhar o resultado ao contexto registrado no formulário de composição.",
    },
    {
      q: "Vocês atendem empresas?",
      a: "Sim. Também criamos músicas personalizadas para eventos, ações corporativas, homenagens e campanhas especiais.",
    },
  ];

  const createMercadoPagoCheckout = async (plan) => {
    const response = await fetch("/api/mercado-pago/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId: plan.id,
        title: plan.name,
        unitPrice: plan.price,
        quantity: 1,
        orderId: upsellParams.orderId || "",
        customerId: upsellParams.customerId || "",
        customer: {
          name: upsellParams.customerName || formData.name,
          email: upsellParams.email || formData.email,
          whatsapp: upsellParams.whatsapp || formData.whatsapp,
        },
        briefing: {
          recipient: upsellParams.recipient || "",
          relationship: upsellParams.relationship || "",
          occasion: upsellParams.occasion || "",
          description: upsellParams.description || "",
          message: upsellParams.message || "",
          moments: upsellParams.moments || "",
          specialPhrase: upsellParams.specialPhrase || "",
          style: upsellParams.style || "",
          voiceType: upsellParams.voiceType || "",
          observations: upsellParams.observations || "",
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar preferência de pagamento.");
    }

    const data = await response.json();

    if (!data.init_point) {
      throw new Error("Checkout Mercado Pago não retornou init_point.");
    }

    return data.init_point;
  };

  const isUpsellRoute = window.location.pathname === "/upsell";
  const isAboutRoute = window.location.pathname === "/quem-somos";
  const isMusicFormRoute = window.location.pathname === "/criar-musica";
  const isPaymentSuccessRoute = window.location.pathname === "/pagamento/sucesso";
  const isPaymentPendingRoute = window.location.pathname === "/pagamento/pendente";
  const isPaymentErrorRoute = window.location.pathname === "/pagamento/erro";

  useEffect(() => {
    if (window.location.pathname !== "/") return;
    if (!window.location.hash) return;

    const sectionId = window.location.hash.replace("#", "");

    const timeout = setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (!element) return;

      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  const upsellParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    // tenta ler dados do formulário próprio
    let draft = null;
    try {
      const stored = sessionStorage.getItem("musicOrderDraft");
      if (stored) draft = JSON.parse(stored);
    } catch (e) {
      console.error("Erro ao ler sessionStorage", e);
    }

    return {
      orderId: draft?.orderId || "",
      customerId: draft?.customerId || "",

      customerName:
        draft?.name ||
        params.get("cliente_nome") ||
        params.get("comprador_nome") ||
        formData.name,

      recipient:
        draft?.recipient ||
        params.get("presente_para") ||
        params.get("homenageado") ||
        params.get("destinatario") ||
        params.get("nome") ||
        "Pessoa especial",

      email:
        draft?.email ||
        params.get("email") ||
        formData.email,

      whatsapp:
        draft?.whatsapp ||
        params.get("whatsapp") ||
        formData.whatsapp,

      occasion:
        draft?.occasion ||
        params.get("ocasiao") ||
        params.get("ocasião") ||
        "Ocasião especial",

      style:
        draft?.style ||
        params.get("estilo") ||
        params.get("estilo_desejado") ||
        "Personalizado",

      relationship: draft?.relationship || "",
      description: draft?.description || "",
      message: draft?.message || "",
      moments: draft?.moments || "",
      specialPhrase: draft?.specialPhrase || "",
      voiceType: draft?.voiceType || "",
      observations: draft?.observations || "",

      plan:
        params.get("plano") || formData.plan,
    };
  }, [formData.email, formData.name, formData.plan, formData.whatsapp]);

  if (isMusicFormRoute) {
    return <MusicFormPage />;
  }

  if (showUpsell || isUpsellRoute) {
    return (
      <UpsellPage
        customer={{
          recipient: upsellParams.recipient,
          occasion: upsellParams.occasion,
          style: upsellParams.style,
        }}
        initialPlanId={initialPlanId}
        onContinueToPayment={async (plan) => {
          try {
            const checkoutUrl = await createMercadoPagoCheckout(plan);
            window.location.href = checkoutUrl;
          } catch (error) {
            console.error(error);
            alert("Não foi possível iniciar o pagamento agora. Tente novamente em instantes.");
          }
        }}
      />
    );
  }

  if (isAboutRoute) {
    return <AboutPage />;
  }

  if (isPaymentSuccessRoute || isPaymentPendingRoute || isPaymentErrorRoute) {
    const status = isPaymentSuccessRoute
      ? {
          emoji: "✅",
          title: "Pagamento confirmado",
          subtitle: "Seu pedido foi recebido com sucesso.",
          message:
            "Nossa equipe já pode iniciar a produção da sua Música Surpresa. Você também receberá as próximas orientações pelos canais informados no pedido.",
          actionLabel: "Voltar para o início",
        }
      : isPaymentPendingRoute
      ? {
          emoji: "⏳",
          title: "Pagamento em processamento",
          subtitle: "Estamos aguardando a confirmação do pagamento.",
          message:
            "Se você pagou por Pix, a confirmação costuma acontecer em poucos instantes. Assim que o Mercado Pago confirmar, seu pedido seguirá para produção.",
          actionLabel: "Voltar para o início",
        }
      : {
          emoji: "⚠️",
          title: "Pagamento não concluído",
          subtitle: "Não conseguimos confirmar o pagamento.",
          message:
            "Você pode tentar novamente ou falar com nosso atendimento para receber ajuda.",
          actionLabel: "Tentar novamente",
        };

    return (
      <div className="min-h-screen px-4 py-10" style={{ backgroundColor: BRAND.warmBg, color: BRAND.text }}>
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <img
            src={logoMusicaSurpresa}
            alt="Música Surpresa"
            className="h-20 w-auto"
          />

          <div className="mt-10 w-full rounded-[28px] border border-[#E8DDD2] bg-white px-6 py-10 shadow-sm sm:px-10">
            <div className="text-5xl">{status.emoji}</div>
            <h1 className="mt-6 text-3xl font-black tracking-[-0.03em]" style={{ color: BRAND.navy }}>
              {status.title}
            </h1>
            <p className="mt-3 text-lg font-bold" style={{ color: BRAND.terracotta }}>
              {status.subtitle}
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7" style={{ color: BRAND.muted }}>
              {status.message}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-xl px-6 py-4 text-sm font-bold text-white transition hover:opacity-95"
                style={{ backgroundColor: BRAND.terracotta }}
              >
                {status.actionLabel}
              </a>
              <button
                type="button"
                onClick={handleQuickWhatsApp}
                className="inline-flex items-center justify-center rounded-xl border border-[#E8DDD2] bg-white px-6 py-4 text-sm font-bold transition hover:bg-[#FFF8F3]"
                style={{ color: BRAND.navy }}
              >
                Falar com atendimento
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="topo" className="min-h-screen" style={{ backgroundColor: BRAND.warmBg, color: BRAND.text }}>
      <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ backgroundColor: BRAND.cream, borderColor: "rgba(0,0,0,0.05)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-10">
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMobileMenuOpen(false);
            }}
            className="flex items-center"
            aria-label="Voltar ao topo"
          >
            <img
              src={logoMusicaSurpresa}
              alt="Música Surpresa"
              className="h-12 w-auto lg:h-16"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex" style={{ color: BRAND.navy }}>
            <a
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
const element = document.getElementById("planos");
if (element) {
  const headerOffset = 110; // ajuste fino se necessário
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  const offsetPosition = elementPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}
              }}
              className="transition hover:opacity-70"
            >
              Como funciona?
            </a>
            <a href="#musicas" className="transition hover:opacity-70">
              Ouça Nossas Músicas
            </a>
            <a href="#depoimentos" className="transition hover:opacity-70">
              Depoimentos
            </a>
            <a href="#faq" className="transition hover:opacity-70">
              Perguntas
            </a>
            <a href="/quem-somos" className="transition hover:opacity-70">
              Quem somos
            </a>
            <a href="#contato" className="transition hover:opacity-70">
              Contato
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#formulario"
              style={{ backgroundColor: BRAND.terracotta }}
              className="hidden rounded-xl px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-95 lg:inline-block lg:text-sm"
            >
              💝 CRIAR MINHA MÚSICA
            </a>

            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#D8D4CE] bg-white text-[#0B2454] shadow-sm lg:hidden"
            >
              <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-black/5 px-4 py-4 lg:hidden" style={{ backgroundColor: BRAND.cream }}>
            <nav className="flex flex-col gap-3 text-sm font-semibold text-[#0B2454]">
              <a
                href="#planos"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  document.getElementById("planos")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Como funciona
              </a>
              <a
                href="#musicas"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Ouça nossas músicas
              </a>
              <a
                href="#depoimentos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Depoimentos
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Perguntas
              </a>
              <a
                href="/quem-somos"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Quem somos
              </a>
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]"
              >
                Contato
              </a>
              <a
                href="#formulario"
                onClick={() => setMobileMenuOpen(false)}
                style={{ backgroundColor: BRAND.terracotta }}
                className="mt-2 rounded-xl px-4 py-3 text-center text-sm font-bold text-white shadow-sm"
              >
                💝 CRIAR MINHA MÚSICA
              </a>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
        <div className="mx-auto grid max-w-7xl items-start gap-5 px-4 py-5 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-8">
          <div className="flex flex-col justify-start pt-1 lg:min-h-[400px] lg:pt-6">
            <div className="mx-auto max-w-[340px] text-center sm:max-w-[520px] lg:mx-0 lg:max-w-2xl lg:text-left">
              <h1 className="mx-auto max-w-[340px] text-[31px] font-black leading-[1.02] tracking-[-0.04em] sm:max-w-[520px] sm:text-[36px] lg:mx-0 lg:min-h-[170px] lg:max-w-[600px] lg:text-[44px]" style={{ color: BRAND.text, opacity: 0.85 }}>
                {activeHeroSlide.title}
              </h1>

              <p className="mx-auto mt-3 max-w-[340px] text-[15px] font-medium leading-[1.55] sm:max-w-[520px] sm:text-[16px] lg:mx-0 lg:min-h-[96px] lg:max-w-[680px] lg:text-[20px]" style={{ color: BRAND.muted, opacity: 0.75 }}>
                {activeHeroSlide.description}
              </p>

              <div className="hidden mt-7 min-h-[92px] flex-wrap gap-3 text-[14px] font-semibold lg:flex lg:gap-4 lg:text-[15px]" style={{ color: BRAND.terracottaDark }}>
                {activeHeroSlide.pills.map((pill) => (
                  <span
                    key={pill}
                    className="flex h-[58px] w-[160px] items-center justify-center rounded-[18px] border px-3 text-center leading-tight shadow-sm lg:h-[62px] lg:w-[170px]"
                    style={{ backgroundColor: BRAND.terracottaSoft, borderColor: "rgba(201,79,54,0.14)" }}
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

          <div className="flex items-start justify-end pt-0 lg:min-h-[430px] lg:pt-6">
            <div className="relative h-[260px] w-full max-w-[600px] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.10)] sm:h-[320px] lg:h-[375px] lg:rounded-[34px]" style={{ backgroundColor: BRAND.terracottaSoft }}>
              <img
                src={activeHeroSlide.image}
                alt={activeHeroSlide.imageAlt}
                className="h-full w-full object-cover object-[center_60%] transition-opacity duration-700 lg:object-center"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/5" style={{ backgroundColor: BRAND.warmBg }}>
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-10 lg:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <a
                href="#formulario"
                style={{
                  backgroundColor: BRAND.terracotta,
                  boxShadow: "0 14px 34px rgba(201,79,54,0.22)",
                }}
                className="order-2 inline-flex min-h-[68px] items-center justify-center rounded-[18px] px-8 text-[18px] font-black text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-xl lg:order-none lg:min-w-[400px] lg:px-10 lg:text-[20px]"
              >
                {activeHeroSlide.cta}
              </a>

              <div className="order-1 grid gap-4 lg:order-none lg:flex lg:items-center lg:gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-[26px]"
                    style={{ backgroundColor: BRAND.terracottaSoft, color: BRAND.terracottaDark }}
                  >
                    ⭐
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none lg:text-[20px]" style={{ color: BRAND.navy }}>
                      100% Personalizada
                    </p>
                    <p className="mt-2 text-[15px] leading-none lg:text-[16px]" style={{ color: BRAND.muted }}>
                      Do seu jeito
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-[26px]"
                    style={{ backgroundColor: BRAND.terracottaSoft, color: BRAND.terracottaDark }}
                  >
                    ⚡
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none lg:text-[20px]" style={{ color: BRAND.navy }}>
                      Entrega Rápida
                    </p>
                    <p className="mt-2 text-[15px] leading-none lg:text-[16px]" style={{ color: BRAND.muted }}>
                      Até 48h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-[26px]"
                    style={{ backgroundColor: BRAND.terracottaSoft, color: BRAND.terracottaDark }}
                  >
                    💝
                  </div>
                  <div>
                    <p className="text-[18px] font-black leading-none lg:text-[20px]" style={{ color: BRAND.navy }}>
                      Presente Inesquecível
                    </p>
                    <p className="mt-2 text-[15px] leading-none lg:text-[16px]" style={{ color: BRAND.muted }}>
                      Emociona de verdade
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="scroll-mt-24 pt-3 pb-8 lg:scroll-mt-24" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-3 lg:px-10">
          <div className="text-center">
            <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] sm:text-3x1 lg:text-4xl" style={{ color: BRAND.navy }}>
              ✨ Como criamos a sua música surpresa ✨
            </h2>
          </div>

          <div className="mt-10 w-full">
            {plans
              .filter((plan) => plan.name === "Música Surpresa")
              .map((plan) => (
                <div
                  key={plan.name}
                  className="relative flex flex-col gap-2 rounded-[20px] border px-2 py-3 lg:px-100 lg:flex-row lg:items-center lg:justify-between"
                  style={{ backgroundColor: plan.bg, borderColor: plan.border }}
                >
                  <div className="flex items-center gap-4 lg:w-[290px] lg:flex-shrink-0 pl-4 lg:pl-6">
                    <div
                      className="flex h-20 w-20 items-center justify-center rounded-full text-5xl text-white"
                      style={{ backgroundColor: plan.color }}
                    >
                      {plan.icon}
                    </div>
                    <h3
                      className="text-4xl font-black leading-[0.9] tracking-[-0.04em] lg:text-[36px]"
                      style={{ color: plan.color }}
                    >
                      {plan.name.split(" ")[0]}
                      <br />
                      {plan.name.split(" ").slice(1).join(" ")}
                    </h3>
                  </div>

<div className="lg:flex-10 lg:min-w-0 lg:pr-8">
  <p className="text-sm leading-7" style={{ color: BRAND.muted }}>{plan.subtitle}</p>

  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 text-sm font-medium text-[#374151] lg:grid-cols-3">
    {plan.features.map((item, index) => (
      <li key={item} className="flex items-start gap-2 min-w-10">
        <span style={{ color: plan.color }}>
          {plan.name === "Música Surpresa" || index === 0 ? "✓" : "+"}
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>

<div className="mt-4 lg:mt-3">
  <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E8DDD2] bg-white/60 text-center shadow-sm lg:hidden">
    <div className="flex flex-col items-center justify-start gap-2 px-2 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE7DD] text-lg">🔒</span>
      <span className="text-[11px] font-bold leading-tight text-[#5B6474]">Pagamento<br />seguro</span>
    </div>

    <div className="flex flex-col items-center justify-start gap-2 border-x border-[#E8DDD2] px-2 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE7DD] text-lg">💳</span>
      <span className="text-[11px] font-bold leading-tight text-[#5B6474]">Parcele<br />em até 12x</span>
    </div>

    <div className="flex flex-col items-center justify-start gap-2 px-2 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FCE7DD] text-lg">✨</span>
      <span className="text-[11px] font-bold leading-tight text-[#5B6474]">Satisfação<br />garantida</span>
    </div>
  </div>

  <div className="hidden text-sm font-semibold leading-6 text-[#6B7280] lg:block">
    🔒 Pagamento 100% seguro • Parcele em até 12x • Satisfação garantida
  </div>
</div>
</div>
                  <div className="flex flex-col items-center gap-3 pr-0 text-center lg:items-end lg:pr-6 lg:text-right lg:w-[220px] lg:flex-shrink-0">
                    <div
                      className="mt-4 text-4xl font-black tracking-[0.03em] whitespace-nowrap text-center lg:text-right"
                      style={{ color: plan.color }}
                    >
                      {plan.price}
                    </div>

                    <a
                      href="#formulario"
                      onClick={(e) => {
                        e.preventDefault();

                        const selectedPlan = `${plan.name} — ${plan.price}`;
                        sessionStorage.setItem("selectedPlan", selectedPlan);
                        setFormData((prev) => ({ ...prev, plan: selectedPlan }));

                        setTimeout(() => {
                          const element = document.getElementById("formulario");
                          if (!element) return;

                          const headerOffset = 110;
                          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                          const offsetPosition = elementPosition - headerOffset;

                          window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                        }, 0);
                      }}
                      className={`mt-2 flex w-full min-w-[200px] items-center justify-center rounded-xl px-3 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 lg:mt-0 lg:ml-auto lg:w-auto ${
                        plan.featured ? "shadow-lg" : "shadow-sm"
                      }`}
                      style={{ backgroundColor: plan.color }}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="scroll-mt-30 pt-0 pb-4 lg:scroll-mt-20 lg:pt-4 lg:pb-10" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:mt-8 lg:text-4xl" style={{ color: BRAND.navy }}>
              É simples, rápido e feito com muito carinho
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[24px] border border-[#E8DDD2] bg-white/55 px-5 py-6 text-center shadow-sm lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-[0_10px_24px_rgba(178,79,54,0.14)] ring-1 ring-[#F3D6C8] lg:h-20 lg:w-20 lg:rounded-full lg:text-3xl"
                  style={{ backgroundColor: "#FFF1EA", color: step.color }}
                >
                  {step.icon}
                </div>
                <h3 className="mt-4 text-base font-black leading-tight lg:mt-7 lg:text-lg" style={{ color: BRAND.navy }}>
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 lg:mt-3 lg:leading-7" style={{ color: BRAND.muted }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="musicas" className="scroll-mt-24 pt-8 pb-8 lg:scroll-mt-10 lg:py-20" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-9">
          <div className="text-center">
            <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:mt-3 lg:text-4xl" style={{ color: BRAND.navy }}>
              ✨Músicas criadas para emocionar✨
            </h2>
            <p className="mx-auto mt-3 max-w-4xl text-[15px] leading-7 text-[#4B5563] lg:mt-4 lg:text-base">
              Ouça músicas criadas por nós e comprove a qualidade, emoção e cuidado com cada pedido
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-7xl rounded-[28px] border p-3 shadow-sm lg:mt-10 lg:p-7" style={{ backgroundColor: BRAND.cream, borderColor: BRAND.terracottaSoft }}>
            <audio
              ref={audioRef}
              src={demoSongs[currentSongIndex].audio}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="mb-3 text-[11px] font-bold tracking-[0.14em] text-[#B24F36] lg:hidden text-center">
              Ouça algumas de nossas músicas
            </div>

            <div className="grid grid-cols-2 gap-3 px-1 pb-3 lg:grid-cols-5 lg:gap-4 lg:px-0 lg:pb-2">
              {visibleDemoSongs.map((song, index) => {
                const isActive = song.songIndex === currentSongIndex;

                return (
                  <button
                    key={`${song.title}-${song.songIndex}`}
                    type="button"
                    onClick={() => handleSelectSong(song.songIndex)}
                    className={`flex min-h-[166px] flex-col justify-between rounded-[20px] border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md lg:min-h-[178px] lg:rounded-[22px] lg:p-5 ${isActive ? "shadow-lg lg:scale-[1.03]" : "shadow-sm"}`}
                    style={{
                      backgroundColor: isActive ? '#FFF1EA' : '#FFFFFF',
                      borderColor: isActive ? BRAND.terracotta : BRAND.terracottaSoft,
                      transformOrigin: 'center',
                    }}
                  >
                    <div>

                      <h3 className="mt-4 text-base font-black leading-tight tracking-[-0.03em] lg:mt-5 lg:text-xl" style={{ color: BRAND.navy }}>
                        {song.title}
                      </h3>

                      <p className="mt-2 text-xs font-semibold leading-5 lg:mt-3 lg:text-sm lg:leading-6" style={{ color: BRAND.muted }}>
                        {song.occasion}
                      </p>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-2 border-t pt-3 lg:mt-5 lg:gap-3 lg:pt-4" style={{ borderColor: BRAND.terracottaSoft }}>
                      <div>
                        <span className="block text-[11px] font-bold leading-4 lg:text-xs lg:leading-5" style={{ color: BRAND.terracotta }}>
                          {song.style}
                        </span>
                        <span className="mt-1 block text-[9px] font-semibold tracking-[0.04em]" style={{ color: isActive ? BRAND.terracotta : BRAND.muted }}>
                          {isActive ? "Tocando" : "Ouvir"}
                        </span>
                      </div>
                      <span
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white transition-all duration-300 lg:h-10 lg:w-10 lg:text-sm"
                        style={{ backgroundColor: isActive ? BRAND.terracotta : '#9CA3AF' }}
                      >
                        {isActive && isPlaying ? "Ⅱ" : "▶"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </section>
<section id="depoimentos" className="scroll-mt-24 py-12 lg:scroll-mt-14 lg:py-20" style={{ backgroundColor: BRAND.terracotta }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracottaSoft }}>
              Depoimentos
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:mt-3 lg:text-4xl">
              Histórias reais, <span style={{ color: BRAND.terracottaSoft }}>emoções verdadeiras</span>
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[22px] bg-white px-6 py-5 shadow-lg lg:p-6">
                <p className="text-sm leading-6 text-[#374151] lg:text-base lg:leading-8">“{item.quote}”</p>
                <div className="mt-4 border-t border-black/5 pt-3">
                  <p className="text-[15px] font-bold text-[#0B2454]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.city}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: BRAND.terracotta }}>
                    {item.role}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: BRAND.terracotta }}>★★★★★</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="formulario" className="scroll-mt-24 py-10 lg:py-14" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="w-full overflow-hidden rounded-[12px] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <img
              src={slide11}
              alt="Pessoas em um momento especial"
              className="h-[500px] w-full object-cover object-left lg:h-[520px] lg:object-[center_35%]"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>
              Comece agora
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl" style={{ color: BRAND.navy }}>
              Conte sua história e criamos sua música
            </h2>

            <p className="mt-4 text-base leading-7" style={{ color: BRAND.muted }}>
              Preencha os dados iniciais abaixo para começarmos sua música.
            </p>

            <div className="mt-5 hidden flex-wrap gap-3 text-sm font-semibold lg:flex" style={{ color: BRAND.terracottaDark }}>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>Resposta Rápida</span>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>Atendimento Humanizado</span>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>100% Personalizado</span>
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
                value={formatWhatsapp(formData.whatsapp)}
                onChange={handleFormChange}
                inputMode="tel"
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none"
                placeholder="WhatsApp com DDD"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                inputMode="email"
                className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
                placeholder="E-mail"
              />


              <div className="rounded-xl border border-[#E8DDD2] bg-[#F8F5F1] px-4 py-3 text-sm font-semibold text-[#0B2454] sm:col-span-2">
                {formData.plan}
              </div>
              <input type="hidden" name="plan" value={formData.plan} />
            </div>

            <button
              type="button"
              onClick={handleContinueToMusicForm}
              style={{
                backgroundColor: BRAND.terracotta,
                boxShadow: "0 10px 22px rgba(169,98,96,0.18)",
              }}
              className="mt-6 w-full rounded-xl px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-[0_14px_28px_rgba(169,98,96,0.24)]"
            >
              💝 CRIAR MINHA MÚSICA
            </button>

            <p className="mt-4 text-center text-sm text-[#6B7280]">
              Ao continuar, você iniciará a criação da sua música 😉
            </p>
          </div>
        </div>

      </section>
      <section id="faq" className="scroll-mt-24 pt-2 pb-16 lg:scroll-mt-16 lg:pt-10" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>
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
                    <h3 className="text-lg font-bold" style={{ color: BRAND.navy }}>{faq.q}</h3>
                    <span className="text-xl font-bold" style={{ color: BRAND.terracotta }}>{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#F1E7DD] px-5 pb-5 pt-4">
                      <p className="text-sm leading-7" style={{ color: BRAND.muted }}>{faq.a}</p>
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
  aria-label="Atendimento WhatsApp"
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
    <span className="block">Atendimento</span>
    <span className="block">WhatsApp</span>
  </span>
</button>
      <footer id="contato" className="scroll-mt-24 py-14 text-white lg:scroll-mt-32" style={{ backgroundColor: BRAND.terracotta }}>
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
              Transformamos sentimentos, histórias e gratidão em músicas exclusivas que emocionam e marcam para sempre.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracottaSoft }}>
              Institucional
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li><a href="/quem-somos" className="transition hover:text-white">Quem somos</a></li>
              <li>Site 100% seguro</li>
              <li>Parcele em até 12x</li>
              <li>Satisfação garantida</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracottaSoft }}>
              Atendimento
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>Entrega em até 48h</li>
              <li>Suporte humanizado</li>
              <li>Pedidos personalizados</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracottaSoft }}>
              Fale conosco
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li>(11) 94078-7078</li>
              <li>contato@musicasurpresa.com.br</li>
              <li>Instagram: @musicasurpresa.br</li>
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
