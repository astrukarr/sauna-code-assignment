import { findStart } from "../../src/pathNavigator/findStart";

describe("findStart", () => {
  it("returns correct coordinates for a single @", () => {
    const map = ["   ", " @ ", "   "];
    expect(findStart(map)).toEqual({ x: 1, y: 1 });
  });

  it('throws when start "@" is missing', () => {
    const map = ["   ", "   "];
    expect(() => findStart(map)).toThrow('Start character "@" not found');
  });

  it("throws when multiple starts are present", () => {
    const map = [" @ @ "];
    expect(() => findStart(map)).toThrow("Multiple start characters found");
  });
});
