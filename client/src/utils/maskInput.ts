export function maskInput(value: string, pattern: string) {
  const digits = value.replace(/\D/g, "");
  let digitIndex = 0;
  let result = "";

  for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
    if (pattern[i] === "#") {
      result += digits[digitIndex++];
    } else {
      result += pattern[i];
    }
  }

  return result;
}
