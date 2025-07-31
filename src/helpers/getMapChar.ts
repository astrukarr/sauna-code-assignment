import { Position } from "../types";

export function getMapChar(map: string[], pos: Position): string {
  if (pos.y < 0 || pos.y >= map.length) return " ";
  if (pos.x < 0 || pos.x >= map[pos.y].length) return " ";
  return map[pos.y][pos.x] || " ";
}
