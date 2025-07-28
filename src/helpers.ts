import { Position, Direction } from "./types";

export function isLetter(char: string): boolean {
  return /^[A-Z]$/.test(char);
}

export function isValidStep(char: string | undefined): boolean {
  return (
    !!char &&
    (char === "-" || char === "|" || char === "+" || /[A-Zx]/.test(char))
  );
}

export function getCharAt(map: string[], pos: Position): string {
  if (pos.y < 0 || pos.y >= map.length) return " ";
  if (pos.x < 0 || pos.x >= map[pos.y].length) return " ";
  return map[pos.y][pos.x] || " ";
}
