# Path Navigator

A **TypeScript** solution for the **Path Following Challenge**:

- Start at character **`@`**
- Follow the path until character **`x`**
- Collect all **letters** along the way (only once per coordinate)
- Stop when `x` is reached or throw an **error** for invalid paths

The program outputs:

- **Collected letters** – all letters in the order visited
- **Full path** – exact sequence of characters traversed

## Features

- Supports **jagged 2D maps** (rows can be different lengths)
- Detects **invalid maps**:
  - Missing start/end
  - Multiple starts
  - Forks / fake turns
  - Broken paths
  - Infinite loops
- Collects **letters only once per coordinate**
- Fully **covered with tests** (unit + acceptance)

## How It Works

1. **Locate start (`@`)** using `findStart(map)`
2. **Determine initial direction** using `determineInitialDirection`
3. **Walk the path** with `navigatePath(map)`:
   - Move one step at a time
   - Handle intersections (`+`) and letter turns
   - Collect letters **only once per position**
   - Stop at `x` or throw error if invalid

## Usage Example

```ts
import { navigatePath } from "./pathNavigator";

const map = [
  "  @---A---+",
  "          |",
  "  x-B-+   C",
  "      |   |",
  "      +---+",
];

const result = navigatePath(map);

console.log(result.letters); // "ACB"
console.log(result.path); // "@---A---+|C|+---+|+-B-x"
```
