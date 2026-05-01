export const normalizeWhatsapp = (value) => {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("55") && digits.length > 11
      ? digits.slice(2)
      : digits;

  return withoutCountryCode.slice(0, 11);
};

export const formatWhatsapp = (value) => {
  const digits = normalizeWhatsapp(value);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export function normalizeName(value) {
  const hadTrailingSpace = /\s$/.test(value);
  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/^\s+/, "")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return hadTrailingSpace ? `${normalized} ` : normalized;
}

export const normalizeEmail = (value) => {
  return value.trim().toLowerCase();
};