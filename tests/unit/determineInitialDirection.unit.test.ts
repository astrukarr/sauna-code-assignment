import { determineInitialDirection } from "../../src/pathNavigator/determineInitialDirection";
import { Direction } from "../../src/types";

describe("determineInitialDirection", () => {
  it("picks the only valid neighbor (to the right)", () => {
    const map = [" @-"];
    const dir = determineInitialDirection(map, { x: 1, y: 0 });
    expect(dir).toBe(Direction.Right);
  });

  it("throws when zero or multiple possible directions exist", () => {
    // Up and Down valid → ambiguous start
    const map = [" | ", " @ ", " | "];
    expect(() => determineInitialDirection(map, { x: 1, y: 1 })).toThrow(
      /Invalid start: found \d+ possible directions/
    );
  });
});
