import { Direction } from "../../src/types";
import { move } from "../../src/helpers/move";
describe("move()", () => {
  const start = Object.freeze({ x: 10, y: 20 }); // freeze to ensure immutability

  test.each([
    [Direction.Up, { x: 10, y: 19 }],
    [Direction.Down, { x: 10, y: 21 }],
    [Direction.Left, { x: 9, y: 20 }],
    [Direction.Right, { x: 11, y: 20 }],
  ])("moves one step %s", (dir, expected) => {
    const next = move(start as any, dir);
    expect(next).toEqual(expected);
    expect(next).not.toBe(start); // returns a new object
    expect(start).toEqual({ x: 10, y: 20 }); // not mutated
  });

  it("throws on unknown direction (exhaustiveness guard)", () => {
    expect(() => move({ x: 0, y: 0 }, -1 as unknown as Direction)).toThrow(
      /unknown direction/i
    );
  });
});
