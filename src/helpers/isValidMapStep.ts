export function isValidMapStep(char: string | undefined): boolean {
  return (
    !!char &&
    (char === "-" || char === "|" || char === "+" || /[A-Zx]/.test(char))
  );
}
