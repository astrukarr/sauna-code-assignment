import { Position } from "../types";
import { isCollectibleLetter } from "./isCollectibleLetter";

/** Adds letter if not collected yet */
export function collectLetter(
  char: string,
  pos: Position,
  visited: Set<string>,
  letters: string
): string {
  if (isCollectibleLetter(char)) {
    const key = `${char}@${pos.x},${pos.y}`;
    if (!visited.has(key)) {
      visited.add(key);
      return letters + char;
    }
  }
  return letters;
}
