import { Position, Direction } from "../types";

export function move(pos: Position, dir: Direction): Position {
  switch (dir) {
    case Direction.Up:
      return { x: pos.x, y: pos.y - 1 };
    case Direction.Down:
      return { x: pos.x, y: pos.y + 1 };
    case Direction.Left:
      return { x: pos.x - 1, y: pos.y };
    case Direction.Right:
      return { x: pos.x + 1, y: pos.y };
    default:
      const _exhaustive: never = dir as never;
      throw new Error(`move(): unknown direction ${_exhaustive}`);
  }
}
