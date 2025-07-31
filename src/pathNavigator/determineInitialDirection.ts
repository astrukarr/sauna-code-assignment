import { isValidMapStep } from "../helpers/isValidMapStep";
import { Position, Direction } from "../types";

export function determineInitialDirection(
  map: string[],
  pos: Position
): Direction {
  const { x, y } = pos;

  const options: { dir: Direction; char: string | undefined }[] = [
    { dir: Direction.Up, char: map[y - 1]?.[x] },
    { dir: Direction.Down, char: map[y + 1]?.[x] },
    { dir: Direction.Left, char: map[y]?.[x - 1] },
    { dir: Direction.Right, char: map[y]?.[x + 1] },
  ];

  const validOptions = options.filter((opt) => isValidMapStep(opt.char));

  if (validOptions.length === 1) return validOptions[0].dir;

  throw new Error(
    `Invalid start: found ${validOptions.length} possible directions`
  );
}
