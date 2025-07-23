import { exampleMap1 } from "./map";
import { findStart, determineInitialDirection } from "./pathNavigator";
import { Direction } from "./types";

console.log("Loaded map:");
exampleMap1.forEach((line) => console.log(line));

const start = findStart(exampleMap1);
console.log("Start position:", start);

const direction = determineInitialDirection(exampleMap1, start);
console.log("Initial direction:", Direction[direction]);
