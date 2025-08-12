import { collectLetter } from "../../src/helpers/collectLetter";

describe("collectLetter()", () => {
  it("collects a new uppercase letter once", () => {
    const visited = new Set<string>();
    const letters1 = collectLetter("A", { x: 2, y: 3 }, visited, "");
    expect(letters1).toBe("A");
    const letters2 = collectLetter("A", { x: 2, y: 3 }, visited, letters1);
    expect(letters2).toBe("A");
  });

  it("collects same letter on a different coordinate", () => {
    const visited = new Set<string>();
    let letters = "";
    letters = collectLetter("B", { x: 1, y: 1 }, visited, letters);
    letters = collectLetter("B", { x: 5, y: 1 }, visited, letters);
    expect(letters).toBe("BB");
  });

  it("ignores non-letters and lowercase", () => {
    const visited = new Set<string>();
    let letters = "";
    letters = collectLetter("-", { x: 0, y: 0 }, visited, letters);
    letters = collectLetter("b", { x: 0, y: 1 }, visited, letters);
    letters = collectLetter("+", { x: 1, y: 1 }, visited, letters);
    expect(letters).toBe("");
  });
});
