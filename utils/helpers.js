export const removeRupeeSymbol = (value) => {
  if (value.includes("₹ ")) {
    return value.split("₹ ")[1];
  }
  return value;
};
