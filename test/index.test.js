const validateWord = require("../src/word-validation");

test("rejects empty input", () => {
  expect(validateWord(" ").valid).toBe(false);
});

test("rejects number input", () => {
  expect(validateWord("123").valid).toBe(false);
  expect(validateWord(123).valid).toBe(false);
});
