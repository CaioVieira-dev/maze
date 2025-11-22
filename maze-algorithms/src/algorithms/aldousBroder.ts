import { type MazeGrid, type Cell } from "../types/maze";
import { createEmptyGrid, removeWall, randomChoice } from "../utils/maze";

/**
 * Algoritmo de Aldous-Broder
 * Usa caminhada aleatória simples (drunkard's walk)
 * Muito simples mas extremamente ineficiente - revisita células já visitadas
 */
export function generateAldousBroder(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Começar em uma célula aleatória
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  let current = grid[startRow][startCol];
  current.visited = true;

  // Contar quantas células ainda não foram visitadas
  let remaining = rows * cols - 1;

  // Continuar até todas as células serem visitadas
  while (remaining > 0) {
    // Escolher um vizinho aleatório
    const neighbors = getValidNeighbors(grid, current);
    const next = randomChoice(neighbors);

    // Se o vizinho ainda não foi visitado, conectar e marcar
    if (!next.visited) {
      removeWall(current, next);
      next.visited = true;
      remaining--;
    }

    // Mover para o vizinho (visitado ou não - essa é a ineficiência!)
    current = next;
  }

  return grid;
}

/**
 * Obtém vizinhos válidos (dentro dos limites do grid)
 */
function getValidNeighbors(grid: MazeGrid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  const { row, col } = cell;
  const rows = grid.length;
  const cols = grid[0].length;

  // Top
  if (row > 0) neighbors.push(grid[row - 1][col]);

  // Right
  if (col < cols - 1) neighbors.push(grid[row][col + 1]);

  // Bottom
  if (row < rows - 1) neighbors.push(grid[row + 1][col]);

  // Left
  if (col > 0) neighbors.push(grid[row][col - 1]);

  return neighbors;
}

// Código exemplo Aldous-Broder
export const aldousBroderCode = `function generateAldousBroder(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  
  // Começar em célula aleatória
  let current = grid[randomRow][randomCol];
  current.visited = true;

  let remaining = rows * cols - 1;

  // Continuar até todas serem visitadas
  while (remaining > 0) {
    // Escolher vizinho aleatório
    const next = randomChoice(getNeighbors(current));

    // Se não foi visitado, conectar
    if (!next.visited) {
      removeWall(current, next);
      next.visited = true;
      remaining--;
    }

    // Mover para o vizinho (visitado ou não!)
    // Essa é a ineficiência do algoritmo
    current = next;
  }

  return grid;
}`;
