import { removeWall } from "./maze";
import type { Exit, MazeTile } from "../types/tiles";

import { generateRecursiveBacktracker } from "../algorithms/recursiveBacktracker";
import { generateBinaryTree } from "../algorithms/binaryTree";
import { generateEller } from "../algorithms/eller";
import { generateGrowingTree } from "../algorithms/growingTree";
import { generateHuntAndKill } from "../algorithms/huntAndKill";
import { generateKruskal } from "../algorithms/kruskal";
import { generatePrim } from "../algorithms/prim";
import { generateRecursiveDivision } from "../algorithms/recursiveDivision";
import { generateSidewinder } from "../algorithms/sidewinder";
import { generateWilson } from "../algorithms/wilson";
import { generateAldousBroder } from "../algorithms/aldousBroder";

import type { AlgorithmType, MazeGrid } from "../types/maze";
import { randomIntFromInterval } from "./helpers";

// Mapeia algoritmo para função de geração
const generators: Record<
  AlgorithmType,
  (rows: number, cols: number) => MazeGrid
> = {
  "binary-tree": generateBinaryTree,
  "recursive-backtracker": generateRecursiveBacktracker,
  prim: generatePrim,
  kruskal: generateKruskal,
  eller: generateEller,
  wilson: generateWilson,
  "aldous-broder": generateAldousBroder,
  "growing-tree": generateGrowingTree,
  "hunt-and-kill": generateHuntAndKill,
  "recursive-division": generateRecursiveDivision,
  sidewinder: generateSidewinder,
};

export function getRandomGeneratorId() {
  const generatorIds = Object.keys(generators);

  const index = randomIntFromInterval(0, generatorIds.length - 1);

  return generatorIds[index] as AlgorithmType;
}

export function createTile(
  id: string,
  algorithm: AlgorithmType,
  rows = 10,
  cols = 10,
): MazeTile {
  const generator = generators[algorithm];
  if (!generator) {
    throw new Error(`Algoritmo ${algorithm} não suportado.`);
  }
  const grid = generator(rows, cols);

  const connRow = Math.floor(rows / 2);
  const connCol = Math.floor(cols / 2);

  // Exits padrão são meio das bordas, para conexão com vizinhos
  const exits: Exit[] = [];

  if (rows > 1) {
    exits.push(
      {
        direction: "up",
        neighborTileId: "",
        localPosition: { row: 0, col: connCol },
        neighborPosition: { row: rows - 1, col: connCol },
      },
      {
        direction: "down",
        neighborTileId: "",
        localPosition: { row: rows - 1, col: connCol },
        neighborPosition: { row: 0, col: connCol },
      },
    );
  }
  if (cols > 1) {
    exits.push(
      {
        direction: "left",
        neighborTileId: "",
        localPosition: { row: connRow, col: 0 },
        neighborPosition: { row: connRow, col: cols - 1 },
      },
      {
        direction: "right",
        neighborTileId: "",
        localPosition: { row: connRow, col: cols - 1 },
        neighborPosition: { row: connRow, col: 0 },
      },
    );
  }

  return { id, grid, exits };
}

// Função auxiliar para conectar dois tiles (removendo paredes e ajustando exits)
export function connectTiles(
  tileA: MazeTile,
  tileB: MazeTile,
  direction: "right" | "left" | "up" | "down",
) {
  const rows = tileA.grid.length;
  const cols = tileA.grid[0].length;

  let posA, posB;

  switch (direction) {
    case "right":
      posA = { row: Math.floor(rows / 2), col: cols - 1 };
      posB = { row: posA.row, col: 0 };
      removeWall(
        tileA.grid[posA.row][posA.col],
        tileB.grid[posB.row][posB.col],
      );

      tileA.exits.push({
        direction: "right",
        neighborTileId: tileB.id,
        localPosition: posA,
        neighborPosition: posB,
      });
      tileB.exits.push({
        direction: "left",
        neighborTileId: tileA.id,
        localPosition: posB,
        neighborPosition: posA,
      });
      break;

    case "left":
      posA = { row: Math.floor(rows / 2), col: 0 };
      posB = { row: posA.row, col: cols - 1 };
      removeWall(
        tileA.grid[posA.row][posA.col],
        tileB.grid[posB.row][posB.col],
      );

      tileA.exits.push({
        direction: "left",
        neighborTileId: tileB.id,
        localPosition: posA,
        neighborPosition: posB,
      });
      tileB.exits.push({
        direction: "right",
        neighborTileId: tileA.id,
        localPosition: posB,
        neighborPosition: posA,
      });
      break;

    case "up":
      posA = { row: 0, col: Math.floor(cols / 2) };
      posB = { row: rows - 1, col: posA.col };
      removeWall(
        tileA.grid[posA.row][posA.col],
        tileB.grid[posB.row][posB.col],
      );

      tileA.exits.push({
        direction: "up",
        neighborTileId: tileB.id,
        localPosition: posA,
        neighborPosition: posB,
      });
      tileB.exits.push({
        direction: "down",
        neighborTileId: tileA.id,
        localPosition: posB,
        neighborPosition: posA,
      });
      break;

    case "down":
      posA = { row: rows - 1, col: Math.floor(cols / 2) };
      posB = { row: 0, col: posA.col };
      removeWall(
        tileA.grid[posA.row][posA.col],
        tileB.grid[posB.row][posB.col],
      );

      tileA.exits.push({
        direction: "down",
        neighborTileId: tileB.id,
        localPosition: posA,
        neighborPosition: posB,
      });
      tileB.exits.push({
        direction: "up",
        neighborTileId: tileA.id,
        localPosition: posB,
        neighborPosition: posA,
      });
      break;
  }
}
