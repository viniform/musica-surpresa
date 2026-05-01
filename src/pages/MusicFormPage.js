import React, { useEffect, useState } from "react";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.webp";

const FIELD_LIMITS = {
  name: 80,
  email: 120,
  whatsapp: 11,
  recipient: 80,
  relationship: 50,
  occasion: 50,
  description: 1200,
  message: 800,
  moments: 1200,
  specialPhrase: 250,
  style: 60,
  voiceType: 40,
  observations: 800,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const whatsappRegex = /^\d{10,11}$/;

export default function MusicFormPage() {
  let lead = {};

  try {
    const storedLead = sessionStorage.getItem("musicOrderLead");
    if (storedLead) lead = JSON.parse(storedLead);
  } catch (error) {
    console.error("Erro ao ler dados do mini formulário");
  }

  const selectedPlan = lead.plan || sessionStorage.getItem("selectedPlan") || "Música Surpresa — R$ 125,00";

  const GOOGLE_SHEETS_WEBHOOK_URL = process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || "";

  const syncToSheet = async (payload, options = {}) => {
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
      console.error("Erro ao sincronizar formulário");
    }
  };

  const [form, setForm] = useState({
    orderId: lead.orderId || "",
    customerId: lead.customerId || "",
    name: lead.name || "",
    email: lead.email || "",
    whatsapp: lead.whatsapp || "",
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
  });

  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const storedLead = sessionStorage.getItem("musicOrderLead");
    if (!storedLead) return;

    try {
      const leadData = JSON.parse(storedLead);
      if (!leadData.orderId) return;

      const startedKey = `musicFormStarted:${leadData.orderId}`;
      if (sessionStorage.getItem(startedKey) === "true") return;
      sessionStorage.setItem(startedKey, "true");

      const startedPayload = {
        orderId: leadData.orderId,
        customerId: leadData.customerId,
        stage: "formulario_iniciado",
        paymentId: "",
        paymentStatus: "",
        paymentStatusDetail: "",
        paymentMethod: "",
        planId: leadData.planId || "",
        planTitle: leadData.planTitle || leadData.plan || selectedPlan,
        customerName: leadData.customerName || leadData.name || "",
        email: leadData.email || "",
        whatsapp: leadData.whatsapp || "",
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
        amount: leadData.amount || "",
        externalReference: leadData.externalReference || leadData.orderId,
      };

      sessionStorage.setItem("musicOrderDraft", JSON.stringify({
        orderId: startedPayload.orderId,
        customerId: startedPayload.customerId,
        plan: startedPayload.planTitle,
        planId: startedPayload.planId,
      }));

      syncToSheet(startedPayload);
    } catch (error) {
      console.error("Erro ao sincronizar início do formulário");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field, value) => {
    const limit = FIELD_LIMITS[field];
    const normalizedValue = field === "whatsapp"
      ? value.replace(/\D/g, "").slice(0, FIELD_LIMITS.whatsapp)
      : limit
        ? value.slice(0, limit)
        : value;

    setForm((current) => ({ ...current, [field]: normalizedValue }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Informe seu nome";
    if (!form.email) newErrors.email = "Informe seu e-mail";
    if (!form.whatsapp) newErrors.whatsapp = "Informe seu WhatsApp";
    if (!form.recipient) newErrors.recipient = "Informe para quem é a música";
    if (!form.relationship) newErrors.relationship = "Informe sua relação com a pessoa homenageada";
    if (!form.occasion) newErrors.occasion = "Informe a ocasião";
    if (!form.description) newErrors.description = "Descreva a pessoa homenageada";
    if (!form.message) newErrors.message = "Informe a mensagem principal da música";
    if (!form.moments) newErrors.moments = "Conte ao menos um momento marcante";
    if (!form.style) newErrors.style = "Informe o estilo ou ritmo desejado";
    if (!acceptedTerms) newErrors.acceptedTerms = "Você precisa aceitar os Termos de Serviço para continuar";

    if (form.email && !emailRegex.test(form.email.trim())) {
      newErrors.email = "Informe um e-mail válido";
    }

    const whatsappDigits = form.whatsapp.replace(/\D/g, "");
    if (form.whatsapp && !whatsappRegex.test(whatsappDigits)) {
      newErrors.whatsapp = "Informe um WhatsApp válido com DDD";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      orderId: form.orderId,
      customerId: form.customerId,
      stage: "formulario_completo",
      paymentId: "",
      paymentStatus: "",
      paymentStatusDetail: "",
      paymentMethod: "",
      planId: lead.planId || "",
      planTitle: selectedPlan,
      customerName: form.name,
      email: form.email,
      whatsapp: form.whatsapp,
      recipient: form.recipient,
      relationship: form.relationship,
      occasion: form.occasion,
      description: form.description,
      message: form.message,
      moments: form.moments,
      specialPhrase: form.specialPhrase,
      style: form.style,
      voiceType: form.voiceType,
      observations: form.observations,
      amount: lead.amount || "",
      externalReference: form.orderId,
    };


    await syncToSheet(payload, { preferBeacon: false });

    sessionStorage.removeItem("musicOrderLead");

    sessionStorage.setItem(
      "musicOrderDraft",
      JSON.stringify({
        orderId: payload.orderId,
        customerId: payload.customerId,
        plan: payload.planTitle,
        planId: payload.planId,
        recipient: payload.recipient,
        occasion: payload.occasion,
        style: payload.style,
      })
    );


    window.location.href = "/upsell";
  };

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
            Conte sua história 🎵
          </div>
        </div>
      </header>

      <main className="min-h-screen bg-[#FFF8F3] px-4 py-8 text-[#0B2454] lg:px-8">
        <div className="mx-auto max-w-4xl">
          <section className="rounded-[28px] border border-[#E8DDD2] bg-white p-6 shadow-sm lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B45D5D]">
              Pedido personalizado
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] lg:text-4xl">
              Vamos criar a sua Música Surpresa
            </h1>
            <p className="mt-4 text-base leading-7 text-[#5B6474]">
              Responda algumas perguntas para que possamos transformar sua história em uma música única!
            </p>
          </section>

          <section className="mt-6 rounded-[28px] border border-[#E8DDD2] bg-white p-6 shadow-sm lg:p-10">
            <div className="grid gap-6">

  <div>
    <label className="block text-sm font-bold mb-2">Seu nome</label>
    <input
      type="text"
      placeholder="Seu nome"
      value={form.name}
      onChange={(e) => handleChange("name", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.name}
    />
    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">WhatsApp com DDD</label>
    <input
      type="tel"
      placeholder="Ex: 11999999999"
      value={form.whatsapp}
      onChange={(e) => handleChange("whatsapp", e.target.value)}
      maxLength={FIELD_LIMITS.whatsapp}
      inputMode="numeric"
      pattern="[0-9]*"
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
    />
    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">Seu e-mail</label>
    <input
      type="email"
      placeholder="seu@email.com"
      value={form.email}
      onChange={(e) => handleChange("email", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.email}
    />
    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">🎁 Para quem é a música?</label>
    <input
      type="text"
      placeholder="Ex: minha mãe, meu namorado, minha família..."
      value={form.recipient}
      onChange={(e) => handleChange("recipient", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.recipient}
    />
    {errors.recipient && <p className="text-red-500 text-xs mt-1">{errors.recipient}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">🤝 Qual a sua relação com essa(s) pessoa(s)?</label>
    <input
      type="text"
      placeholder="Ex: filho, namorado, amiga, esposa..."
      value={form.relationship}
      onChange={(e) => handleChange("relationship", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.relationship}
    />
    {errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">🎉 Trata-se de uma comemoração, uma ocasião especial?</label>
    <input
      type="text"
      placeholder="Ex: aniversário, casamento, Dia das Mães..."
      value={form.occasion}
      onChange={(e) => handleChange("occasion", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.occasion}
    />
    {errors.occasion && <p className="text-red-500 text-xs mt-1">{errors.occasion}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">✍️ Como você descreveria essa pessoa?</label>
    <textarea
      placeholder="Fale sobre personalidade, qualidades e detalhes importantes"
      value={form.description}
      onChange={(e) => handleChange("description", e.target.value)}
      className="w-full min-h-[120px] rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.description}
    />
    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">❤️ Qual mensagem você quer transmitir?</label>
    <textarea
      placeholder="Amor, gratidão, saudade, reconhecimento..."
      value={form.message}
      onChange={(e) => handleChange("message", e.target.value)}
      className="w-full min-h-[120px] rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.message}
    />
    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">📖 Momentos marcantes</label>
    <textarea
      placeholder="Conte histórias, memórias ou situações especiais"
      value={form.moments}
      onChange={(e) => handleChange("moments", e.target.value)}
      className="w-full min-h-[120px] rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.moments}
    />
    {errors.moments && <p className="text-red-500 text-xs mt-1">{errors.moments}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">✨ Frases ou apelidos especiais</label>
    <input
      type="text"
      placeholder="Ex: apelidos, bordões..."
      value={form.specialPhrase}
      onChange={(e) => handleChange("specialPhrase", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.specialPhrase}
    />
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">🎵 Estilo musical</label>
    <input
      type="text"
      placeholder="MPB, sertanejo, pop, reggae..."
      value={form.style}
      onChange={(e) => handleChange("style", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.style}
    />
    {errors.style && <p className="text-red-500 text-xs mt-1">{errors.style}</p>}
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">🎤 Tipo de voz</label>
    <input
      type="text"
      placeholder="Feminina, masculina, dueto..."
      value={form.voiceType}
      onChange={(e) => handleChange("voiceType", e.target.value)}
      className="w-full rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.voiceType}
    />
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">📖 Observações adicionais</label>
    <textarea
      placeholder="Qualquer detalhe importante"
      value={form.observations}
      onChange={(e) => handleChange("observations", e.target.value)}
      className="w-full min-h-[120px] rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
      maxLength={FIELD_LIMITS.observations}
    />
  </div>

  <div className="mt-4 rounded-2xl border border-[#E8DDD2] bg-[#FFF8F3] p-4">
    <label className="flex items-center justify-center gap-3 text-sm leading-6 text-[#5B6474] text-center">
      <input
        type="checkbox"
        checked={acceptedTerms}
        onChange={(e) => setAcceptedTerms(e.target.checked)}
        className="h-4 w-4 rounded border-[#B45D5D] text-[#B45D5D]"
      />
      <span>
        Li e concordo com os{" "}
        <a
          href="/termos"
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#B45D5D] underline underline-offset-2"
        >
          Termos de Serviço
        </a>{" "}
        da Música Surpresa.
      </span>
    </label>
    {!acceptedTerms && errors.acceptedTerms && (
      <p className="mt-3 text-center text-xs text-red-500">{errors.acceptedTerms}</p>
    )}
  </div>

  <button
    type="button"
    onClick={() => {
      handleSubmit();
    }}
    className={`mt-4 rounded-xl px-6 py-4 text-sm font-bold text-white transition ${
      acceptedTerms ? "bg-[#B45D5D] hover:bg-[#9F4F4F]" : "cursor-not-allowed bg-[#B45D5D]/50"
    }`}
  >
    Criar minha música
  </button>

</div>
          </section>
        </div>
      </main>
    </>
  );
}
