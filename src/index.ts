import * as Maps from "./maps";
import { determineInitialDirection } from "./pathNavigator/determineInitialDirection";
import { findStart } from "./pathNavigator/findStart";
import { navigatePath } from "./pathNavigator/navigatePath";

import { Direction } from "./types";

const selectedMap = Maps.exampleMap5;

console.log("Loaded map:");
selectedMap.forEach((line) => console.log(line));

const start = findStart(selectedMap);
const direction = determineInitialDirection(selectedMap, start);
const result = navigatePath(selectedMap);

console.log("Start:", start);
console.log("Initial direction:", Direction[direction]);
console.log("Letters:", result.letters);
console.log("Path:", result.path);
