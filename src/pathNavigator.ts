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

/**
 * Walks the path, collects letters, and returns both the letters and the path.
 * Rules implemented:
 * - Start at '@', finish at 'x'.
 * - Valid path characters: '-', '|', '+', 'x', 'A'-'Z'.
 * - On '+', you must turn orthogonally (not straight). If straight is also possible:
 *    * if there are 0 or 1 orthogonal options → "Fake turn"
 *    * if there are 2 orthogonal options → "No valid direction at + or letter turn" (fork)
 * - Letters can appear on turns; collect a letter only once per location.
 * - On a letter, if straight is blocked, you may turn (but not back the way you came).
 * - Detect infinite loops by remembering transitions (position + incoming direction).
 */
export function navigatePath(map: string[]) {
  const hasEnd = map.some((row) => row.includes("x"));
  if (!hasEnd) {
    throw new Error('End character "x" not found');
  }

  const startPos = findStart(map);
  let direction = determineInitialDirection(map, startPos);

  // Tracks transitions to detect loops: "x,y->direction"
  const visitedTransitions = new Set<string>();
  // Tracks collected letters per coordinate (avoid collecting same letter twice at same cell)
  const visitedLetters = new Set<string>();

  let pos = startPos;
  let path = "";
  let letters = "";

  while (true) {
    const char = getCharAt(map, pos);
    path += char;

    // Collect letter at this location only once
    const posKey = `${pos.x},${pos.y}`;
    if (isLetter(char)) {
      const letterKey = `${char}@${posKey}`;
      if (!visitedLetters.has(letterKey)) {
        letters += char;
        visitedLetters.add(letterKey);
      }
    }

    // Reached end
    if (char === "x") break;

    // Loop detection: this position + current direction was already processed
    const transitionKey = `${pos.x},${pos.y}->${direction}`;
    if (visitedTransitions.has(transitionKey)) {
      throw new Error("Infinite loop detected");
    }
    visitedTransitions.add(transitionKey);

    // --- Special handling for '+' (must turn orthogonally) ---
    if (char === "+") {
      // Orthogonal directions relative to current direction
      const perpDirs =
        direction === Direction.Up || direction === Direction.Down
          ? [Direction.Left, Direction.Right]
          : [Direction.Up, Direction.Down];

      const validPerp = perpDirs.filter((d) => {
        const p = move(pos, d);
        return isValidStep(getCharAt(map, p));
      });

      // Check "straight" ahead to decide Fake turn / Fork only when straight is valid
      const forwardPos = move(pos, direction);
      const forwardChar = getCharAt(map, forwardPos);
      const forwardValid = isValidStep(forwardChar);

      // Previous cell (where we came from). Letters count as straight segments here.
      const prevPos = move(pos, getOppositeDirection(direction));
      const prevChar = getCharAt(map, prevPos);
      const cameFromStraight =
        prevChar === "-" || prevChar === "|" || isLetter(prevChar);

      if (forwardValid && cameFromStraight) {
        // '+' with a valid straight continuation:
        // 0 or 1 orthogonal → Fake '+', 2 orthogonals → illegal fork
        if (validPerp.length <= 1) {
          throw new Error("Fake turn");
        } else {
          throw new Error("No valid direction at + or letter turn");
        }
      }

      // No straight continuation → choose among orthogonals
      if (validPerp.length === 0) {
        throw new Error("Broken path: reached empty space");
      }

      if (validPerp.length > 1) {
        // Pick an unused perpendicular direction if possible
        const nextDir = validPerp.find(
          (d) => !visitedTransitions.has(`${pos.x},${pos.y}->${d}`)
        );
        if (!nextDir) {
          // Both exits already used → ambiguous crossing / loop
          throw new Error("No valid direction at + or letter turn");
        }
        direction = nextDir;
      } else {
        direction = validPerp[0];
      }

      pos = move(pos, direction);
      continue;
    }
    // --- End of '+' handling ---

    // Try to go straight; if blocked, a letter may act as a turn (not backwards)
    let nextPos = move(pos, direction);
    let nextChar = getCharAt(map, nextPos);

    if (!isValidStep(nextChar)) {
      if (isLetter(char)) {
        const possibleDirections = [
          Direction.Up,
          Direction.Down,
          Direction.Left,
          Direction.Right,
        ].filter((d) => d !== getOppositeDirection(direction));

        const allValidTurns = possibleDirections.filter((dir) => {
          const candidate = move(pos, dir);
          const candidateChar = getCharAt(map, candidate);
          return isValidStep(candidateChar);
        });

        if (allValidTurns.length === 0) {
          throw new Error("Broken path: reached empty space");
        }

        if (allValidTurns.length > 1) {
          // Multiple valid turns from a letter → considered an invalid fork
          throw new Error("No valid direction at + or letter turn");
        }

        direction = allValidTurns[0];
        nextPos = move(pos, direction);
        nextChar = getCharAt(map, nextPos);
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
