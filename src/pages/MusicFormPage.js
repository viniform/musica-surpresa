import React, { useState } from "react";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.png";

export default function MusicFormPage() {
  let lead = {};

  try {
    const storedLead = sessionStorage.getItem("musicOrderLead");
    if (storedLead) lead = JSON.parse(storedLead);
  } catch (error) {
    console.error("Erro ao ler dados do mini formulário", error);
  }

  const selectedPlan = lead.plan || sessionStorage.getItem("selectedPlan") || "Música Surpresa — R$ 125,00";

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    // salva dados no sessionStorage
    sessionStorage.setItem("musicOrderDraft", JSON.stringify({ ...form, plan: selectedPlan }));

    // redireciona para upsell
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
              Responda algumas perguntas para que possamos transformar sua história em uma música única, emocionante e feita sob medida.
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
    />
  </div>

  <div>
    <label className="block text-sm font-bold mb-2">📖 Observações adicionais</label>
    <textarea
      placeholder="Qualquer detalhe importante"
      value={form.observations}
      onChange={(e) => handleChange("observations", e.target.value)}
      className="w-full min-h-[120px] rounded-xl border border-[#E8DDD2] px-4 py-3 text-sm"
    />
  </div>

  <button
    type="button"
    onClick={handleSubmit}
    className="mt-4 rounded-xl bg-[#B45D5D] px-6 py-4 text-sm font-bold text-white"
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
