

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const paymentId = url.searchParams.get("payment_id") || url.searchParams.get("collection_id");

    if (!paymentId) {
      return Response.json(
        {
          ok: false,
          error: "payment_id não informado.",
        },
        { status: 400 }
      );
    }

    if (!env.MERCADO_PAGO_ACCESS_TOKEN) {
      return Response.json(
        {
          ok: false,
          error: "MERCADO_PAGO_ACCESS_TOKEN não configurado.",
        },
        { status: 500 }
      );
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`,
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
          ok: false,
          error: "Pagamento não encontrado ou não processável.",
          paymentId,
          mercadoPagoStatus: paymentResponse.status,
          mercadoPagoResponse: payment,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        ok: true,
        paymentId: String(payment.id || paymentId),
        status: payment.status || "unknown",
        statusDetail: payment.status_detail || "",
        paymentMethod: payment.payment_type_id || payment.payment_method_id || "",
        externalReference: payment.external_reference || "",
        transactionAmount: payment.transaction_amount || "",
        dateCreated: payment.date_created || "",
        dateApproved: payment.date_approved || "",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao consultar status do pagamento:", error);

    return Response.json(
      {
        ok: false,
        error: "Erro interno ao consultar status do pagamento.",
      },
      { status: 500 }
    );
  }
}

export async function onRequestPost() {
  return Response.json(
    {
      ok: false,
      error: "Método não permitido. Use GET.",
    },
    { status: 405 }
  );
}