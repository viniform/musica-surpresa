import React, { useState, useEffect } from "react";
import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.webp";
import imagemHistoria from "../assets/Quem_Somos_02.webp";

const BRAND = {
  cream: "#FFF8F3",
  navy: "#0B2454",
  terracotta: "#B95336",
  terracottaSoft: "#F4C7B8",
};

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "Quem Somos — Música Surpresa";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Somos músicos profissionais com mais de 20 anos de experiência, criando músicas personalizadas exclusivas para momentos inesquecíveis.");
    return () => {
      document.title = "Música Surpresa";
      if (desc) desc.setAttribute("content", "Crie uma música personalizada exclusiva como presente inesquecível para mães, pais, namorados e momentos especiais. Entrega em até 48h.");
    };
  }, []);

  const goToHomeSection = (sectionId) => {
    setMobileMenuOpen(false);
    window.location.href = `/#${sectionId}`;
  };

  return (
    <div>
      <header className="sticky top-0 z-50 border-b backdrop-blur-md" style={{ backgroundColor: BRAND.cream, borderColor: "rgba(0,0,0,0.05)" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-10">
          <a
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center"
            aria-label="Voltar para a página inicial"
          >
            <img
              src={logoMusicaSurpresa}
              alt="Música Surpresa"
              className="h-14 w-auto lg:h-16"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex" style={{ color: BRAND.navy }}>
            <button type="button" onClick={() => goToHomeSection("o-que-e")} className="transition hover:opacity-70">
              O que é?
            </button>
            <button type="button" onClick={() => goToHomeSection("como-funciona")} className="transition hover:opacity-70">
              Como funciona
            </button>
            <button type="button" onClick={() => goToHomeSection("musicas")} className="transition hover:opacity-70">
              Ouça músicas
            </button>
            <button type="button" onClick={() => goToHomeSection("depoimentos")} className="transition hover:opacity-70">
              Depoimentos
            </button>
            <button type="button" onClick={() => goToHomeSection("planos")} className="transition hover:opacity-70">
              Planos
            </button>
            <button type="button" onClick={() => goToHomeSection("faq")} className="transition hover:opacity-70">
              Perguntas
            </button>
            <a href="/quem-somos" className="transition hover:opacity-70">
              Quem somos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToHomeSection("formulario")}
              style={{ backgroundColor: BRAND.terracotta }}
              className="hidden rounded-xl px-5 py-3 text-xs font-bold text-white shadow-sm transition hover:opacity-95 lg:inline-block lg:text-sm"
            >
              💝 CRIAR MÚSICA
            </button>

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
          <div className="border-t border-black/5 px-4 py-4 lg:hidden" style={{ backgroundColor: BRAND.cream }}>
            <nav className="flex flex-col gap-3 text-sm font-semibold text-[#0B2454]">
              <button type="button" onClick={() => goToHomeSection("o-que-e")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                O que é?
              </button>
              <button type="button" onClick={() => goToHomeSection("como-funciona")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                Como funciona
              </button>
              <button type="button" onClick={() => goToHomeSection("musicas")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                Ouça músicas
              </button>
              <button type="button" onClick={() => goToHomeSection("depoimentos")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                Depoimentos
              </button>
              <button type="button" onClick={() => goToHomeSection("planos")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                Planos
              </button>
              <button type="button" onClick={() => goToHomeSection("faq")} className="rounded-lg px-2 py-2 text-left transition hover:bg-[#FCE7DD]">
                Perguntas
              </button>
              <a href="/quem-somos" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-2 py-2 transition hover:bg-[#FCE7DD]">
                Quem somos
              </a>
              <button type="button" onClick={() => goToHomeSection("formulario")} style={{ backgroundColor: BRAND.terracotta }} className="mt-2 rounded-xl px-4 py-3 text-center text-sm font-bold text-white shadow-sm">
                💝 CRIAR MÚSICA
              </button>
            </nav>
          </div>
        )}
      </header>

      <div className="px-6 py-6 lg:px-12">
        <section className="mx-auto max-w-6xl text-center">
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] transition-all duration-500 lg:max-w-none lg:text-5xl lg:whitespace-nowrap">
            Música feita por quem <span style={{ color: BRAND.terracotta }}>vive música</span> de verdade
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-600 lg:max-w-none lg:text-lg lg:whitespace-nowrap">
            Somos músicos profissionais com mais de 20 anos de experiência, transformando histórias reais em músicas únicas e emocionantes.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3 lg:items-center">

            <div className="lg:col-span-1">
              <img
                loading="lazy"
                src={imagemHistoria}
                alt="História através da música"
                className="w-full rounded-3xl object-cover shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              />
            </div>

            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black">Nossa História</h2>
              <p className="mt-4 text-gray-600 leading-7">
                Vivemos a música há mais de duas décadas nos palcos, nos estúdios e em produções musicais.
                Ao longo dessa trajetória, aprendemos que a música tem um poder único: <strong>transformar sentimentos em algo que permanece para sempre</strong>.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 text-center shadow-sm lg:col-span-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <p className="text-5xl font-black" style={{ color: BRAND.terracotta }}>
                +20
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                anos de experiência
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Estúdios, Palcos e Produções Musicais
              </p>
            </div>

          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl rounded-3xl px-6 py-6 text-center lg:px-12" style={{ backgroundColor: BRAND.terracotta }}>

          <h2 className="mt-2 text-3xl font-black leading-tight text-white lg:text-4xl">
            Algumas histórias não cabem em palavras,
            <br />
            <span style={{ color: "#FFE5DB" }}>
              mas cabem em uma música.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-white/90 lg:max-w-none lg:text-base lg:whitespace-nowrap">
            Criamos músicas que transformam sentimentos reais em algo que pode ser ouvido, sentido e lembrado para sempre.
          </p>
        </section>

        <section className="mx-auto mt-8 max-w-6xl grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-black">🎯 Missão</h3>
            <p className="mt-3 text-sm text-gray-600">
              Transformar histórias reais em músicas únicas que emocionam e eternizam momentos.
            </p>
          </div>

          <div className="rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-black">🔭 Visão</h3>
            <p className="mt-3 text-sm text-gray-600">
              Ser referência no Brasil em músicas personalizadas, com emoção genuína e qualidade profissional.
            </p>
          </div>

          <div className="rounded-xl border p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-black">📜Valores</h3>
            <p className="mt-3 text-sm text-gray-600">
              Emoção, autenticidade, excelência musical e respeito pela história de cada cliente.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-6xl">
          <h2 className="text-3xl font-black text-center">Nossos diferenciais</h2>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">🏢</p>
              <h3 className="mt-3 font-black">Empresa com CNPJ</h3>
              <p className="mt-2 text-sm text-gray-600">
                Estrutura profissional para garantir segurança e confiança
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">🎤</p>
              <h3 className="mt-3 font-black">Músicos profissionais</h3>
              <p className="mt-2 text-sm text-gray-600">
                Projetos conduzidos por quem vive música de verdade
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">⏳</p>
              <h3 className="mt-3 font-black">+20 anos de experiência</h3>
              <p className="mt-2 text-sm text-gray-600">
                Vivência real em estúdios, palcos e produções
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">🎧</p>
              <h3 className="mt-3 font-black">Qualidade artística</h3>
              <p className="mt-2 text-sm text-gray-600">
                Cada música é construída com cuidado e sensibilidade
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">💻</p>
              <h3 className="mt-3 font-black">Humano + Tecnologia</h3>
              <p className="mt-2 text-sm text-gray-600">
                Uso de tecnologia com curadoria musical para garantir emoção e autenticidade
              </p>
            </div>

            <div className="rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:scale-[1.02]">
              <p className="text-3xl">💝</p>
              <h3 className="mt-3 font-black">Experiência emocional</h3>
              <p className="mt-2 text-sm text-gray-600">
                Cada música é pensada para criar um momento único e inesquecível
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-4xl text-center">
          <button
            type="button"
            onClick={() => goToHomeSection("formulario")}
            className="mt-6 rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
            style={{ backgroundColor: BRAND.terracotta }}
          >
            💝 CRIAR MÚSICA
          </button>
        </section>
      </div>
    </div>
  );
}