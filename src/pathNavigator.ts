import { Direction, Position, move } from "./types";
import { isLetter, isValidStep, getCharAt } from "./helpers";

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

  if (validOptions.length === 1) return validOptions[0].dir;

  throw new Error(
    `Invalid start: found ${validOptions.length} possible directions`
  );
}

export function navigatePath(map: string[]) {
  const hasEnd = map.some((row) => row.includes("x"));
  if (!hasEnd) {
    throw new Error('End character "x" not found');
  }
  const startPos = findStart(map);
  let direction = determineInitialDirection(map, startPos);

  const visitedTransitions = new Set<string>();
  const visitedLetters = new Set<string>();

  let pos = startPos;
  let path = "";
  let letters = "";

  while (true) {
    const char = getCharAt(map, pos);
    path += char;

    const posKey = `${pos.x},${pos.y}`;

    if (isLetter(char)) {
      const letterKey = `${char}@${posKey}`;
      if (!visitedLetters.has(letterKey)) {
        letters += char;
        visitedLetters.add(letterKey);
      }
    }

    if (char === "x") break;

    const transitionKey = `${pos.x},${pos.y}->${direction}`;
    if (visitedTransitions.has(transitionKey)) {
      throw new Error("Infinite loop detected");
    }
    visitedTransitions.add(transitionKey);

    let nextPos = move(pos, direction);
    let nextChar = getCharAt(map, nextPos);

    if (!isValidStep(nextChar)) {
      // Try to turn at "+" or letter only
      if (char === "+" || isLetter(char)) {
        const possibleDirections = [
          Direction.Up,
          Direction.Down,
          Direction.Left,
          Direction.Right,
        ].filter((d) => d !== getOppositeDirection(direction));

        const validTurns = possibleDirections.filter((dir) => {
          const candidate = move(pos, dir);
          const candidateChar = getCharAt(map, candidate);
          const transition = `${pos.x},${pos.y}->${dir}`;
          return (
            isValidStep(candidateChar) && !visitedTransitions.has(transition)
          );
        });

        if (validTurns.length !== 1) {
          throw new Error(
            "No valid direction at + or letter turn (ambiguous fork)"
          );
        }

        direction = validTurns[0];
        nextPos = move(pos, direction);
      } else {
        throw new Error("Broken path: reached empty space");
      }
    }

    pos = nextPos;
  }

  return { letters, path };
}

function getOppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case Direction.Up:
      return Direction.Down;
    case Direction.Down:
      return Direction.Up;
    case Direction.Left:
      return Direction.Right;
    case Direction.Right:
      return Direction.Left;
  }
}
