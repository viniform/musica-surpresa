const GOOGLE_SHEETS_WEBHOOK_URL =
  process.env.REACT_APP_GOOGLE_SHEETS_WEBHOOK_URL || "";

export const syncLeadToSheet = async (payload) => {
  const body = JSON.stringify(payload);

  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
      const sent = navigator.sendBeacon(GOOGLE_SHEETS_WEBHOOK_URL, blob);

      if (sent) {
        return;
      }
    }

    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      keepalive: true,
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body,
    });
  } catch (error) {
    console.error("Erro ao sincronizar lead");
  }
};