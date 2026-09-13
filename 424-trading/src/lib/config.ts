// Central company configuration for 424 TRADING.
export const COMPANY = {
  name: "424 TRADING",
  tagline: "QUALITY PRODUCTS. CONVENIENTLY SOURCED",
  subTagline: "Find what you need. Order with confidence.",
  location: "Harare, Zimbabwe",
  phone: "+263 774 606 387",
  phoneRaw: "+263774606387",
  email: "sales@424trading.co.zw",
  whatsappNumber: "263774606387", // international format, digits only
};

export function waLink(message: string): string {
  return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function formatMoney(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  return `US$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "delivered",
  "cancelled",
] as const;

export const QUOTE_STATUSES = ["new", "contacted", "quoted", "closed"] as const;
