import { type MazeGrid, type Cell } from "../types/maze";
import {
  createEmptyGrid,
  removeWall,
  getNeighbors,
  randomChoice,
} from "../utils/maze";

/**
 * Algoritmo Growing Tree
 * Flexível - pode simular outros algoritmos dependendo de como escolhe células
 * Esta implementação usa uma mistura: 50% newest (como DFS), 50% random (como Prim)
 */
export function generateGrowingTree(rows: number, cols: number): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const cells: Cell[] = [];

  // Escolher célula inicial aleatória
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  const startCell = grid[startRow][startCol];

  startCell.visited = true;
  cells.push(startCell);

  // Continuar enquanto houver células na lista
  while (cells.length > 0) {
    // Escolher uma célula da lista (estratégia mixta)
    const index = chooseCellIndex(cells.length);
    const current = cells[index];

    // Obter vizinhos não visitados
    const unvisitedNeighbors = getNeighbors(grid, current, true);

    if (unvisitedNeighbors.length > 0) {
      // Escolher vizinho aleatório
      const chosen = randomChoice(unvisitedNeighbors);

      // Conectar
      removeWall(current, chosen);
      chosen.visited = true;

      // Adicionar à lista
      cells.push(chosen);
    } else {
      // Sem vizinhos não visitados, remover da lista
      cells.splice(index, 1);
    }
  }

  return grid;
}

/**
 * Estratégia de seleção de células
 * 50% escolhe a mais nova (newest) - comportamento DFS
 * 50% escolhe aleatória - comportamento Prim
 */
function chooseCellIndex(length: number): number {
  if (Math.random() < 0.5) {
    // Escolher a mais nova (última da lista)
    return length - 1;
  } else {
    // Escolher aleatória
    return Math.floor(Math.random() * length);
  }
}
