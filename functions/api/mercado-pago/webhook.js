async function sendToGoogleSheets(data) {
  const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbzXbDgNcrSpT64w3BgHUqY2Q-FElEhq8QJ44i9FqEHbKQ7hZWmYhvsUH7YjJluNVPZomQ/exec";

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

    const result = {
      orderId: payment.metadata?.orderId || payment.external_reference || "",
      customerId: payment.metadata?.customerId || "",
      paymentId: payment.id,
      paymentStatus: payment.status,
      paymentStatusDetail: payment.status_detail,
      paymentMethod: payment.payment_type_id || payment.payment_method_id || "",
      externalReference: payment.external_reference,
      metadata: payment.metadata || {},
      transactionAmount: payment.transaction_amount,
      payerEmail: payment.payer?.email,
      eventType,
    };

    if (["approved", "pending", "rejected", "cancelled", "refunded", "charged_back"].includes(payment.status)) {
      console.log("Pagamento aprovado:", result);

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

      await sendToGoogleSheets({
        orderId: result.orderId,
        customerId: result.customerId,
        stage: result.paymentStatus === "approved" ? "payment_approved" : `payment_${result.paymentStatus}`,
        paymentId: result.paymentId,
        paymentStatus: result.paymentStatus,
        paymentStatusDetail: result.paymentStatusDetail || "",
        paymentMethod: result.paymentMethod || "",
        planId: result.metadata?.planId || "",
        planTitle: result.metadata?.planTitle || "",
        customerName: result.metadata?.customerName || "",
        email: result.metadata?.email || result.payerEmail || "",
        whatsapp: result.metadata?.whatsapp || "",
        recipient: result.metadata?.recipient || "",
        relationship: result.metadata?.relationship || "",
        occasion: result.metadata?.occasion || "",
        description: result.metadata?.description || "",
        message: result.metadata?.message || "",
        moments: result.metadata?.moments || "",
        specialPhrase: result.metadata?.specialPhrase || "",
        style: result.metadata?.style || "",
        voiceType: result.metadata?.voiceType || "",
        observations: result.metadata?.observations || "",
        amount: result.transactionAmount,
        externalReference: result.externalReference,
        date: dateSaoPaulo,
      });
    } else {
      console.log("Pagamento recebido com status não aprovado:", result);
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