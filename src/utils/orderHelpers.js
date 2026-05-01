import { normalizeWhatsapp } from "./formatters";

export const generateOrderId = () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `MS-${timestamp}-${random}`;
};

export const buildCustomerId = (whatsapp) => {
  const digits = normalizeWhatsapp(whatsapp);
  return digits ? `55${digits}` : "";
};