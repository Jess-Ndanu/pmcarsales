export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const formatMiles = (n: number) =>
  new Intl.NumberFormat("en-US").format(n) + " mi";

export const DEALER_EMAIL = "sales@apexautos.com";
export const DEALER_PHONE = "+1 (555) 240-1184";
export const DEALER_ADDRESS = "1820 Highline Ave, Los Angeles, CA 90021";
export const DEALER_NAME = "Apex Autos";
