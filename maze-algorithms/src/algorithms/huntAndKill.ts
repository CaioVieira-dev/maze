import { type MazeGrid, type Cell } from "../types/maze";
import {
  createEmptyGrid,
  removeWall,
  getNeighbors,
  randomChoice,
} from "../utils/maze";

/**
 * Algoritmo Hunt-and-Kill
 * Faz random walk até encontrar dead-end, então "caça" por células não visitadas
 * adjacentes a células visitadas
 */
export function generateHuntAndKill(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Escolher célula inicial aleatória
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  let current: Cell | null = grid[startRow][startCol];
  current.visited = true;

  while (current !== null) {
    // Fase "Kill" - Random walk
    const unvisitedNeighbors = getNeighbors(grid, current, true);

    if (unvisitedNeighbors.length > 0) {
      // Continuar random walk
      const chosen = randomChoice(unvisitedNeighbors);
      removeWall(current, chosen);
      chosen.visited = true;
      current = chosen;
    } else {
      // Dead-end - entrar em modo "Hunt"
      current = hunt(grid, rows, cols);
    }
  }

  return grid;
}

/**
 * Fase "Hunt" - Escaneia o grid procurando célula não visitada adjacente a visitada
 */
function hunt(grid: MazeGrid, rows: number, cols: number): Cell | null {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];

      // Procurar célula não visitada
      if (!cell.visited) {
        // Verificar se tem vizinho visitado
        const visitedNeighbors = getNeighbors(grid, cell).filter(
          (neighbor) => neighbor.visited
        );

        if (visitedNeighbors.length > 0) {
          // Conectar a um vizinho visitado aleatório
          const chosen = randomChoice(visitedNeighbors);
          removeWall(cell, chosen);
          cell.visited = true;
          return cell; // Retornar como nova célula atual
        }
      }
    }
  }

  // Não encontrou nenhuma célula não visitada - terminado
  return null;
}
