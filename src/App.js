import { useEffect, useMemo, useState } from "react";
import UpsellPage from "./pages/UpsellPage";
import AboutPage from "./pages/AboutPage";
import MusicFormPage from "./pages/MusicFormPage";
import Termos from "./pages/Termos";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import HomePage from "./pages/HomePage";
import MusicaDeAmorPage from "./pages/MusicaDeAmorPage";
import MusicaParaMaesPage from "./pages/MusicaParaMaesPage";
import useScrollToHash from "./hooks/useScrollToHash";

export default function App() {
  const [paymentCheckMessage, setPaymentCheckMessage] = useState(
    "Consultando o status do pagamento automaticamente..."
  );
  const [paymentCheckAttempts, setPaymentCheckAttempts] = useState(0);

  const pathname = window.location.pathname;

  const isUpsellRoute = pathname === "/upsell";
  const isAboutRoute = pathname === "/quem-somos";
  const isTermsRoute = pathname === "/termos";
  const isMusicFormRoute = pathname === "/criar-musica";
  const isMusicaDeAmorRoute = pathname === "/musica-de-amor";
  const isMusicaParaMaesRoute = pathname === "/musica-para-maes";
  const isPaymentSuccessRoute = pathname === "/pagamento/sucesso";
  const isPaymentPendingRoute = pathname === "/pagamento/pendente";
  const isPaymentErrorRoute = pathname === "/pagamento/erro";

  useScrollToHash(pathname);

  useEffect(() => {
    if (!isPaymentPendingRoute) return;

    const params = new URLSearchParams(window.location.search);
    const rawPaymentId = params.get("payment_id") || params.get("collection_id");
    const paymentId = /^\d{1,20}$/.test(rawPaymentId || "") ? rawPaymentId : null;

    if (!paymentId) {
      setPaymentCheckMessage(
        "Não encontramos o código do pagamento para consulta automática. Você pode aguardar alguns instantes ou falar com nosso atendimento."
      );
      return;
    }

    let attempts = 0;
    let stopped = false;
    let timeoutId;

    const checkPaymentStatus = async () => {
      if (stopped) return;

      attempts += 1;
      setPaymentCheckAttempts(attempts);
      setPaymentCheckMessage(`Verificando confirmação do pagamento... tentativa ${attempts}.`);

      try {
        const response = await fetch(
          `/api/mercado-pago/payment-status?payment_id=${encodeURIComponent(paymentId)}`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setPaymentCheckMessage("Pagamento confirmado. Redirecionando...");
          window.location.href = `/pagamento/sucesso?payment_id=${encodeURIComponent(paymentId)}`;
          return;
        }

        if (["rejected", "cancelled", "refunded", "charged_back"].includes(data.status)) {
          setPaymentCheckMessage("Não conseguimos confirmar o pagamento. Redirecionando...");
          window.location.href = `/pagamento/erro?payment_id=${encodeURIComponent(paymentId)}&status=${encodeURIComponent(data.status)}`;
          return;
        }

        if (attempts >= 24) {
          setPaymentCheckMessage(
            "Ainda estamos aguardando a confirmação do pagamento. Se você pagou por Pix, normalmente isso se resolve em poucos minutos."
          );
          return;
        }
      } catch (error) {
        console.error("Erro ao consultar status do pagamento");
        setPaymentCheckMessage(
          "Não foi possível consultar o status agora. Vamos tentar novamente em alguns instantes."
        );
      }

      timeoutId = setTimeout(checkPaymentStatus, 5000);
    };

    checkPaymentStatus();

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }, [isPaymentPendingRoute]);

  const upsellParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    let draft = null;

    try {
      const stored = sessionStorage.getItem("musicOrderDraft");
      if (stored) draft = JSON.parse(stored);
    } catch (error) {
      console.error("Erro ao ler sessionStorage");
    }

    return {
      orderId: draft?.orderId || "",
      customerId: draft?.customerId || "",
      customerName: draft?.name || "",
      recipient: draft?.recipient || "Pessoa especial",
      email: draft?.email || "",
      whatsapp: draft?.whatsapp || "",
      occasion: draft?.occasion || "Ocasião especial",
      style: draft?.style || "Personalizado",
      relationship: draft?.relationship || "",
      description: draft?.description || "",
      message: draft?.message || "",
      moments: draft?.moments || "",
      specialPhrase: draft?.specialPhrase || "",
      voiceType: draft?.voiceType || "",
      observations: draft?.observations || "",
      plan: draft?.plan || params.get("plano") || "Música Surpresa — R$ 125,00",
    };
  }, []);

  const createMercadoPagoCheckout = async (plan) => {
    const formattedPlanTitle = plan.price
      ? `${plan.name} — R$ ${Number(plan.price).toFixed(2).replace(".", ",")}`
      : plan.name;

    const response = await fetch("/api/mercado-pago/create-preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        title: formattedPlanTitle,
        unitPrice: plan.price,
        quantity: 1,
        orderId: upsellParams.orderId,
        customerId: upsellParams.customerId,
        customer: {
          name: upsellParams.customerName,
          email: upsellParams.email,
          whatsapp: upsellParams.whatsapp,
        },
        briefing: {
          recipient: upsellParams.recipient,
          relationship: upsellParams.relationship,
          occasion: upsellParams.occasion,
          description: upsellParams.description,
          message: upsellParams.message,
          moments: upsellParams.moments,
          specialPhrase: upsellParams.specialPhrase,
          style: upsellParams.style,
          voiceType: upsellParams.voiceType,
          observations: upsellParams.observations,
        },
      }),
    });

    if (!response.ok) throw new Error("Erro ao criar preferência de pagamento.");

    const data = await response.json();
    if (!data.init_point) throw new Error("Checkout Mercado Pago não retornou init_point.");

    return data.init_point;
  };

  if (isMusicFormRoute) return <MusicFormPage />;

  if (isMusicaDeAmorRoute) return <MusicaDeAmorPage />;

  if (isMusicaParaMaesRoute) return <MusicaParaMaesPage />;

  if (isUpsellRoute) {
    const hasLead = !!sessionStorage.getItem("musicOrderLead");
    let hasValidDraft = false;
    try {
      const raw = sessionStorage.getItem("musicOrderDraft");
      if (raw) {
        const draft = JSON.parse(raw);
        hasValidDraft = !!draft.orderId;
      }
    } catch (_) {}
    if (!hasLead && !hasValidDraft) {
      window.location.replace("/");
      return null;
    }

    return (
      <UpsellPage
        customer={{
          recipient: upsellParams.recipient,
          occasion: upsellParams.occasion,
          style: upsellParams.style,
        }}
        initialPlanId="musica-surpresa"
        onContinueToPayment={async (plan) => {
          try {
            const checkoutUrl = await createMercadoPagoCheckout(plan);
            window.location.href = checkoutUrl;
          } catch (error) {
            console.error("Erro ao iniciar checkout");
            alert("Não foi possível iniciar o pagamento agora. Tente novamente em instantes.");
          }
        }}
      />
    );
  }

  if (isAboutRoute) return <AboutPage />;
  if (isTermsRoute) return <Termos />;

  if (isPaymentSuccessRoute) return <PaymentStatusPage type="success" />;

  if (isPaymentPendingRoute) {
    return (
      <PaymentStatusPage
        type="pending"
        paymentCheckMessage={paymentCheckMessage}
        paymentCheckAttempts={paymentCheckAttempts}
      />
    );
  }

  if (isPaymentErrorRoute) return <PaymentStatusPage type="error" />;

  return <HomePage />;
}
