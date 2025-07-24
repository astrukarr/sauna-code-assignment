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

  it("should follow path through intersections and collect all letters", () => {
    const map = [
      "  @",
      "  | +-C--+",
      "  A |    |",
      "  +---B--+",
      "    |      x",
      "    |      |",
      "    +---D--+",
    ];

    const result = navigatePath(map);

    expect(result.letters).toBe("ABCD");
    expect(result.path).toBe("@|A+---B--+|+--C-+|-||+---D--+|x");
  });

  it("should collect letters even when found on turns", () => {
    const map = [
      "  @---A---+",
      "          |",
      "  x-B-+   |",
      "      |   |",
      "      +---C",
    ];

    const result = navigatePath(map);

    expect(result.letters).toBe("ACB");
    expect(result.path).toBe("@---A---+|||C---+|+-B-x");
  });
});
