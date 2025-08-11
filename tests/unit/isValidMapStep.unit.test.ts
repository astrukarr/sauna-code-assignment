import { isValidMapStep } from "../../src/helpers/isValidMapStep";

describe("isValidMapStep()", () => {
  it.each([
    ["-", true],
    ["|", true],
    ["+", true],
    ["A", true],
    ["Z", true],
    ["X", true], // uppercase letter
    ["x", true], // goal
    [" ", false],
    ["", false],
    [".", false],
    ["a", false],
    ["z", false],
    ["0", false],
    ["@", false], // start is not a valid step to move onto
    [undefined as unknown as string, false],
  ])("returns %s -> %p", (input, expected) => {
    expect(isValidMapStep(input)).toBe(expected);
  });
});
