export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.MERCADO_PAGO_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: body.planId,
            title: body.title,
            quantity: body.quantity || 1,
            currency_id: "BRL",
            unit_price: Number(body.unitPrice) > 0 ? Number(body.unitPrice) : 1,
          },
        ],
        payer: {
          name: body.customer?.name || "",
          email: body.customer?.email || "",
        },
        back_urls: {
          success: "https://www.musicasurpresa.com.br/pagamento/sucesso",
          failure: "https://www.musicasurpresa.com.br/pagamento/erro",
          pending: "https://www.musicasurpresa.com.br/pagamento/pendente",
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
        },
        binary_mode: false,
        notification_url: "https://www.musicasurpresa.com.br/api/mercado-pago/webhook",
        external_reference: `order_${body.planId}_${Date.now()}`,
        statement_descriptor: "MUSICASURPRESA",
        metadata: {
          planId: body.planId,
          customerName: body.customer?.name,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data }, { status: response.status });
    }

    return Response.json({
      init_point: data.init_point,
      preference_id: data.id,
    });
  } catch (error) {
    return Response.json(
      { error: "Erro interno ao criar checkout." },
      { status: 500 }
    );
  }
}