import { type MazeGrid, type Cell } from "../types/maze";
import { createEmptyGrid, removeWall } from "../utils/maze";
import { DisjointSet } from "../utils/disjointSet";

interface Wall {
  cell1: Cell;
  cell2: Cell;
}

/**
 * Algoritmo de Kruskal (Randomizado)
 * Usa Union-Find para criar uma árvore geradora mínima
 */
export function generateKruskal(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const walls: Wall[] = [];
  const disjointSet = new DisjointSet();

  // Criar um conjunto para cada célula
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cellKey = `${row},${col}`;
      disjointSet.makeSet(cellKey);
    }
  }

  // Coletar todas as paredes (edges) possíveis
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];

      // Parede à direita
      if (col < cols - 1) {
        walls.push({
          cell1: current,
          cell2: grid[row][col + 1],
        });
      }

      // Parede abaixo
      if (row < rows - 1) {
        walls.push({
          cell1: current,
          cell2: grid[row + 1][col],
        });
      }
    }
  }

  // Embaralhar as paredes aleatoriamente
  shuffleArray(walls);

  // Processar cada parede
  for (const wall of walls) {
    const { cell1, cell2 } = wall;
    const key1 = `${cell1.row},${cell1.col}`;
    const key2 = `${cell2.row},${cell2.col}`;

    // Se as células não estão no mesmo conjunto, remove a parede
    if (!disjointSet.connected(key1, key2)) {
      removeWall(cell1, cell2);
      disjointSet.union(key1, key2);
    }
  }

  return grid;
}

/**
 * Embaralha um array usando Fisher-Yates shuffle
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
