import imagemHeroMaes from "../assets/Imagem_Index_Dia_das_Maes_01.webp";
import imagemFormMaes from "../assets/Imagem_Index_Dia_das_Maes_02.webp";
import imagemMae from "../assets/Imagem_Index_Dia_das_Maes_01.webp";
import whatsappIcon from "../assets/whatsapp_icon.png";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.webp";
import { useRef, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { BRAND, WHATSAPP_NUMBER } from "../constants/brand";
import { DEFAULT_PLAN, formatPlanLabel, formatPlanPrice } from "../constants/plans";
import { formatWhatsapp, normalizeEmail, normalizeName, normalizeWhatsapp } from "../utils/formatters";
import { isValidEmail } from "../utils/validators";
import { generateOrderId, buildCustomerId } from "../utils/orderHelpers";
import { syncLeadToSheet } from "../services/googleSheets";

export default function MusicaParaMaesPage() {
  const [openFaq, setOpenFaq] = useState(-1);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    plan: formatPlanLabel(DEFAULT_PLAN),
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "whatsapp") {
      setFormData((prev) => ({ ...prev, [name]: normalizeWhatsapp(value) }));
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
      console.error("Erro ao recuperar orderId");
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
      planId: "musica-surpresa",
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
      orderId: leadPayload.orderId,
      customerId: leadPayload.customerId,
      name: leadPayload.customerName,
      email: leadPayload.email,
      whatsapp: leadPayload.whatsapp,
      plan: formData.plan,
      planId: leadPayload.planId,
    }));
    sessionStorage.setItem("selectedPlan", formData.plan);

    await syncLeadToSheet(leadPayload);
    window.location.href = "/criar-musica";
  };

  const handleQuickWhatsApp = () => {
    const message = "Olá! Quero criar uma música personalizada em homenagem à minha mãe e gostaria de saber mais.";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 110;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  const demoSongs = [
    { title: "Café na Cozinha", occasion: "Homenagem para a Mãe", style: "MPB Pop", audio: "/audio/Homenagem_Dia_das_Maes_Demonstracao_Musica_Surpresa.mp3" },
    { title: "Porto Seguro", occasion: "De Namorada para Namorado", style: "Pop Romântico", audio: "/audio/Homenagem_Namorados_Demonstracao_Musica_Surpresa.mp3" },
    { title: "Meu Lugar", occasion: "Homenagem de Amigo para Amiga", style: "Pop R&B", audio: "/audio/Homenagem_Amigos_Demonstracao_Musica_Surpresa.mp3" },
    { title: "Nossa Base", occasion: "Homenagem para o Pai", style: "MPB", audio: "/audio/Homenagem_Dia_dos_Pais_Demonstracao_Musica_Surpresa.mp3" },
  ];

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        audioRef.current.src = demoSongs[currentSongIndex].audio;
        audioRef.current.load();
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (songIndex) => {
    if (!audioRef.current) return;
    if (songIndex === currentSongIndex) {
      if (!audioRef.current.src) {
        audioRef.current.src = demoSongs[songIndex].audio;
        audioRef.current.load();
      }
      handlePlayPause();
      return;
    }
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.src = demoSongs[songIndex].audio;
    audioRef.current.load();
    setCurrentSongIndex(songIndex);
    setTimeout(() => {
      audioRef.current.play();
      setIsPlaying(true);
    }, 0);
  };

  const testimonials = [
    {
      name: "Fernanda R.",
      city: "São Paulo - SP",
      context: "Presenteou a mãe no Dia das Mães",
      quote: "Minha mãe chorou do início ao fim. A letra citava o nome dela, a cidade onde a gente morou e até um apelido que só eu uso. Foi o presente mais especial que já dei na vida.",
      role: "Música para a mãe",
    },
    {
      name: "Lucas M.",
      city: "Belo Horizonte - MG",
      context: "Encomendou uma homenagem de aniversário para a mãe",
      quote: "Ela sempre falou que não precisava de nada, mas quando ouviu a música, não conseguiu segurar o choro. Valeu cada centavo — foi a primeira vez que vi minha mãe tão emocionada.",
      role: "Homenagem de aniversário",
    },
    {
      name: "Camila S.",
      city: "Curitiba - PR",
      context: "Criou uma música em homenagem à avó",
      quote: "Encomendei para a minha avó, que criou minha mãe sozinha. A equipe colocou a história das duas na letra. Foi lindo demais. As duas choraram juntas ouvindo. Não tem preço.",
      role: "Homenagem à avó",
    },
  ];

  const faqs = [
    {
      q: "A letra vai ter o nome da minha mãe?",
      a: "Sim! A letra é criada com o nome dela, memórias que vocês compartilham, frases carinhosas e tudo que você nos contar. É uma música que só existe para ela.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "As músicas são entregues em até 24 horas. Se tiver urgência, entre em contato e tentamos encaixar.",
    },
    {
      q: "Posso escolher o estilo musical?",
      a: "Sim! No formulário você indica o estilo — MPB, pop, sertanejo, gospel, romântico... A melodia será criada de acordo com o que você preferir e com o gosto da sua mãe.",
    },
    {
      q: "Como vou receber a música?",
      a: "Você recebe o arquivo MP3 diretamente pelo WhatsApp, pronto para ouvir e compartilhar. Dependendo do plano, também entregamos um vídeo com a letra.",
    },
  ];

  const planPrice = formatPlanPrice(DEFAULT_PLAN.price);
  const planPriceFrom = DEFAULT_PLAN.hasDiscount ? formatPlanPrice(DEFAULT_PLAN.priceFrom) : null;

  return (
    <div id="topo" className="min-h-screen" style={{ backgroundColor: BRAND.warmBg, color: BRAND.text }}>

      <Header logoMusicaSurpresa={logoMusicaSurpresa} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: BRAND.cream }}>
        <div className="mx-auto grid max-w-7xl items-start gap-5 px-4 py-5 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-8">
          <div className="flex flex-col justify-start pt-1 lg:min-h-[400px] lg:pt-6">
            <div className="mx-auto max-w-[340px] text-center sm:max-w-[520px] lg:mx-0 lg:max-w-2xl lg:text-left">
              <p className="text-sm font-bold uppercase tracking-[0.18em] mb-3" style={{ color: BRAND.terracotta }}>
                Música Personalizada para Mães
              </p>
              <h1 className="text-[31px] font-black leading-[1.02] tracking-[-0.04em] sm:text-[36px] lg:text-[44px]" style={{ color: BRAND.text, opacity: 0.85 }}>
                Uma música em homenagem à sua mãe{" "}
                <span style={{ color: BRAND.terracotta }}>criada com a história de vocês</span>
              </h1>
              <p className="mt-4 text-[15px] font-medium leading-[1.6] sm:text-[16px] lg:text-[19px]" style={{ color: BRAND.muted }}>
                A letra cita o nome dela, as memórias que vocês viveram, as frases que só ela fala ... Não é uma música qualquer — é a música dela, feita pra ela ✨
              </p>
              <div className="hidden mt-7 flex-wrap gap-3 text-[14px] font-semibold lg:flex lg:gap-4 lg:text-[15px]" style={{ color: BRAND.terracottaDark }}>
                {["Letra com\no nome dela", "Melodia\nexclusiva", "Entrega\nem até 24h"].map((pill) => (
                  <span key={pill} className="flex h-[58px] w-[160px] items-center justify-center rounded-[18px] border px-3 text-center leading-tight shadow-sm lg:h-[62px] lg:w-[170px]" style={{ backgroundColor: BRAND.terracottaSoft, borderColor: "rgba(201,79,54,0.14)" }}>
                    <span className="flex flex-col items-center justify-center leading-tight">
                      {pill.split("\n").map((line, i) => <span key={i} className="block">{line}</span>)}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-start justify-end pt-0 lg:min-h-[430px] lg:pt-6">
            <div className="relative aspect-[4/3] w-full max-w-[600px] overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.10)] lg:rounded-[34px]" style={{ backgroundColor: BRAND.terracottaSoft }}>
              <img
                fetchpriority="high"
                src={imagemHeroMaes}
                alt="Mãe emocionada ouvindo música personalizada em sua homenagem"
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-black/5" style={{ backgroundColor: BRAND.warmBg }}>
          <div className="mx-auto max-w-7xl px-4 py-6 lg:px-10 lg:py-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <a
                href="#formulario"
                style={{ backgroundColor: BRAND.terracotta, boxShadow: "0 14px 34px rgba(201,79,54,0.22)" }}
                className="order-2 inline-flex min-h-[68px] items-center justify-center rounded-[18px] px-8 text-[15px] font-black text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-xl lg:order-none lg:min-w-[400px] lg:px-10 lg:text-[16px]"
              >
                <span aria-hidden="true">💐 </span>CRIAR MÚSICA PARA MINHA MÃE
              </a>
              <div className="order-1 grid gap-4 lg:order-none lg:flex lg:items-center lg:gap-6">
                {[
                  { icon: "💐", title: "Com o nome dela", sub: "na letra, de verdade" },
                  { icon: "🎵", title: "Melodia inédita", sub: "criada só para ela" },
                  { icon: "⚡", title: "Entrega rápida", sub: "em menos de 24h" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full text-[26px]" style={{ backgroundColor: BRAND.terracottaSoft, color: BRAND.terracottaDark }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[18px] font-black leading-none lg:text-[20px]" style={{ color: BRAND.navy }}>{item.title}</p>
                      <p className="mt-2 text-[15px] leading-none lg:text-[16px]" style={{ color: BRAND.muted }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── O QUE TORNA ÚNICA ── */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>
              Não é qualquer presente
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ color: BRAND.navy }}>
              A letra fala sobre a história da sua mãe
            </h2>
            <p className="mt-4 mx-auto text-sm leading-7" style={{ color: BRAND.muted }}>
              Não é uma playlist. Não é uma música genérica sobre mães. É uma canção inédita onde a letra cita quem ela é — pelo nome, pelas memórias, pelas frases que só ela fala.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {[
              { icon: "💬", title: "O nome dela\nna letra", text: "A música cita o nome da sua mãe, tornando cada verso inconfundível e exclusivo para ela." },
              { icon: "🕰️", title: "As memórias\nde vocês", text: "Você nos conta os momentos especiais e eles viram versos. A história dela transformada em canção." },
              { icon: "✍️", title: "As frases que\nsó ela fala", text: "Aquele conselho dela, a expressão favorita, o jeito carinhoso de chamar você — tudo pode entrar na letra." },
              { icon: "🎶", title: "Melodia criada\ndo zero", text: "Não é cover, não é remix. Letra e melodia compostas exclusivamente para ela, com qualidade profissional." },
            ].map((card) => (
              <div key={card.title} className="flex flex-col items-center text-center rounded-[24px] border border-[#E8DDD2] bg-white px-6 py-8 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full text-2xl mb-4" style={{ backgroundColor: BRAND.terracottaSoft }}>
                  {card.icon}
                </div>
                <h3 className="text-base font-black mb-3 whitespace-pre-line" style={{ color: BRAND.navy }}>{card.title}</h3>
                <p className="text-sm leading-6" style={{ color: BRAND.muted }}>{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>Para qualquer momento</p>
              <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ color: BRAND.navy }}>
                A música certa para homenagear sua mãe
              </h2>
              <p className="mt-4 text-base leading-7" style={{ color: BRAND.muted }}>
                Seja no Dia das Mães, no aniversário dela, ou em qualquer dia especial — uma música personalizada diz tudo o que você sente mas às vezes não sabe como expressar em palavras.
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  { icon: "💐", label: "Dia das Mães inesquecível" },
                  { icon: "🎂", label: "Aniversário da mãe" },
                  { icon: "👵", label: "Homenagem à avó" },
                  { icon: "💌", label: "Declaração de amor e gratidão" },
                  { icon: "🙏", label: "Agradecimento por tudo que ela fez" },
                  { icon: "🌸", label: "Surpresa sem motivo especial" },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base" style={{ backgroundColor: BRAND.terracottaSoft }}>{item.icon}</span>
                    <span className="text-sm font-semibold" style={{ color: BRAND.navy }}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.10)]">
              <img
                loading="lazy"
                src={imagemMae}
                alt="Mãe emocionada ao receber música personalizada como presente"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-12 lg:py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>É simples assim</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ color: BRAND.navy }}>
              Como criamos a música para a sua mãe
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              { icon: "✍️", title: "Você conta sobre ela", text: "Quem é sua mãe, o que ela significa para você, as memórias especiais e o que quer expressar com a música.", step: "1" },
              { icon: "🎵", title: "Criamos a letra", text: "Nossa equipe escreve os versos com o nome dela, as memórias de vocês e as frases carinhosas que você nos contou.", step: "2" },
              { icon: "🎧", title: "Produzimos a música", text: "A melodia é composta e gravada com qualidade profissional no estilo que você escolher.", step: "3" },
              { icon: "💐", title: "Você recebe o arquivo", text: "MP3 pronto para ouvir, compartilhar ou presentear — entregue em até 24h pelo WhatsApp.", step: "4" },
            ].map((step) => (
              <div key={step.step} className="rounded-[24px] border border-[#E8DDD2] bg-white/55 px-5 py-6 text-center shadow-sm lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-[0_10px_24px_rgba(178,79,54,0.14)] ring-1 ring-[#F3D6C8] lg:h-20 lg:w-20 lg:rounded-full lg:text-3xl" style={{ backgroundColor: "#FFF1EA", color: BRAND.terracotta }}>
                  {step.icon}
                </div>
                <h3 className="mt-4 text-base font-black leading-tight lg:mt-7 lg:text-lg" style={{ color: BRAND.navy }}>{step.step}. {step.title}</h3>
                <p className="mt-2 text-sm leading-6 lg:mt-3 lg:leading-7" style={{ color: BRAND.muted }}>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <a
              href="#formulario"
              style={{ backgroundColor: BRAND.terracotta, boxShadow: "0 14px 34px rgba(201,79,54,0.22)" }}
              className="inline-flex min-h-[60px] items-center justify-center rounded-[18px] px-10 text-[17px] font-black text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95"
            >
              <span aria-hidden="true">💐 </span>CRIAR MÚSICA PARA MINHA MÃE
            </a>
          </div>
        </div>
      </section>

      {/* ── PLAYER DEMOS ── */}
      <section id="musicas" className="pb-12 pt-4 lg:pb-16 lg:pt-8" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-9">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black leading-tight tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ color: BRAND.navy }}>
              ✨ Ouça músicas que criamos ✨
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[#4B5563] lg:text-base">
              Cada uma foi feita do zero para uma pessoa real — com nome, história e emoção na letra
            </p>
          </div>
          <div className="mx-auto rounded-[28px] border p-3 shadow-sm lg:p-7" style={{ backgroundColor: BRAND.cream, borderColor: BRAND.terracottaSoft }}>
            <audio ref={audioRef} preload="none" onEnded={() => setIsPlaying(false)} />
            <div className="grid grid-cols-2 gap-3 px-1 pb-3 lg:grid-cols-4 lg:gap-4 lg:px-0 lg:pb-2">
              {demoSongs.map((song, songIndex) => {
                const isActive = songIndex === currentSongIndex;
                return (
                  <button
                    key={`${song.title}-${songIndex}`}
                    type="button"
                    onClick={() => handleSelectSong(songIndex)}
                    aria-label={`${isActive && isPlaying ? "Pausar" : "Ouvir"} a música ${song.title} — ${song.occasion}`}
                    aria-pressed={isActive}
                    className={`flex min-h-[166px] flex-col justify-between rounded-[20px] border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md lg:min-h-[178px] lg:rounded-[22px] lg:p-5 ${isActive ? "shadow-lg lg:scale-[1.03]" : "shadow-sm"}`}
                    style={{ backgroundColor: isActive ? "#FFF1EA" : "#FFFFFF", borderColor: isActive ? BRAND.terracotta : BRAND.terracottaSoft, transformOrigin: "center" }}
                  >
                    <div>
                      <h3 className="mt-4 text-base font-black leading-tight tracking-[-0.03em] lg:mt-5 lg:text-xl" style={{ color: BRAND.navy }}>{song.title}</h3>
                      <p className="mt-2 text-xs font-semibold leading-5 lg:mt-3 lg:text-sm lg:leading-6" style={{ color: BRAND.muted }}>{song.occasion}</p>
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-2 border-t pt-3 lg:mt-5 lg:gap-3 lg:pt-4" style={{ borderColor: BRAND.terracottaSoft }}>
                      <div>
                        <span className="block text-[11px] font-bold leading-4 lg:text-xs lg:leading-5" style={{ color: BRAND.terracotta }}>{song.style}</span>
                        <span className="mt-1 block text-[9px] font-semibold tracking-[0.04em]" style={{ color: isActive ? BRAND.terracotta : BRAND.muted }}>{isActive ? "Tocando" : "Ouvir"}</span>
                      </div>
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white transition-all duration-300 lg:h-10 lg:w-10 lg:text-sm" style={{ backgroundColor: isActive ? BRAND.terracotta : "#9CA3AF" }}>
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

      {/* ── DEPOIMENTOS ── */}
      <section id="depoimentos" className="py-12 lg:py-16" style={{ backgroundColor: BRAND.terracotta }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracottaSoft }}>Depoimentos</p>
            <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.03em] text-white sm:text-3xl lg:mt-3 lg:text-4xl">
              Músicas para mães que{" "}
              <span style={{ color: BRAND.terracottaSoft }}>emocionaram de verdade</span>
            </h2>
          </div>
          <div className="mt-8 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[22px] bg-white px-6 py-5 shadow-lg lg:p-6">
                <p className="mb-3 text-xs font-semibold italic" style={{ color: BRAND.terracotta }}>{item.context}</p>
                <p className="text-sm leading-6 text-[#374151] lg:text-base lg:leading-8">"{item.quote}"</p>
                <div className="mt-4 border-t border-black/5 pt-3">
                  <p className="text-[15px] font-bold text-[#0B2454]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.city}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: BRAND.terracotta }}>{item.role}</p>
                  <p className="mt-2 text-sm" style={{ color: BRAND.terracotta }}>★★★★★</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANO / PREÇO ── */}
      <section id="planos" className="py-12 lg:py-16" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-3 lg:px-10">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black tracking-[-0.03em] sm:text-3xl lg:text-4xl" style={{ color: BRAND.navy }}>
              ✨ Quanto custa criar a música para a sua mãe ✨
            </h2>
          </div>
          <div className="w-full">
            <div className="relative flex flex-col gap-2 rounded-[20px] border px-2 py-3 lg:flex-row lg:items-center lg:justify-between" style={{ backgroundColor: BRAND.cream, borderColor: BRAND.terracottaSoft }}>
              <div className="flex items-center gap-4 pl-4 lg:w-[240px] lg:flex-shrink-0 lg:pl-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-4xl text-white" style={{ backgroundColor: BRAND.terracotta }}>🎁</div>
                <h3 className="text-3xl font-black leading-[0.9] tracking-[-0.04em] lg:text-[32px]" style={{ color: BRAND.terracotta }}>
                  Música<br />Surpresa
                </h3>
              </div>
              <div className="lg:min-w-0 lg:flex-1 lg:pr-6">
                <p className="text-sm leading-6" style={{ color: BRAND.muted }}>
                  Música completa em homenagem à sua mãe, com letra e melodia exclusivas, criada com os detalhes que você nos contar.
                </p>
                <ul className="mt-3 grid grid-cols-3 gap-x-4 gap-y-3 text-sm font-medium text-[#374151]">
                  {["Letra com o nome dela", "Melodia exclusiva", "Arranjo profissional", "Entrega em até 24h", "Arquivo MP3 pronto"].map((item) => (
                    <li key={item} className="flex items-center gap-1.5 whitespace-nowrap">
                      <span style={{ color: BRAND.terracotta }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 hidden text-sm font-semibold leading-6 text-[#6B7280] lg:block">
                  🔒 Pagamento 100% seguro • Parcele em até 12x • Satisfação garantida
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 pr-0 text-center lg:w-[230px] lg:flex-shrink-0 lg:items-end lg:pr-6 lg:text-right">
                <div className="text-center lg:text-right">
                  {planPriceFrom && (
                    <p className="text-sm font-semibold text-[#9CA3AF] line-through">{planPriceFrom}</p>
                  )}
                  <p className="text-4xl font-black tracking-[0.03em] whitespace-nowrap" style={{ color: BRAND.terracotta }}>{planPrice}</p>
                </div>
                <a
                  href="#formulario"
                  onClick={(e) => {
                    e.preventDefault();
                    const selectedPlan = formatPlanLabel(DEFAULT_PLAN);
                    sessionStorage.setItem("selectedPlan", selectedPlan);
                    setFormData((prev) => ({ ...prev, plan: selectedPlan }));
                    setTimeout(() => scrollTo("formulario"), 0);
                  }}
                  className="flex w-full items-center justify-center rounded-xl px-4 py-3 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:opacity-95 whitespace-nowrap"
                  style={{ backgroundColor: BRAND.terracotta }}
                >
                  <span aria-hidden="true">💐 </span>&nbsp;CRIAR MÚSICA PARA A MÃE
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="formulario" className="scroll-mt-24 py-10 lg:py-14" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="w-full overflow-hidden rounded-[12px] shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
            <img
              loading="lazy"
              src={imagemFormMaes}
              alt="Mãe emocionada ao receber música personalizada como presente especial"
              className="h-[500px] w-full object-cover object-left lg:h-[520px] lg:object-[center_35%]"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>Comece agora</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl" style={{ color: BRAND.navy }}>
              Conte a história da sua mãe e a gente cria a música
            </h2>
            <p className="mt-4 text-base leading-7" style={{ color: BRAND.muted }}>
              Preencha seus dados para começar. No próximo passo você conta tudo sobre ela e o que quer expressar.
            </p>
            <div className="mt-5 hidden flex-wrap gap-3 text-sm font-semibold lg:flex" style={{ color: BRAND.terracottaDark }}>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>Letra com o nome dela</span>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>100% Exclusiva</span>
              <span className="rounded-full px-4 py-2" style={{ backgroundColor: BRAND.terracottaSoft }}>Entrega em até 24h</span>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label htmlFor="maes-name" className="sr-only">Seu nome</label>
              <input id="maes-name" name="name" value={formData.name} onChange={handleFormChange} className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none" placeholder="Seu nome" autoComplete="name" />
              <label htmlFor="maes-whatsapp" className="sr-only">WhatsApp com DDD</label>
              <input id="maes-whatsapp" name="whatsapp" value={formatWhatsapp(formData.whatsapp)} onChange={handleFormChange} inputMode="tel" className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none" placeholder="WhatsApp com DDD" autoComplete="tel" />
              <label htmlFor="maes-email" className="sr-only">E-mail</label>
              <input id="maes-email" type="email" name="email" value={formData.email} onChange={handleFormChange} inputMode="email" className="rounded-xl border border-[#E8DDD2] bg-white px-4 py-3 text-sm outline-none sm:col-span-2" placeholder="E-mail" autoComplete="email" />
              <div className="rounded-xl border border-[#E8DDD2] bg-[#F8F5F1] px-4 py-3 text-sm font-semibold text-[#0B2454] sm:col-span-2" aria-label={`Plano selecionado: ${formData.plan}`} role="status">
                {formData.plan}
              </div>
              <input type="hidden" name="plan" value={formData.plan} />
            </div>
            <button
              type="button"
              onClick={handleContinueToMusicForm}
              style={{ backgroundColor: BRAND.terracotta, boxShadow: "0 10px 22px rgba(169,98,96,0.18)" }}
              className="mt-6 w-full rounded-xl px-5 py-4 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:opacity-95 hover:shadow-[0_14px_28px_rgba(169,98,96,0.24)]"
            >
              <span aria-hidden="true">💐 </span>CRIAR MÚSICA PARA MINHA MÃE
            </button>
            <p className="mt-4 text-center text-sm text-[#6B7280]">
              Ao continuar, você iniciará a criação da música em homenagem à sua mãe 😉
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="pb-16 pt-4 lg:pt-10" style={{ backgroundColor: BRAND.warmBg }}>
        <div className="mx-auto max-w-7xl px-4 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: BRAND.terracotta }}>Dúvidas frequentes</p>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] sm:text-3xl" style={{ color: BRAND.navy }}>
              Perguntas sobre a música personalizada para mães
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.q} className="overflow-hidden rounded-2xl border border-[#ECE2D8] bg-white shadow-sm transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-maes-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  >
                    <h3 className="text-base font-bold lg:text-lg" style={{ color: BRAND.navy }}>{faq.q}</h3>
                    <span className="text-xl font-bold" aria-hidden="true" style={{ color: BRAND.terracotta }}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div id={`faq-maes-${index}`} role="region" aria-label={faq.q} className="border-t border-[#F1E7DD] px-5 pb-5 pt-4">
                      <p className="text-sm leading-7" style={{ color: BRAND.muted }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-14 lg:py-20" style={{ backgroundColor: BRAND.terracotta }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-black text-white sm:text-3xl lg:text-4xl">
            Transforme o amor pela sua mãe <br /> em música agora
          </h2>
          <p className="mt-4 text-base leading-7" style={{ color: BRAND.terracottaSoft }}>
            Uma letra com o nome dela, as memórias de vocês e uma melodia inédita. <br />Entregue em até 24 horas. Por apenas {planPrice}.
          </p>
          <a
            href="#formulario"
            className="mt-8 inline-flex min-h-[64px] items-center justify-center rounded-[18px] bg-white px-10 text-[17px] font-black transition-all duration-300 hover:scale-[1.01] hover:opacity-95"
            style={{ color: BRAND.terracotta }}
          >
            <span aria-hidden="true">💐 </span>CRIAR MÚSICA PARA MINHA MÃE
          </a>
          <p className="mt-5 text-sm font-semibold" style={{ color: BRAND.terracottaSoft }}>
            🔒 Pagamento seguro • Entrega em até 24h • Satisfação garantida
          </p>
        </div>
      </section>

      {/* ── WhatsApp flutuante ── */}
      <button
        type="button"
        onClick={handleQuickWhatsApp}
        aria-label="Atendimento WhatsApp"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center justify-center rounded-full bg-transparent p-0 text-white shadow-none transition-all duration-300 hover:scale-[1.03] sm:gap-2.5 sm:rounded-full sm:bg-[#38B73F] sm:px-3.5 sm:py-2.5 sm:shadow-[0_12px_26px_rgba(56,183,63,0.26)] sm:hover:shadow-[0_16px_34px_rgba(56,183,63,0.34)] lg:bottom-5 lg:right-5"
      >
        <span className="flex h-14 w-14 min-h-[56px] min-w-[56px] aspect-square shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[0_12px_26px_rgba(37,211,102,0.34)] sm:h-11 sm:w-11 sm:min-h-[44px] sm:min-w-[44px] sm:border-[2.5px] sm:border-white sm:bg-[#38B73F] sm:shadow-sm">
          <img src={whatsappIcon} alt="WhatsApp" className="h-[74%] w-[74%] object-contain sm:h-[72%] sm:w-[72%]" />
        </span>
        <span className="hidden text-left text-[13px] font-bold leading-[1.02] tracking-[-0.02em] sm:inline">
          <span className="block">Atendimento</span>
          <span className="block">WhatsApp</span>
        </span>
      </button>

      <Footer BRAND={BRAND} logoMusicaSurpresa={logoMusicaSurpresa} />
    </div>
  );
}
