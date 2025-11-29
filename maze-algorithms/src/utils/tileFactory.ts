import { generateRecursiveBacktracker } from "../algorithms/recursiveBacktracker";
import { removeWall } from "./maze";
import type { Exit, MazeTile } from "../types/tiles";

import { generateBinaryTree } from "../algorithms/binaryTree";

import type { AlgorithmType, MazeGrid } from "../types/maze";

// Mapeia algoritmo para função de geração
const generators: Record<
  AlgorithmType,
  (rows: number, cols: number) => MazeGrid
> = {
  "binary-tree": generateBinaryTree,
  "recursive-backtracker": generateRecursiveBacktracker,
  // adicionar demais algoritmos aqui...
  // exemplo: "prim": generatePrim,
  prim: () => {
    throw new Error("Prim ainda não implementado aqui");
  },
  kruskal: () => {
    throw new Error("Kruskal ainda não implementado aqui");
  },
  eller: () => {
    throw new Error("Eller ainda não implementado aqui");
  },
  wilson: () => {
    throw new Error("Wilson ainda não implementado aqui");
  },
  "aldous-broder": () => {
    throw new Error("Aldous-Broder ainda não implementado aqui");
  },
  "growing-tree": () => {
    throw new Error("Growing-Tree ainda não implementado aqui");
  },
  "hunt-and-kill": () => {
    throw new Error("Hunt-and-Kill ainda não implementado aqui");
  },
  "recursive-division": () => {
    throw new Error("Recursive Division ainda não implementado aqui");
  },
  sidewinder: () => {
    throw new Error("Sidewinder ainda não implementado aqui");
  },
};

export function createTile(
  id: string,
  algorithm: AlgorithmType,
  rows = 10,
  cols = 10
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
      }
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
      }
    );
  }

  return { id, grid, exits };
}

// Função auxiliar para conectar dois tiles (removendo paredes e ajustando exits)
export function connectTiles(
  tileA: MazeTile,
  tileB: MazeTile,
  direction: "right" | "left" | "up" | "down"
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
        tileB.grid[posB.row][posB.col]
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
        tileB.grid[posB.row][posB.col]
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
        tileB.grid[posB.row][posB.col]
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
        tileB.grid[posB.row][posB.col]
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
