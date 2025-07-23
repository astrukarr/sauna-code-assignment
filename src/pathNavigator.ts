import { Direction, Position, move } from "./types";
import { isLetter, isValidStep, getCharAt } from "./helpers";

export function findStart(map: string[]): Position {
  for (let y = 0; y < map.length; y++) {
    const row = map[y];
    const x = row.indexOf("@");
    if (x !== -1) {
      return { x, y };
    }
  }
  throw new Error('Start character "@" not found');
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

function findNewDirection(
  map: string[],
  pos: Position,
  from: Direction
): Direction {
  const opposites: Record<Direction, Direction> = {
    [Direction.Up]: Direction.Down,
    [Direction.Down]: Direction.Up,
    [Direction.Left]: Direction.Right,
    [Direction.Right]: Direction.Left,
  };

  const candidates: Direction[] = [
    Direction.Up,
    Direction.Down,
    Direction.Left,
    Direction.Right,
  ];

  for (const dir of candidates) {
    if (dir === opposites[from]) continue; // ne smijemo se vratiti nazad

    const nextPos = move(pos, dir);
    const char = getCharAt(map, nextPos);

    if (isValidStep(char)) {
      return dir;
    }
  }

  throw new Error("No valid direction at +");
}

export function navigatePath(map: string[]) {
  const start = findStart(map);

  const hasEndChar = map.some((line) => line.includes("x"));
  if (!hasEndChar) {
    throw new Error('End character "x" not found');
  }

  let current = start;
  let direction = determineInitialDirection(map, start);

  let path = "@";
  let letters = "";
  const visitedLetters = new Set<string>();

  while (true) {
    const next = move(current, direction);
    const char = getCharAt(map, next);

    if (!char) {
      throw new Error("Broken path: reached empty space");
    }

    path += char;

    if (char === "x") {
      break;
    }

    if (isLetter(char) && !visitedLetters.has(`${next.x},${next.y}`)) {
      letters += char;
      visitedLetters.add(`${next.x},${next.y}`);
    }

    if (char === "+") {
      direction = findNewDirection(map, next, direction);
    }

    current = next;
  }

  return { letters, path };
}
