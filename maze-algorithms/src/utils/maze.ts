import { type Cell, type MazeGrid } from "../types/maze";

/**
 * Cria um grid vazio com todas as paredes intactas
 */
export function createEmptyGrid(rows: number, cols: number): MazeGrid {
  const grid: MazeGrid = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: Cell[] = [];
    for (let col = 0; col < cols; col++) {
      currentRow.push({
        row,
        col,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true,
        },
        visited: false,
      });
    }
    grid.push(currentRow);
  }

  return grid;
}

/**
 * Remove a parede entre duas células adjacentes
 */
export function removeWall(current: Cell, neighbor: Cell): void {
  const rowDiff = current.row - neighbor.row;
  const colDiff = current.col - neighbor.col;

  // Neighbor está acima
  if (rowDiff === 1) {
    current.walls.top = false;
    neighbor.walls.bottom = false;
  }
  // Neighbor está abaixo
  else if (rowDiff === -1) {
    current.walls.bottom = false;
    neighbor.walls.top = false;
  }
  // Neighbor está à esquerda
  else if (colDiff === 1) {
    current.walls.left = false;
    neighbor.walls.right = false;
  }
  // Neighbor está à direita
  else if (colDiff === -1) {
    current.walls.right = false;
    neighbor.walls.left = false;
  }
}

/**
 * Obtém vizinhos válidos de uma célula
 */
export function getNeighbors(
  grid: MazeGrid,
  cell: Cell,
  unvisitedOnly = false
): Cell[] {
  const neighbors: Cell[] = [];
  const { row, col } = cell;
  const rows = grid.length;
  const cols = grid[0].length;

  // Top
  if (row > 0) {
    const neighbor = grid[row - 1][col];
    if (!unvisitedOnly || !neighbor.visited) {
      neighbors.push(neighbor);
    }
  }

  // Right
  if (col < cols - 1) {
    const neighbor = grid[row][col + 1];
    if (!unvisitedOnly || !neighbor.visited) {
      neighbors.push(neighbor);
    }
  }

  // Bottom
  if (row < rows - 1) {
    const neighbor = grid[row + 1][col];
    if (!unvisitedOnly || !neighbor.visited) {
      neighbors.push(neighbor);
    }
  }

  // Left
  if (col > 0) {
    const neighbor = grid[row][col - 1];
    if (!unvisitedOnly || !neighbor.visited) {
      neighbors.push(neighbor);
    }
  }

  return neighbors;
}

/**
 * Escolhe um elemento aleatório de um array
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
