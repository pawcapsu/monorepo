export function _escapeCharacters(string: string) {
  [
    // "_",
    // "*",
    // "[",
    // "]",
    // "(",
    // ")",
    "~",
    // "`",
    ">",
    "#",
    "+",
    "-",
    "=",
    "|",
    "{",
    "}",
    ".",
    "!",
  ].forEach((symbol) => {
    string = string.replace(new RegExp(`\\${symbol}`, "g"), `\\${symbol}`);
  });

  return string;
};