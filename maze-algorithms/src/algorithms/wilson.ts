import { type MazeGrid, type Cell } from "../types/maze";
import { createEmptyGrid, removeWall, randomChoice } from "../utils/maze";

/**
 * Algoritmo de Wilson
 * Usa caminhadas aleatórias com apagamento de loops (loop-erased random walks)
 * Gera labirintos completamente sem viés - distribuição uniforme
 */
export function generateWilson(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);

  // Rastrear células não visitadas
  const unvisited: Cell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      unvisited.push(grid[row][col]);
    }
  }

  // Escolher uma célula aleatória inicial e marcar como parte do labirinto
  const start = randomChoice(unvisited);
  start.visited = true;
  unvisited.splice(unvisited.indexOf(start), 1);

  // Enquanto houver células não visitadas
  while (unvisited.length > 0) {
    // Escolher uma célula não visitada aleatória para começar o random walk
    let current = randomChoice(unvisited);
    const path: Cell[] = [current];
    const pathMap = new Map<string, number>(); // Rastreia posição na path
    pathMap.set(`${current.row},${current.col}`, 0);

    // Fazer random walk até encontrar uma célula visitada
    while (!current.visited) {
      // Escolher uma direção aleatória
      const neighbors = getValidNeighbors(grid, current);
      const next = randomChoice(neighbors);

      const nextKey = `${next.row},${next.col}`;

      // Se encontrou um loop, apagar o loop da path
      if (pathMap.has(nextKey)) {
        const loopStart = pathMap.get(nextKey)!;
        // Remover tudo depois do loop
        for (let i = path.length - 1; i > loopStart; i--) {
          const removed = path[i];
          pathMap.delete(`${removed.row},${removed.col}`);
        }
        path.length = loopStart + 1;
        current = next;
      } else {
        // Adicionar à path
        path.push(next);
        pathMap.set(nextKey, path.length - 1);
        current = next;
      }
    }

    // Adicionar o caminho ao labirinto
    for (let i = 0; i < path.length - 1; i++) {
      const cell = path[i];
      const nextCell = path[i + 1];

      // Marcar como visitada
      cell.visited = true;

      // Remover da lista de não visitadas
      const idx = unvisited.indexOf(cell);
      if (idx !== -1) {
        unvisited.splice(idx, 1);
      }

      // Conectar as células
      removeWall(cell, nextCell);
    }
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

// Código exemplo Wilson
export const wilsonCode = `function generateWilson(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const unvisited: Cell[] = getAllCells(grid);

  // Escolher célula inicial
  const start = randomChoice(unvisited);
  start.visited = true;
  removeFromList(unvisited, start);

  while (unvisited.length > 0) {
    // Começar random walk de célula não visitada
    let current = randomChoice(unvisited);
    const path: Cell[] = [current];
    const pathMap = new Map<string, number>();

    // Random walk até encontrar célula visitada
    while (!current.visited) {
      const next = randomChoice(getNeighbors(current));

      // Se encontrou loop, apagar o loop
      if (pathMap.has(nextKey)) {
        const loopStart = pathMap.get(nextKey);
        path.length = loopStart + 1; // Apagar loop
        current = next;
      } else {
        path.push(next);
        pathMap.set(nextKey, path.length - 1);
        current = next;
      }
    }

    // Adicionar caminho ao labirinto
    for (let i = 0; i < path.length - 1; i++) {
      path[i].visited = true;
      removeWall(path[i], path[i + 1]);
      removeFromList(unvisited, path[i]);
    }
  }

  return grid;
}`;
