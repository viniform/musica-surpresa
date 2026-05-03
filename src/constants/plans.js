// ============================================================
//  REFERÊNCIA CENTRAL DE PLANOS — Música Surpresa
//  Para alterar preços, edite APENAS este arquivo.
//
//  price     → preço atual (exibido em destaque)
//  priceFrom → preço cheio (exibido sobretachado acima)
//  hasDiscount → controla se o sobretachado aparece na UI
// ============================================================

export const PLANS = [
  {
    id: "musica-surpresa",
    name: "Música Surpresa",
    price: 99,
    priceFrom: 199,
    hasDiscount: true,
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
    priceFrom: 249,
    hasDiscount: true,
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
    price: 199,
    priceFrom: 299,
    hasDiscount: true,
    badge: "Experiência premium",
    description:
      "A experiência mais completa: música com letra em retrospectiva com fotos personalizadas.",
    features: [
      "Música Surpresa com letra na tela",
      "Retrospectiva com até 30 fotos",
      "Edição de vídeo mais completa",
      "Entrega premium",
    ],
    helper: "Perfeito para datas especiais, festas, aniversários, bodas e homenagens.",
  },
];

// Plano padrão selecionado ao entrar no site
export const DEFAULT_PLAN = PLANS[0];

// Formata valor numérico para exibição: 99 → "R$ 99,00"
export function formatPlanPrice(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Retorna a string de label usada em sessionStorage/planTitle
// Ex: "Música Surpresa — R$ 99,00"
export function formatPlanLabel(plan) {
  return `${plan.name} — ${formatPlanPrice(plan.price)}`;
}
