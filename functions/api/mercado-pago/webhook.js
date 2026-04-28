
async function sendToGoogleSheets(data) {
  const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbxn-Czr8uZOUT2umYwz7yN6qQt6gFyPD_DhCWY4Nuq-swBdlHoosW20p6D4TX3yVarzZg/exec";

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
      return Response.json(
        {
          received: true,
          processed: false,
          error: payment,
        },
        { status: paymentResponse.status }
      );
    }

    const result = {
      paymentId: payment.id,
      status: payment.status,
      statusDetail: payment.status_detail,
      externalReference: payment.external_reference,
      metadata: payment.metadata,
      transactionAmount: payment.transaction_amount,
      payerEmail: payment.payer?.email,
      eventType,
    };

    if (payment.status === "approved") {
      console.log("Pagamento aprovado:", result);

      await sendToGoogleSheets({
        paymentId: result.paymentId,
        status: result.status,
        planId: result.metadata?.planId,
        customerName: result.metadata?.customerName,
        email: result.payerEmail,
        amount: result.transactionAmount,
        externalReference: result.externalReference,
        date: new Date().toISOString(),
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