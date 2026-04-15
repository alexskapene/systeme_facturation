export const calculateTTC = (priceHT: number, rate: number = 16): number => {
  const ttc = priceHT * (1 + rate / 100);
  // On arrondit à 2 décimales pour éviter les erreurs de virgule flottante JS
  return Math.round(ttc * 100) / 100;
};
