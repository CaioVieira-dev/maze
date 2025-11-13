import { type MazeGrid } from "../types/maze";
import { createEmptyGrid, removeWall, randomChoice } from "../utils/maze";

/**
 * Algoritmo Binary Tree
 * Para cada célula, escolhe aleatoriamente entre norte ou leste
 */
export function generateBinaryTree(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];
      const neighbors = [];

      // Adiciona vizinho do norte (acima)
      if (row > 0) {
        neighbors.push(grid[row - 1][col]);
      }

      // Adiciona vizinho do leste (direita)
      if (col < cols - 1) {
        neighbors.push(grid[row][col + 1]);
      }

      // Se houver vizinhos disponíveis, escolhe um aleatoriamente
      if (neighbors.length > 0) {
        const chosen = randomChoice(neighbors);
        removeWall(current, chosen);
      }
    }
  }

  return grid;
}
