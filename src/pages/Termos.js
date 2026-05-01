import logoMusicaSurpresa from "../assets/Logo_Musica_Surpresa.webp";
export default function Termos() {
  return (
    <div className="min-h-screen bg-[#F2EEE9] text-[#1E1E1E]">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 lg:px-10 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={logoMusicaSurpresa} alt="Música Surpresa" className="h-8 w-auto" />
          </a>
          <a
            href="/"
            className="text-sm font-semibold bg-[#F25757] text-white px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Voltar para o site
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-14 lg:px-10">
        <section className="rounded-[28px] bg-white p-6 shadow-sm lg:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F25757]">
            Termos de Serviço
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#0B2454] sm:text-4xl lg:text-5xl">
            Termos de Serviço | Música Surpresa
          </h1>

          <p className="mt-4 text-sm text-[#6B7280]">
            Última atualização: 29 de abril de 2026
          </p>

          <div className="mt-8 space-y-8 text-base leading-8 text-[#374151]">
            
            <div>
              <h2 className="font-bold text-[#0B2454]">1. Sobre o serviço</h2>
              <p>
                A Música Surpresa oferece a criação de músicas personalizadas a partir de histórias fornecidas pelo cliente, combinando tecnologia de inteligência artificial com direção criativa e refinamento humano.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">2. Como funciona</h2>
              <p>
                O cliente fornece informações como nomes, contexto e história. A partir disso, desenvolvemos uma composição personalizada, com ajustes internos para garantir qualidade, conforme o plano contratado.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">3. Natureza do resultado</h2>
              <p>
                Por se tratar de um processo criativo, não garantimos preferência subjetiva. O resultado final depende diretamente das informações fornecidas e pode apresentar variações de estilo e interpretação.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">4. Uso de tecnologia</h2>
              <p>
                Utilizamos inteligência artificial como parte do processo criativo, aliada à curadoria humana. Ainda assim, podem ocorrer pequenas variações como pronúncia, interpretação ou nuances musicais.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">5. Revisões</h2>
              <p>
                Revisões podem estar incluídas conforme o plano contratado. Alterações estruturais podem exigir nova produção e não garantimos revisões ilimitadas.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">6. Prazos</h2>
              <p>
                Os prazos variam conforme o plano, podendo ser impactados por demanda, ajustes ou informações incompletas.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">7. Pagamento</h2>
              <p>
                O pagamento é realizado antecipadamente. Após confirmação, o pedido entra em produção.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">8. Cancelamento e reembolso</h2>
              <p>
                Por se tratar de produto personalizado, não oferecemos reembolso após início da produção, exceto em casos de erro técnico comprovado.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">9. Direitos de uso</h2>
              <p>
                O cliente pode compartilhar e utilizar a música para fins pessoais. Não garantimos elegibilidade para monetização em plataformas digitais.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">10. Responsabilidade</h2>
              <p>
                O cliente é responsável pelas informações fornecidas e por garantir que não violam direitos de terceiros.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">11. Limitação de responsabilidade</h2>
              <p>
                Não nos responsabilizamos por expectativas subjetivas, uso indevido do material ou restrições em plataformas externas.
              </p>
            </div>

            <div>
              <h2 className="font-bold text-[#0B2454]">12. Contato</h2>
              <p>
                Para suporte: contato@musicasurpresa.com.br
              </p>
            </div>

          </div>
        </section>
        <div className="mt-6 flex justify-center">
          <a
            href="/"
            className="bg-[#F25757] text-white px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition"
          >
            Voltar para o site
          </a>
        </div>
      </main>
      <footer className="mt-16 bg-[#0B2454] text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 lg:px-10 text-sm">
          <p className="opacity-80">
            © {new Date().getFullYear()} Música Surpresa. Todos os direitos reservados.
          </p>
          <div className="mt-4 flex gap-4">
            <a href="/termos" className="hover:underline">Termos de Serviço</a>
            <a href="/" className="hover:underline">Página inicial</a>
          </div>
        </div>
      </footer>
    </div>
  );
}