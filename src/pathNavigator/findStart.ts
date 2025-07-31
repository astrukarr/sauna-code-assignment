import { Position } from "../types";

export function findStart(map: string[]): Position {
  let found: Position | null = null;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "@") {
        if (found) throw new Error("Multiple start characters found");
        found = { x, y };
      }
    }
  }

  if (!found) throw new Error('Start character "@" not found');
  return found;
}
