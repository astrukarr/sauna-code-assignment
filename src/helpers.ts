import { Position } from "./types";

export function isLetter(char: string): boolean {
  return /^[A-Z]$/.test(char);
}

export function isValidStep(char: string | undefined): boolean {
  return (
    !!char &&
    (char === "-" || char === "|" || char === "+" || /[A-Zx]/.test(char))
  );
}

export function getCharAt(map: string[], pos: Position): string | undefined {
  return map[pos.y]?.[pos.x];
}
