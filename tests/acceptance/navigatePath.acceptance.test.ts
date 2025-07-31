import { navigatePath } from "../../src/pathNavigator/navigatePath";

/**
 * Acceptance tests:
 * - Valid maps → expect letters + full path
 * - Invalid maps → expect specific error messages
 */

const VALID_CASES = [
  {
    name: "basic example",
    map: [
      "  @---A---+",
      "          |",
      "  x-B-+   C",
      "      |   |",
      "      +---+",
    ],
    letters: "ACB",
    path: "@---A---+|C|+---+|+-B-x",
  },
  {
    name: "intersections and collecting all letters",
    map: [
      "  @",
      "  | +-C--+",
      "  A |    |",
      "  +---B--+",
      "    |      x",
      "    |      |",
      "    +---D--+",
    ],
    letters: "ABCD",
    path: "@|A+---B--+|+--C-+|-||+---D--+|x",
  },
  {
    name: "letters found on turns",
    map: [
      "  @---A---+",
      "          |",
      "  x-B-+   |",
      "      |   |",
      "      +---C",
    ],
    letters: "ACB",
    path: "@---A---+|||C---+|+-B-x",
  },
  {
    name: "ignore characters after the end of path",
    map: ["  @-A--+", "       |", "       +-B--x-C--D"],
    letters: "AB",
    path: "@-A--+|+-B--x",
  },
  {
    name: "keep direction in a compact space",
    map: [" +-L-+  ", " |  +A-+", "@B+ ++ H", " ++    x"],
    letters: "BLAH",
    path: "@B+++B|+-L-+A+++A-+Hx",
  },
  {
    name: "do not collect a letter from the same location twice (GOONIES)",
    map: [
      "    +-O-N-+",
      "    |     |",
      "    |   +-I-+",
      "@-G-O-+ | | |",
      "    | | +-+ E",
      "    +-+     S",
      "            |",
      "            x",
    ],
    letters: "GOONIES",
    path: "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x",
  },
];

const INVALID_CASES = [
  {
    name: 'missing start character "@"',
    map: [
      "  ---A---+",
      "          |",
      "  x-B-+   C",
      "      |   |",
      "      +---+",
    ],
    error: 'Start character "@" not found',
  },
  {
    name: 'missing end character "x"',
    map: [
      "  @---A---+",
      "          |",
      "  B-+     C",
      "    |     |",
      "    +-----+",
    ],
    error: 'End character "x" not found',
  },
  {
    name: "multiple start characters",
    map: [
      "   @--A-@-+",
      "          |",
      "  x-B-+   C",
      "      |   |",
      "      +---+",
    ],
    error: "Multiple start characters found",
  },
  {
    name: "broken path",
    map: ["  @--A-+", "       |", "        ", "       B-x"],
    error: "Broken path: reached empty space",
  },
  {
    name: "multiple starting paths from @ (two initial options)",
    map: ["x-B-@-A-x"],
    error: /Invalid start: found \d+ possible directions/,
  },
  {
    name: "fork in the path",
    map: [
      "    x-B",
      "      |",
      "@--A--+",
      "      |",
      "    x-+",
      "      |",
      "      +---+",
    ],
    error: "No valid direction at + or letter turn",
  },
  {
    name: "fake turn",
    map: ["    x", "    |", "@--A+--B"],
    error: "Fake turn",
  },
];

describe("navigatePath — valid maps (acceptance)", () => {
  test.each(VALID_CASES)("%s", ({ map, letters, path }) => {
    const result = navigatePath(map);
    expect(result.letters).toBe(letters);
    expect(result.path).toBe(path);
  });
});

describe("navigatePath — invalid maps (acceptance)", () => {
  test.each(INVALID_CASES)("%s", ({ map, error }) => {
    expect(() => navigatePath(map)).toThrow(error);
  });
});
