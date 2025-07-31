import { determineInitialDirection } from "../pathNavigator/determineInitialDirection";
import { findStart } from "../pathNavigator/findStart";
import { Position, Direction, move } from "../types";
import { collectLetter } from "./collectLetter";
import { getMapChar } from "./getMapChar";
import { getOppositeDirection } from "./getOppositeDirection";
import { handlePlusTurn } from "./handlePlusTurn";
import { isCollectibleLetter } from "./isCollectibleLetter";
import { isValidMapStep } from "./isValidMapStep";

/** Handles letter as a turn if straight is blocked */
export function handleLetterTurn(
  map: string[],
  pos: Position,
  direction: Direction
): Direction {
  const dirs = [Direction.Up, Direction.Down, Direction.Left, Direction.Right]
    .filter((d) => d !== getOppositeDirection(direction))
    .filter((d) => isValidMapStep(getMapChar(map, move(pos, d))));

  if (dirs.length === 0) throw new Error("Broken path: reached empty space");
  if (dirs.length > 1)
    throw new Error("No valid direction at + or letter turn");

  return dirs[0];
}

export function navigatePath(map: string[]) {
  if (!map.some((row) => row.includes("x")))
    throw new Error('End character "x" not found');

  const startPos = findStart(map);
  let direction = determineInitialDirection(map, startPos);

  const visitedTransitions = new Set<string>();
  const visitedLetters = new Set<string>();

  let pos = startPos;
  let path = "";
  let letters = "";

  while (true) {
    const char = getMapChar(map, pos);
    path += char;
    letters = collectLetter(char, pos, visitedLetters, letters);

    if (char === "x") break;

    const transitionKey = `${pos.x},${pos.y}->${direction}`;
    if (visitedTransitions.has(transitionKey))
      throw new Error("Infinite loop detected");
    visitedTransitions.add(transitionKey);

    if (char === "+") {
      direction = handlePlusTurn(map, pos, direction, visitedTransitions);
      pos = move(pos, direction);
      continue;
    }

    let nextPos = move(pos, direction);
    let nextChar = getMapChar(map, nextPos);

    if (!isValidMapStep(nextChar)) {
      if (!isCollectibleLetter(char))
        throw new Error("Broken path: reached empty space");
      direction = handleLetterTurn(map, pos, direction);
      nextPos = move(pos, direction);
    }

    pos = nextPos;
  }

  return { letters, path };
}
