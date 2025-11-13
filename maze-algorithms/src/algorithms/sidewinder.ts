import { type MazeGrid } from "../types/maze";
import { createEmptyGrid, removeWall } from "../utils/maze";

/**
 * Algoritmo Sidewinder
 * Evolução do Binary Tree - remove o corredor na borda direita
 * Cria "runs" horizontais e escolhe um ponto aleatório para ir ao norte
 */
export function generateSidewinder(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  for (let row = 0; row < rows; row++) {
    let runStart = 0;

    for (let col = 0; col < cols; col++) {
      const current = grid[row][col];

      // CASO ESPECIAL: Primeira linha sempre vai para o leste
      if (row === 0) {
        if (col < cols - 1) {
          const east = grid[row][col + 1];
          removeWall(current, east);
        }
        continue; // Pular para próxima coluna
      }

      // Para as outras linhas, seguir a lógica normal
      const isLastCol = col === cols - 1;

      if (isLastCol) {
        // Última coluna - fechar o run e ir ao norte
        const runLength = col - runStart + 1;
        const randomCol = runStart + Math.floor(Math.random() * runLength);
        const randomCell = grid[row][randomCol];
        const north = grid[row - 1][randomCol];
        removeWall(randomCell, north);
      } else {
        // Decidir: ir para leste ou fechar o run?
        const shouldCloseRun = Math.random() < 0.5;

        if (shouldCloseRun) {
          // Fechar o run - escolher célula aleatória para ir ao norte
          const runLength = col - runStart + 1;
          const randomCol = runStart + Math.floor(Math.random() * runLength);
          const randomCell = grid[row][randomCol];
          const north = grid[row - 1][randomCol];
          removeWall(randomCell, north);
          runStart = col + 1; // Começar novo run
        } else {
          // Continuar o run para leste
          const east = grid[row][col + 1];
          removeWall(current, east);
        }
      }
    }
  }

  return grid;
}
