const FALLBACK_GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzXbDgNcrSpT64w3BgHUqY2Q-FElEhq8QJ44i9FqEHbKQ7hZWmYhvsUH7YjJluNVPZomQ/exec";

function getMetadataValue(metadata, keys, fallback = "") {
  if (!metadata || typeof metadata !== "object") return fallback;

  for (const key of keys) {
    if (metadata[key] !== undefined && metadata[key] !== null && metadata[key] !== "") {
      return metadata[key];
    }
  }

  return fallback;
}

function stringifyValue(value) {
  if (value === undefined || value === null) return "";
  return String(value);
}

function normalizePaymentStage(status) {
  if (status === "approved") return "payment_approved";
  return `payment_${status}`;
}

function normalizePlanTitle(planTitle, planId) {
  if (planTitle) return planTitle;

  const titlesByPlanId = {
    "musica-surpresa": "Música Surpresa",
    "musica-surpresa-audio": "Música Surpresa - Áudio",
    "musica-surpresa-video": "Música Surpresa - Vídeo",
  };

  return titlesByPlanId[planId] || "";
}

async function sendToGoogleSheets(data, env) {
  const GOOGLE_SHEETS_WEBHOOK_URL = env.GOOGLE_SHEETS_WEBHOOK_URL || env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || FALLBACK_GOOGLE_SHEETS_WEBHOOK_URL;

  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao enviar para Google Sheets:", error);
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    const paymentId = body?.data?.id || body?.id;
    const eventType = body?.type || body?.action || "unknown";

    if (!paymentId) {
      return Response.json(
        {
          received: true,
          ignored: true,
          reason: "Webhook sem paymentId.",
          eventType,
        },
        { status: 200 }
      );
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.log("Pagamento não encontrado ou não processável:", {
        paymentId,
        eventType,
        status: paymentResponse.status,
        payment,
      });

      return Response.json(
        {
          received: true,
          processed: false,
          ignored: true,
          reason: "Pagamento não encontrado ou não processável.",
          paymentId,
          eventType,
        },
        { status: 200 }
      );
    }

    const metadata = payment.metadata || {};

    const orderId = stringifyValue(
      getMetadataValue(metadata, ["orderId", "order_id"], payment.external_reference || "")
    );
    const customerId = stringifyValue(getMetadataValue(metadata, ["customerId", "customer_id"]));
    const planId = stringifyValue(getMetadataValue(metadata, ["planId", "plan_id"]));
    const rawPlanTitle = stringifyValue(getMetadataValue(metadata, ["planTitle", "plan_title", "plan"]));
    const planTitle = normalizePlanTitle(rawPlanTitle, planId);

    const result = {
      orderId,
      customerId,
      paymentId: stringifyValue(payment.id),
      paymentStatus: stringifyValue(payment.status),
      paymentStatusDetail: stringifyValue(payment.status_detail),
      paymentMethod: stringifyValue(payment.payment_type_id || payment.payment_method_id || ""),
      externalReference: stringifyValue(payment.external_reference || orderId),
      metadata,
      transactionAmount: payment.transaction_amount,
      payerEmail: stringifyValue(payment.payer?.email),
      eventType,
    };

    const paymentStatusesToRegister = [
      "approved",
      "pending",
      "rejected",
      "cancelled",
      "refunded",
      "charged_back",
    ];

    if (paymentStatusesToRegister.includes(result.paymentStatus)) {
      console.log("Pagamento recebido para registro:", result);

      const approvedDate = payment.date_approved || payment.date_created || new Date().toISOString();
      const dateSaoPaulo = new Date(approvedDate).toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      await sendToGoogleSheets(
        {
          orderId: result.orderId,
          customerId: result.customerId,
          stage: normalizePaymentStage(result.paymentStatus),
          paymentId: result.paymentId,
          paymentStatus: result.paymentStatus,
          paymentStatusDetail: result.paymentStatusDetail || "",
          paymentMethod: result.paymentMethod || "",
          planId,
          planTitle,
          customerName: stringifyValue(getMetadataValue(metadata, ["customerName", "customer_name", "name"])),
          email: stringifyValue(getMetadataValue(metadata, ["email", "customerEmail", "customer_email"], result.payerEmail)),
          whatsapp: stringifyValue(getMetadataValue(metadata, ["whatsapp", "phone", "customerPhone", "customer_phone"])),
          recipient: stringifyValue(getMetadataValue(metadata, ["recipient"])),
          relationship: stringifyValue(getMetadataValue(metadata, ["relationship"])),
          occasion: stringifyValue(getMetadataValue(metadata, ["occasion"])),
          description: stringifyValue(getMetadataValue(metadata, ["description"])),
          message: stringifyValue(getMetadataValue(metadata, ["message"])),
          moments: stringifyValue(getMetadataValue(metadata, ["moments"])),
          specialPhrase: stringifyValue(getMetadataValue(metadata, ["specialPhrase", "special_phrase"])),
          style: stringifyValue(getMetadataValue(metadata, ["style"])),
          voiceType: stringifyValue(getMetadataValue(metadata, ["voiceType", "voice_type"])),
          observations: stringifyValue(getMetadataValue(metadata, ["observations"])),
          amount: result.transactionAmount || "",
          externalReference: result.externalReference,
          eventType,
          eventKey: `${result.orderId}:${result.paymentId}:${result.paymentStatus}`,
          date: dateSaoPaulo,
        },
        env
      );
    } else {
      console.log("Pagamento recebido com status não registrado:", result);
    }

    return Response.json(
      {
        received: true,
        processed: true,
        payment: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);

    return Response.json(
      {
        received: false,
        error: "Erro interno ao processar webhook.",
      },
      { status: 500 }
    );
  }
}

export async function onRequestGet() {
  return Response.json(
    {
      ok: true,
      message: "Webhook Mercado Pago ativo.",
    },
    { status: 200 }
  );
}