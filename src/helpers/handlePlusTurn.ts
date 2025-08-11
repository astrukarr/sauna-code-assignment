import { Direction, Position } from "../types";
import { getMapChar } from "./getMapChar";
import { getOppositeDirection } from "./getOppositeDirection";
import { isCollectibleLetter } from "./isCollectibleLetter";
import { isValidMapStep } from "./isValidMapStep";
import { move } from "./move";

/** Handles '+' logic and returns new direction or throws error */
export function handlePlusTurn(
  map: string[],
  pos: Position,
  direction: Direction,
  visitedTransitions: Set<string>
): Direction {
  const perpDirs =
    direction === Direction.Up || direction === Direction.Down
      ? [Direction.Left, Direction.Right]
      : [Direction.Up, Direction.Down];

  const validPerp = perpDirs.filter((d) =>
    isValidMapStep(getMapChar(map, move(pos, d)))
  );

  const forwardChar = getMapChar(map, move(pos, direction));
  const forwardValid = isValidMapStep(forwardChar);

  const prevChar = getMapChar(map, move(pos, getOppositeDirection(direction)));
  const cameFromStraight =
    ["-", "|"].includes(prevChar) || isCollectibleLetter(prevChar);

  if (forwardValid && cameFromStraight) {
    if (validPerp.length <= 1) throw new Error("Fake turn");
    throw new Error("No valid direction at + or letter turn");
  }

  if (validPerp.length === 0)
    throw new Error("Broken path: reached empty space");

  if (validPerp.length > 1) {
    const nextDir = validPerp.find(
      (d) => !visitedTransitions.has(`${pos.x},${pos.y}->${d}`)
    );
    if (!nextDir) throw new Error("No valid direction at + or letter turn");
    return nextDir;
  }

  return validPerp[0];
}
