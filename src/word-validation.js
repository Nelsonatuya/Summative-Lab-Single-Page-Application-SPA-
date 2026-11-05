function validateWord(value) {
  if (typeof value !== "string") {
    return { valid: false, message: "Please enter a word using text." };
  }

  const word = value.trim();
  if (!word) {
    return { valid: false, message: "Please enter a word." };
  }
  if (Number.isFinite(Number(word))) {
    return { valid: false, message: "Please enter a word, not a number." };
  }

  return { valid: true, word };
}

if (typeof module !== "undefined") {
  module.exports = validateWord;
}