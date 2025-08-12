import { isCollectibleLetter } from "../../src/helpers/isCollectibleLetter";

describe("isCollectibleLetter()", () => {
  it.each([
    ["A", true],
    ["Z", true],
    ["X", true],
    ["a", false],
    ["z", false],
    ["@", false],
    [" ", false],
    ["AA", false],
    ["", false],
  ])("'%s' -> %p", (c, expected) => {
    expect(isCollectibleLetter(c as string)).toBe(expected);
  });
});
