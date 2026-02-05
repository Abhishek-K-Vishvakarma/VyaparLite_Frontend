export const calculateAmount = (price, unit, qty) => {
  if (unit === "KG") {
    return (price / 1000) * qty; // qty in grams
  }
  return price * qty;
};
