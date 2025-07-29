import { navigatePath } from "../src/pathNavigator";

const exampleMap = [
  "  @---A---+",
  "          |",
  "  x-B-+   C",
  "      |   |",
  "      +---+",
];

describe("navigatePath - valid maps", () => {
  it("should return correct letters and path for basic example", () => {
    const result = navigatePath(exampleMap);
    expect(result.letters).toBe("ACB");
    expect(result.path).toBe("@---A---+|C|+---+|+-B-x");
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

  it("should ignore characters after the end of path", () => {
    const map = ["  @-A--+", "       |", "       +-B--x-C--D"];

    const result = navigatePath(map);
    expect(result.letters).toBe("AB");
    expect(result.path).toBe("@-A--+|+-B--x");
  });
});

describe("navigatePath - invalid maps", () => {
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

  it("should throw an error if multiple start characters are present", () => {
    const map = [
      "   @--A-@-+",
      "          |",
      "  x-B-+   C",
      "      |   |",
      "      +---+",
    ];

    expect(() => navigatePath(map)).toThrow("Multiple start characters found");
  });

  it("should throw an error for broken path", () => {
    const map = ["  @--A-+", "       |", "        ", "       B-x"];

    expect(() => navigatePath(map)).toThrow("Broken path: reached empty space");
  });
  it("should throw an error if there is a fork in the path", () => {
    const map = [
      "    x-B",
      "      |",
      "@--A--+",
      "      |",
      "    x-+",
      "      |",
      "      +---+",
    ];

    expect(() => navigatePath(map)).toThrow(
      "No valid direction at + or letter turn"
    );
  });
  it("should not collect a letter from the same location twice", () => {
    const map = [
      "    +-O-N-+",
      "    |     |",
      "    |   +-I-+",
      "@-G-O-+ | | |",
      "    | | +-+ E",
      "    +-+     S",
      "            |",
      "            x",
    ];

    const result = navigatePath(map);
    expect(result.letters).toBe("GOONIES");
    expect(result.path).toBe("@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x");
  });

  it("should throw an error on fake turn", () => {
    const map = ["@-A-+-B-x"];

    expect(() => navigatePath(map)).toThrow("Fake turn");
  });
});
