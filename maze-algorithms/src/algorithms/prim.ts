import { type MazeGrid, type Cell } from "../types/maze";
import {
  createEmptyGrid,
  removeWall,
  getNeighbors,
  randomChoice,
} from "../utils/maze";

/**
 * Algoritmo de Prim (Randomizado)
 * Expande o labirinto a partir de uma fronteira de células
 */
export function generatePrim(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const frontier: Cell[] = [];

  // Começar com uma célula aleatória
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  const startCell = grid[startRow][startCol];

  // Marcar como parte do labirinto
  startCell.visited = true;

  // Adicionar vizinhos à fronteira
  addToFrontier(grid, startCell, frontier);

  // Enquanto houver células na fronteira
  while (frontier.length > 0) {
    // Escolher célula aleatória da fronteira
    const randomIndex = Math.floor(Math.random() * frontier.length);
    const current = frontier.splice(randomIndex, 1)[0];

    // Obter vizinhos que já estão no labirinto (visitados)
    const visitedNeighbors = getNeighbors(grid, current).filter(
      (neighbor) => neighbor.visited
    );

    if (visitedNeighbors.length > 0) {
      // Escolher um vizinho visitado aleatório para conectar
      const chosen = randomChoice(visitedNeighbors);

      // Remover parede entre current e chosen
      removeWall(current, chosen);

      // Marcar current como visitado
      current.visited = true;

      // Adicionar vizinhos não visitados de current à fronteira
      addToFrontier(grid, current, frontier);
    }
  }

  return grid;
}

/**
 * Adiciona vizinhos não visitados à fronteira
 */
function addToFrontier(grid: MazeGrid, cell: Cell, frontier: Cell[]): void {
  const neighbors = getNeighbors(grid, cell, true); // Apenas não visitados

  for (const neighbor of neighbors) {
    // Verificar se já está na fronteira
    if (!frontier.includes(neighbor)) {
      frontier.push(neighbor);
    }
  }
}
