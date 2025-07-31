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
