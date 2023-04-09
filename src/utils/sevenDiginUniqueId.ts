const sevenDiginUniqueId = (number: number): string => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let base62 = "";

  do {
    const remainder = number % 62;
    base62 = chars[remainder] + base62;
    number = Math.floor(number / 62);
  } while (number > 0);

  // Pad with leading zeros to ensure 7 digits
  while (base62.length < 7) {
    base62 = "0" + base62;
  }

  return base62;
};

export default sevenDiginUniqueId;
