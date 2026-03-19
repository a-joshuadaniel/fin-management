export const CARD_COLORS = [
  { name: "ICICI Orange", value: "#FF6B00" },
  { name: "HDFC Blue", value: "#004B87" },
  { name: "SBI Blue", value: "#1A237E" },
  { name: "Axis Burgundy", value: "#97144D" },
  { name: "Kotak Red", value: "#ED1C24" },
  { name: "IDFC Purple", value: "#5C2D91" },
  { name: "Amex Green", value: "#006FCF" },
  { name: "IndusInd Teal", value: "#008080" },
  { name: "RBL Orange", value: "#F47920" },
  { name: "Yes Bank Blue", value: "#0047AB" },
] as const;

export const CARD_NETWORKS = [
  { label: "Visa", value: "visa" },
  { label: "Mastercard", value: "mastercard" },
  { label: "RuPay", value: "rupay" },
  { label: "American Express", value: "amex" },
  { label: "Other", value: "other" },
] as const;
