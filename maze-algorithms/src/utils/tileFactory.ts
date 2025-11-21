import { generateRecursiveBacktracker } from "../algorithms/recursiveBacktracker";
import { removeWall } from "./maze";
import type { MazeTile } from "../types/tiles";

export function createConnectedTiles(): MazeTile[] {
  const rows = 10;
  const cols = 10;

  const gridA = generateRecursiveBacktracker(rows, cols);
  const gridB = generateRecursiveBacktracker(rows, cols);

  // Posição de conexão nas bordas
  const connRow = Math.floor(rows / 2);
  const connColA = cols - 1;
  const connColB = 0;

  // Remove as paredes para conectar ambos
  removeWall(gridA[connRow][connColA], gridB[connRow][connColB]);

  const tileA: MazeTile = {
    id: "A",
    grid: gridA,
    exits: [
      {
        direction: "right",
        neighborTileId: "B",
        localPosition: { row: connRow, col: connColA },
        neighborPosition: { row: connRow, col: connColB },
      },
    ],
  };

  const tileB: MazeTile = {
    id: "B",
    grid: gridB,
    exits: [
      {
        direction: "left",
        neighborTileId: "A",
        localPosition: { row: connRow, col: connColB },
        neighborPosition: { row: connRow, col: connColA },
      },
    ],
  };

  return [tileA, tileB];
}

import { generateBinaryTree } from "../algorithms/binaryTree";

export function createHorizontalTiles(
  count: number,
  rows: number,
  cols: number
) {
  const tiles = Array.from({ length: count }, () =>
    generateBinaryTree(rows, cols)
  );
  // Remove as paredes entre tiles vizinhos (direita de um, esquerda do outro)
  for (let i = 0; i < count - 1; i++) {
    const tileA = tiles[i];
    const tileB = tiles[i + 1];

    // Conexão do meio da borda direita/esquerda
    const row = Math.floor(rows / 2);
    removeWall(tileA[row][cols - 1], tileB[row][0]);
  }
  return tiles;
}
