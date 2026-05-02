export default function Footer({ BRAND, logoMusicaSurpresa }) {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="scroll-mt-24 py-14 text-white lg:scroll-mt-32"
      style={{ backgroundColor: BRAND.terracotta }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-4 lg:px-10">
        <div>
          {logoMusicaSurpresa ? (
            <div className="flex items-center">
              <img
                src={logoMusicaSurpresa}
                alt="Música Surpresa"
                className="h-14 w-auto brightness-0 invert lg:h-16"
              />
            </div>
          ) : (
            <p className="text-xl font-black tracking-[-0.03em] text-white">
              Música Surpresa
            </p>
          )}

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
            <li><a href="/termos" className="transition hover:text-white">Termos de Serviço</a></li>
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
        © {year} Música Surpresa. Todos os direitos reservados.
      </div>
    </footer>
  );
}