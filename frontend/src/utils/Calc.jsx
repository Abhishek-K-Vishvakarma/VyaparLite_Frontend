// export const calculateAmount = (price, unit, qty) => {
//   if (unit === "KG") {
//     return (price / 1000) * qty; // qty in grams
//   }
//   return price * qty;
// };
// utils/Calc.js

export const calculateAmount = (price, unit, qty) => {
  // Price is ALWAYS per base unit
  // qty is ALWAYS in base unit (1 = 1KG, 0.2 = 200g, 5 = 5 pieces)
  return price * qty;
};