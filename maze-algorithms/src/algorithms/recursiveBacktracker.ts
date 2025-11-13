import { type MazeGrid } from "../types/maze";
import {
  createEmptyGrid,
  removeWall,
  getNeighbors,
  randomChoice,
} from "../utils/maze";

/**
 * Algoritmo Recursive Backtracker (DFS)
 * Usa busca em profundidade com backtracking para gerar o labirinto
 */
export function generateRecursiveBacktracker(
  rows: number,
  cols: number
): MazeGrid {
  const grid = createEmptyGrid(rows, cols);
  const stack: (typeof grid)[0][0][] = [];

  // Começar na célula (0, 0)
  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek (não remove ainda)

    // Obter vizinhos não visitados
    const unvisitedNeighbors = getNeighbors(grid, current, true);

    if (unvisitedNeighbors.length > 0) {
      // Escolher um vizinho aleatório
      const chosen = randomChoice(unvisitedNeighbors);

      // Remover parede entre current e chosen
      removeWall(current, chosen);

      // Marcar chosen como visitado e adicionar à pilha
      chosen.visited = true;
      stack.push(chosen);
    } else {
      // Sem vizinhos não visitados, fazer backtrack
      stack.pop();
    }
  }

  return grid;
}
