import { Direction, Position } from "./types";

export function findStart(map: string[]): Position {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    const x = row.indexOf("@");
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error('Start position "@" not found');
}

function isValidStep(char: string | undefined): boolean {
  return (
    !!char &&
    (char === "-" || char === "|" || char === "+" || /[A-Zx]/.test(char))
  );
}

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

  const validOptions = options.filter((opt) => isValidStep(opt.char));

  if (validOptions.length === 1) {
    return validOptions[0].dir;
  }

  throw new Error(
    `Invalid start: found ${validOptions.length} possible directions`
  );
}
