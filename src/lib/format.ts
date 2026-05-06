export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

export const formatMiles = (n: number) =>
  new Intl.NumberFormat("en-US").format(n) + " km";

export const DEALER_EMAIL = "pmcarsalesmombasa@gmail.com";
export const DEALER_PHONE = "0712 604 775";
export const DEALER_WHATSAPP = "254712604775";
export const DEALER_ADDRESS = "Mombasa, Kenya";
export const DEALER_NAME = "PM Car Sales";
export const DEALER_TAGLINE = "Drive Your Dream";
