import { navigatePath } from "../src/pathNavigator";

const exampleMap = [
  "  @---A---+",
  "          |",
  "  x-B-+   C",
  "      |   |",
  "      +---+",
];

describe("navigatePath", () => {
  it("should return correct letters and path for basic example", () => {
    const result = navigatePath(exampleMap);
    expect(result.letters).toBe("ACB");
    expect(result.path).toBe("@---A---+|C|+---+|+-B-x");
  });

  it("should throw an error if start character is missing", () => {
    const invalidMap = [
      "  ---A---+",
      "          |",
      "  x-B-+   C",
      "      |   |",
      "      +---+",
    ];

    expect(() => navigatePath(invalidMap)).toThrow(
      'Start character "@" not found'
    );
  });

  it("should throw an error if end character is missing", () => {
    const invalidMap = [
      "  @---A---+",
      "          |",
      "  B-+     C",
      "    |     |",
      "    +-----+",
    ];

    expect(() => navigatePath(invalidMap)).toThrow(
      'End character "x" not found'
    );
  });
});
