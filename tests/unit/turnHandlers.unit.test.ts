import { handleLetterTurn } from "../../src/helpers/handleLetterTurn";
import { handlePlusTurn } from "../../src/helpers/handlePlusTurn";
import { Direction, Position } from "../../src/types";

/** Small helper to make positions readable in tests */
const pos = (x: number, y: number): Position => ({ x, y });

describe("handlePlusTurn (+)", () => {
  it('throws "Fake turn" when going straight is valid and there are ≤ 1 orthogonal exits', () => {
    // Single row: coming from '-' into '+', forward '-' is valid,
    // and there are 0 orthogonal options → Fake turn.
    //           01234
    const map = ["@-+-B"];
    const plus = pos(2, 0); // '+'
    const dir = Direction.Right;
    const visitedTransitions = new Set<string>();

    expect(() => handlePlusTurn(map, plus, dir, visitedTransitions)).toThrow(
      "Fake turn"
    );
  });

  it('throws "No valid direction…" when going straight is valid and there are 2 orthogonal exits (fork)', () => {
    // Forward '-' is valid; both Up and Down are '|' → fork.
    const map = ["  |  ", "@-+-B", "  |  "];
    const plus = pos(2, 1);
    const dir = Direction.Right;
    const visitedTransitions = new Set<string>();

    expect(() => handlePlusTurn(map, plus, dir, visitedTransitions)).toThrow(
      "No valid direction at + or letter turn"
    );
  });

  it("chooses the only orthogonal exit when straight is blocked", () => {
    // Forward is space; only Up is '|' → should return Up.
    const map = ["  |  ", "@-+  ", "     "];
    const plus = pos(2, 1);
    const dir = Direction.Right; // forward (3,1) is space
    const visitedTransitions = new Set<string>();

    const nextDir = handlePlusTurn(map, plus, dir, visitedTransitions);
    expect(nextDir).toBe(Direction.Up);
  });

  it("prefers an unused orthogonal exit when both are valid and straight is blocked", () => {
    // Up and Down are both valid ('|'); forward is blocked.
    // visitedTransitions already contains the Up transition, so it should pick Down.
    const map = ["  |  ", "@-+  ", "  |  "];
    const plus = pos(2, 1);
    const dir = Direction.Right;
    const visitedTransitions = new Set<string>([
      `${plus.x},${plus.y}->${Direction.Up}`,
    ]);

    const nextDir = handlePlusTurn(map, plus, dir, visitedTransitions);
    expect(nextDir).toBe(Direction.Down);
  });
});

describe("handleLetterTurn (letter acts as a turn when straight is blocked)", () => {
  it("turns to the only valid direction when straight is blocked", () => {
    // On 'A', forward is space; only Down is valid ('|') → return Down.
    const map = [" @A ", "  | ", "    "];
    const letter = pos(2, 0); // 'A'
    const dir = Direction.Right; // forward is space

    const nextDir = handleLetterTurn(map, letter, dir);
    expect(nextDir).toBe(Direction.Down);
  });

  it('throws "No valid direction…" when multiple turns are possible at a letter (fork on letter)', () => {
    // Arrive at 'A' from below (direction Up). Left and Right are '-' → fork.
    const map = ["  -A-", "  |  ", "  @  "];
    // indexes: row 0 → "  -A-" -> A at x=3
    const letter = pos(3, 0);
    const dir = Direction.Up;

    expect(() => handleLetterTurn(map, letter, dir)).toThrow(
      "No valid direction at + or letter turn"
    );
  });

  it('throws "Broken path" when no valid turn exists at a letter', () => {
    // On 'A', forward is space; no Up/Down/Right valid (and opposite/Left is excluded) → broken.
    const map = ["-A "]; // only Left is '-', but that's the opposite direction
    const letter = pos(1, 0);
    const dir = Direction.Right;

    expect(() => handleLetterTurn(map, letter, dir)).toThrow(
      "Broken path: reached empty space"
    );
  });

  it("does not allow backtracking (opposite direction is excluded)", () => {
    // Only opposite (Left) is valid; others are blocked → after excluding opposite, there are 0 options → broken.
    const map = ["-A "];
    const letter = pos(1, 0);
    const dir = Direction.Right;

    expect(() => handleLetterTurn(map, letter, dir)).toThrow(
      "Broken path: reached empty space"
    );
  });
});
