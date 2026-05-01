import { useState } from "react";
import { BRAND } from "../../constants/brand";

export default function Header({ logoMusicaSurpresa }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerOffset = 110;
    const offsetPosition =
      element.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{ backgroundColor: BRAND.cream, borderColor: "rgba(0,0,0,0.05)" }}
    >
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

        <nav
          className="hidden items-center gap-8 text-sm font-semibold lg:flex"
          style={{ color: BRAND.navy }}
        >
          <a
            href="#planos"
            onClick={(e) => { e.preventDefault(); scrollTo("planos"); }}
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
        <div
          className="border-t border-black/5 px-4 py-4 lg:hidden"
          style={{ backgroundColor: BRAND.cream }}
        >
          <nav className="flex flex-col gap-3 text-sm font-semibold text-[#0B2454]">
            <a
              href="#planos"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                scrollTo("planos");
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
  );
}
