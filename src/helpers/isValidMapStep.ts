export function isValidMapStep(char: string | undefined): boolean {
  if (!char) return false;

  const pathSymbols = new Set(["-", "|", "+"]);
  const isLetter = /^[A-Z]$/.test(char);
  const isGoal = char === "x";

  return pathSymbols.has(char) || isLetter || isGoal;
}
