import { collectLetter } from "../helpers/collectLetter";
import { getMapChar } from "../helpers/getMapChar";
import { handleLetterTurn } from "../helpers/handleLetterTurn";
import { handlePlusTurn } from "../helpers/handlePlusTurn";
import { isCollectibleLetter } from "../helpers/isCollectibleLetter";
import { isValidMapStep } from "../helpers/isValidMapStep";

import { move } from "../types";
import { determineInitialDirection } from "./determineInitialDirection";
import { findStart } from "./findStart";

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
